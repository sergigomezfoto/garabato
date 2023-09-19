'use client'

import { db } from '@/firebase/firebase';
import { collection, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { executeApiGet } from '@/app/helpers/executApiGet';
import LoadingText from './LoadingText';
import SinglePlayer from './SinglePlayer';
import usePlayersListener from '@/app/hooks/usePlayerListener';
import ButtonPromise from './design/ButtonPromise';
interface WaitingRoomProps {
  sala: string;
  isMaster: boolean; // Afegim aquesta propietat
}

/**
 * The `WaitingRoom` component is a React functional component that displays a waiting room for a game,
 * with a list of players and an option to close the room if the user is the master.
 * @param  - - `sala`: The ID of the room or game session.
 * @returns The component is returning a JSX fragment that includes the following elements:
 */
const WaitingRoom: React.FC<WaitingRoomProps> = ({ sala, isMaster }) => {
  const players = usePlayersListener(sala);  // hook personalitzat per veure els jugador que hi ha
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const salaRef = doc(db, 'grabatoTest', sala);
    const unsubscribe = onSnapshot(salaRef, (docSnapshot) => {
      if (docSnapshot.exists() && docSnapshot.data()?.closedRoom) {
        router.push('/drawing');
      }
    });
    return () => unsubscribe();
  }, [sala, router]);

  /**
   * The `closeRoom` function is executed only on the  room creator, 
   * fetch the phrases from the API and gives an order to turnIds for each player.
   */
  const handleOnClick = async () => {
    setLoading(true);
    try {
      const apiUrl = `${window.location.origin}/api/randomword/${players.length}/30`;
      const data = await executeApiGet(apiUrl);

      if (data.phrases && data.phrases.length === players.length) {
        const batchPhrases = writeBatch(db);
        const turnIds = Array.from({ length: players.length }, (_, i) => i).sort(() => Math.random() - 0.5);

        players.forEach((player, index) => {
          const playerRef = doc(db, 'grabatoTest', sala, 'players', player.id);
          batchPhrases.update(playerRef, {
            phrase: data.phrases[index],
            drawing: null,
            turnId: turnIds[index]
          });
        });
        await batchPhrases.commit();
        const salaRef = doc(db, 'grabatoTest', sala);
        await updateDoc(salaRef, { closedRoom: true });
      } else {
        console.error('El nombre de frases no coincideix amb el nombre de jugadors.');
      }
    } catch (error) {
      console.error('Hi ha hagut un error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingText text="preparando el juego..." />}
      <h2 className="text-2xl font-bold mb-4">jugadores</h2>
      <div className="flex flex-wrap max-w-md justify-center gap-4">
        {players.map((player, index) => (
          <SinglePlayer key={index} avatar={player.avatar} name={player.name} />
        ))}
      </div>
      {isMaster &&
        // <button onClick={handleOnClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
        //   Cerrar sala
        // </button>
        <ButtonPromise onClick={handleOnClick}>
          Cerrar sala
        </ButtonPromise>
      }
    </>
  );
};

export default WaitingRoom;
'use client'

import { db } from '@/firebase/firebase';
import { onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { executeApiGet } from '@/app/helpers/executApiGet';

import SinglePlayer from './SinglePlayer';
import usePlayersListener from '@/app/hooks/usePlayerListener';
import ButtonPromise from './design/ButtonPromise';
interface WaitingRoomProps {
  sala: string;
  isMaster: boolean; // Afegim aquesta propietat
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ sala, isMaster }) => {
  const players = usePlayersListener(sala);  // hook personalitzat per veure els jugador que hi ha
  const router = useRouter();
  console.log('---PLAYERS LENGHT---- ', players.length);

  const [userNumber, setUserNumber] = useState(0);
  const necessaryUserNumber = 3;
  useEffect(() => {
    setUserNumber(players.length);
  }, [players]);

  const missingUsers = necessaryUserNumber - userNumber;
  const text = userNumber >= necessaryUserNumber
    ? "Cerrar sala"
    : missingUsers === 1
      ? "Falta 1 usuario"
      : `Faltan ${missingUsers} usuarios`;
  const isDisabled = userNumber < necessaryUserNumber;


  useEffect(() => {
    const salaRef = doc(db, 'grabatoTest', sala);
    const unsubscribe = onSnapshot(salaRef, (docSnapshot) => {
      if (docSnapshot.exists() && docSnapshot.data()?.closedRoom) {
        router.push('/drawing');
      }
    });
    return () => {
      unsubscribe()
    };
  }, [router, sala]);


  const handleOnClick = async () => {

    try {
      const apiUrl = `${window.location.origin}/api/randomword/${players.length}/20`;
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
    }
  };

  return (
    <>
      <h2 className="text-2xl mb-4">jugadores</h2>
      <div className="flex flex-wrap max-w-md justify-center gap-4">
        {players.map((player, index) => (
          <SinglePlayer key={index} avatar={player.avatar} name={player.name} />
        ))}
      </div>
      {isMaster &&
        <ButtonPromise onClick={handleOnClick} isDisabled={isDisabled}>
          {text}
        </ButtonPromise>
      }
    </>
  );
};

export default WaitingRoom; 
'use client'

import { db } from '@/firebase/firebase';
import { collection, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import useCloseRoomAfterTimeout from '@/app/hooks/useCloseRoomAfterTimeout';
//TODO POSAR BOTÓ A MASTER PER TANCAR LA ROOM
interface WaitingRoomProps {
  sala: string;
  isMaster: boolean; // Afegim aquesta propietat
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ sala, isMaster }) => {
  console.log('isMaster', isMaster);

  // comprovar si s'ha d'tancar la sala després d'un temps d'inactivitat
  // useCloseRoomAfterTimeout(sala);
  const [players, setPlayers] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    const salaRef = doc(db, 'grabatoTest', sala);
    const unsubscribe = onSnapshot(salaRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.closedRoom) {
          router.push('/startgame');
        }
      }
    });
    return () => unsubscribe(); // Desubscriure's quan el component es desmonti
  }, [sala, router]);

  useEffect(() => {
    const playersCollectionRef = collection(db, 'grabatoTest', sala, 'players');
    const unsubscribePlayers = onSnapshot(playersCollectionRef, snapshot => {
      const playersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPlayers(playersData);
    });

    return () => unsubscribePlayers(); // Desubscriure's quan el component es desmonti
  }, [sala]);

  const closeRoom = async () => {
    let apiUrl: string;

    if (typeof window !== 'undefined') {
      const currentPath = window.location.origin;
      console.log(currentPath);

      apiUrl = `${currentPath}/api/randomword/${players.length}/30`;
      console.log(apiUrl);


    } else {
      console.error(`No es pot accedir a la URL actual des de l'entorn actual.`);
      return;
    }
    try {
      // Realitzar una crida a la API
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error en la crida a la API');
      }
      // Processar la resposta, si cal
      const data = await response.json();
      if (data.phrases && data.phrases.length === players.length) {
        const batchPhrases = writeBatch(db);  // Crear un lot    

        // Creem una llista de turnIds possibles
        const turnIds = Array.from({ length: players.length }, (_, i) => i);
        // Desordenem la llista
        turnIds.sort(() => Math.random() - 0.5);


        players.forEach((player, index) => {
          const playerRef = doc(db, 'grabatoTest', sala, 'players', player.id);
          const updateData = {
            phrase: data.phrases[index],
            drawing: null,
            turnId: turnIds[index]
          };
          batchPhrases.update(playerRef, updateData);  // Afegir una actualització al lot
        });

        await batchPhrases.commit();  // Enviar totes les actualitzacions alhora

        // Ara tanquem la sala i això s'escoltarà amb el useEffect que et portarà a la ruta de la Celeste
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
      <h2 className="text-2xl font-bold mb-4">Sala de espera</h2>

      <div className="flex flex-wrap max-w-md justify-center gap-4">
        {players.map((player, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <img src={player.avatar} alt={player.name} className="rounded-full w-16 h-16" />
            <span className="text-lg">{player.name}</span>
          </div>
        ))}
      </div>
      {isMaster ? (  // Mostrem el botó només si isMaster és true
        <button onClick={closeRoom}>Cerrar la Sala</button>
      ) : null}
    </>
  );
}


export default WaitingRoom;
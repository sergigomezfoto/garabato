'use client'

import { db } from '@/firebase/firebase';
import { collection, onSnapshot, doc,updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import useCloseRoomAfterTimeout from '@/app/hooks/useCloseRoomAfterTimeout';
//TODO POSAR BOTÓ A MASTER PER TANCAR LA ROOM
interface WaitingRoomProps {
  sala: string;
  isMaster: boolean; // Afegim aquesta propietat
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ sala, isMaster  }) => {
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
      const playersData = snapshot.docs.map(doc => doc.data());
      setPlayers(playersData);
    });

    return () => unsubscribePlayers(); // Desubscriure's quan el component es desmonti
  }, [sala]);

  const closeRoom = async () => {
    const salaRef = doc(db, 'grabatoTest', sala);
    await updateDoc(salaRef, { closedRoom: true });
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
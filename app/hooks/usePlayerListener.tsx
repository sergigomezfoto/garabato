import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

const usePlayersListener = (sala: string) => {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const playersCollectionRef = collection(db, 'grabatoTest', sala, 'players');
    const unsubscribePlayers = onSnapshot(playersCollectionRef, snapshot => {
      const playersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPlayers(playersData);
    });

    return () => unsubscribePlayers();  // Desubscriure's quan el component es desmonti
  }, [sala]);

  return players;
};

export default usePlayersListener;
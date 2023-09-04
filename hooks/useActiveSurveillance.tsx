import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

type Player = {
    id: string;
    name: string;
    avatar: string;
};

const useActiveSurveillance = (sala: string): Player[] => {
    const [activePlayers, setActivePlayers] = useState<Player[]>([]);

    useEffect(() => {
        const playersCollectionRef = collection(db, 'grabatoTest', sala, 'players');
        const unsubscribe = onSnapshot(playersCollectionRef, snapshot => {
            const players: Player[] = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                avatar: doc.data().avatar
            }));
            setActivePlayers(players);
        });

        return () => unsubscribe(); // Desubscriure's quan el hook es desmonti
    }, [sala]);

    return activePlayers;
}

export default useActiveSurveillance;


// function MyComponent() {
//     const sala = "nomDeLaSala";
//     const activePlayers = useActiveSurveillance(sala);

//     // La teva lògica del component aquí
// }







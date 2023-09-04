import { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';




const  useLastUpdated=(sala:string)=> {
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const salaRef = doc(db, 'grabatoTest', sala);
    const unsubscribe = onSnapshot(salaRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setLastUpdated(data.lastUpdated?.toDate()); // Convertir el Timestamp a un objecte Date
      }
    });

    return () => unsubscribe(); // Desubscriure's quan el component es desmonti
  }, [sala]);

  return lastUpdated;
}

export default useLastUpdated;
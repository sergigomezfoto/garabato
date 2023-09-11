import { useEffect, useRef } from 'react';
import { db } from '@/firebase/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const useCloseRoomAfterTimeout = (sala:string) => {
    const timeoutRef = useRef<number | NodeJS.Timeout | null>(null);

  useEffect(() => {
    const playersCollectionRef = collection(db, 'grabatoTest', sala, 'players');  
    // Escolta canvis en la col·lecció de jugadors
    const unsubscribe = onSnapshot(playersCollectionRef, () => {
      // Cancel·la el setTimeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Estableix un nou setTimeout per 20 segons
       timeoutRef.current = setTimeout(() => {
        const salaRef = doc(db, 'grabatoTest', sala);
        updateDoc(salaRef, { closedRoom: true });
        // Aquí també pots afegir la redirecció a la ruta desitjada
      }, 20000); // 20 segons
    });
    
    return () => {
      // Neteja quan el component es desmonti
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      unsubscribe();
    };
  }, [sala]);
}

export default useCloseRoomAfterTimeout;

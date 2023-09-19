'use client'
import { useState, useEffect, useCallback } from 'react';
import InitialUserForm from '../../../../components/InitialUserForm';
import WaitingRoom from '../../../../components/WaitingRoom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';


type JoinPageProps = {
  params: {
    sala: string;
  };
}

const JoinPage: React.FC<JoinPageProps> = ({ params }) => {
  const [hasJoined, setHasJoined] = useState(false); // Estat per saber si l'usuari s'ha unit a la sala
  const [salaExists, setSalaExists] = useState<boolean | null>(null); // la sala existeix?
  const [salaClosed, setSalaClosed] = useState<boolean | null>(null); // estat per comprovar si la sala està tancada
  const [creator, setCreator] = useState<boolean>(false);
  const [creatorInit, setCreatorInit] = useState<boolean>(false)
  
  useEffect(() => {
    setCreator('true' === localStorage.getItem('GarabatoCreator'))
    localStorage.removeItem('GarabatoCreator')
    setCreatorInit(true)
  }, []);

  useEffect(() => {    
    // Comprova si la sala existeix i si està tancada
    const checkSalaExists = async () => {
      const salaRef = doc(db, 'grabatoTest', params.sala);
      const docSnapshot = await getDoc(salaRef);
      if (docSnapshot.exists()) {
        setSalaExists(true);
        setSalaClosed(docSnapshot.data().closedRoom);
      } else {
        setSalaExists(false);
      }
    };
    checkSalaExists();

  }, []);


  if (salaExists === null) {
    return <div className="flex flex-col items-center justify-center">Comprovando sala...</div>;
  }
  if (salaExists === false) {
    return <div className="flex flex-col items-center justify-center text-red-500">La sala no existe</div>;
  }
  if (salaClosed) {
    return <div className="flex flex-col items-center justify-center text-red-500">La sala está cerrada</div>;
  }
  if (!creatorInit) {
    return <div className="flex flex-col items-center justify-center text-red-500">Comprobando creator</div>;
  }

  return (
    <>
      {hasJoined
        ?
        <WaitingRoom sala={params.sala} isMaster={creator}/>
        :
        <InitialUserForm sala={params.sala} onJoin={() => setHasJoined(true)} master={creator} />
      }
    </>
  );
}

export default JoinPage;
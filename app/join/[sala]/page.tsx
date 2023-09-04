'use client'
import { useState, useEffect } from 'react';
import InitialUserForm from '../../../components/InitialUserForm';
import WaitingRoom from '../../../components/WaitingRoom';
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

  }, [params.sala]);

  if (salaExists === null) {
    return <div className="min-h-screen flex items-center justify-center">Comprovant sala...</div>;
  }
  if (salaExists === false) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">La sala no existeix</div>;
  }
  if (salaClosed) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Ja no poden accedir més jugadors</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Sala de joc: <span className="text-blue-500">{params.sala}</span></h1>
      </div>
      <div className="flex-grow flex items-center justify-center">
        {hasJoined
          ?
          <WaitingRoom sala={params.sala} />
          :
          <InitialUserForm sala={params.sala} onJoin={() => setHasJoined(true)} />
        }
      </div>
    </div>
  );
}

export default JoinPage;
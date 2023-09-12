'use client'
import { useState, useEffect } from 'react';
import InitialUserForm from '../../../components/InitialUserForm';
import WaitingRoom from '../../../components/WaitingRoom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

const JoinPage: React.FC = () => {
  const [salaID, setSalaID] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [salaExists, setSalaExists] = useState<boolean | null>(null);
  const [salaClosed, setSalaClosed] = useState<boolean | null>(null);

  const checkSalaExists = async () => {
    const salaRef = doc(db, 'grabatoTest', salaID);
    const docSnapshot = await getDoc(salaRef);
    if (docSnapshot.exists()) {
      setSalaExists(true);
      setSalaClosed(docSnapshot.data().closedRoom);
    } else {
      setSalaExists(false);
    }
  };

  const handleJoinClick = () => {
    checkSalaExists();
  };

  if (salaExists === null) {
    return (
        <div className="flex flex-col items-center justify-center ">
        <div className="w-full max-w-xs">
          <form className="flex flex-col items-center space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="salaID">
                Únete a una sala
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="salaID"
                type="text"
                placeholder="nombre de la sala"
                value={salaID}
                onChange={(e) => setSalaID(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleJoinClick}
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </div>)
      
  }

  if (salaExists === false) {
    return <div>Room does not exist</div>;
  }

  if (salaClosed) {
    return <div>Room is closed</div>;
  }

  return (
    <div>
      {hasJoined ? (
        <WaitingRoom sala={salaID} />
      ) : (
        <InitialUserForm sala={salaID} onJoin={() => setHasJoined(true)} />
      )}
    </div>
  );
};

export default JoinPage;

'use client'
import { useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import DrawingCanvas
 from './DrawingCanvas';
interface InitialUserFormProps {
  sala: string;
  onJoin: () => void;
}

const InitialUserForm: React.FC<InitialUserFormProps> = ({ sala, onJoin }) => {
  const [username, setUsername] = useState('');
  const [drawingData, setDrawingData] = useState('');

  const handleGetImage = (data: string) => {
    setDrawingData(data);
  };

  const styles = {
    border: '0.0625rem solid #9c9c9c',
    borderRadius: '0.25rem',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && drawingData) {
      const playersCollectionRef = collection(db, 'grabatoTest', sala, 'players');
      const newPlayerData = {
        name: username,
        avatar: drawingData,  // Store drawing string here
      };

      const docRef = await addDoc(playersCollectionRef, newPlayerData);
      const playerData = {
        playerId: docRef.id,
        sala: sala,
      };
      localStorage.setItem('GarabatoTest', JSON.stringify(playerData));
      onJoin();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <DrawingCanvas onGetImage={handleGetImage} />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="p-2 border rounded"
      />
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Submit
      </button>
    </div>
  );
};

export default InitialUserForm;

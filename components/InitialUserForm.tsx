import React, { useRef, useState, useEffect } from 'react';
import { db } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import DrawingCanvas from './DrawingCanvas';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import ButtonPromise from './design/ButtonPromise';
import normalizeInput from '@/app/helpers/normalizeInputText';
interface InitialUserFormProps {
  sala: string;
  onJoin: () => void;
  master: boolean;
}

const InitialUserForm: React.FC<InitialUserFormProps> = ({ sala, onJoin, master }) => {
  const [username, setUsername] = useState('');
  const [drawingData, setDrawingData] = useState('');
  const [isButtonActive, setButtonActive] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
  useEffect(() => {
    setButtonActive(username.trim().length > 0 && drawingData === 'interacted');
  }, [username, drawingData]);
  
  const handleCanvasInteraction = () => {
    console.log('interacted');
    setInteractionCount(prevCount => prevCount + 1);
    if (interactionCount === 1) { // Comença a comptar des de 0, així que a la segona interió serià 1
      setDrawingData('interacted');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await canvasRef.current!.exportImage('png');
    if (username && data) {
      const playersCollectionRef = collection(db, 'grabatoTest', sala, 'players');
      const newPlayerData = {
        name: username,
        avatar: data,
        isMaster: master,
      };
      const docRef = await addDoc(playersCollectionRef, newPlayerData);
      localStorage.setItem('GarabatoTest', JSON.stringify({ playerId: docRef.id, sala }));
      onJoin();
    }
  };

  return (
    <><div>Dibújate a ti mismo y escribe tu nombre de usuario.</div>
      <DrawingCanvas canvasRef={canvasRef} onChange={handleCanvasInteraction} />
      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(normalizeInput(e.target.value))}
          placeholder="tu nombre aquí"
          className="p-2 border rounded"
        />
        <ButtonPromise
          onClick={() => handleSubmit(new Event('click') as any)}
          isDisabled={!isButtonActive}
        >
         ¡Ya está!
        </ButtonPromise>
      </div>
    </>
  );
};

export default InitialUserForm;
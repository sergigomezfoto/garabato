import React, { useRef, useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import DrawingCanvas from './DrawingCanvas';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import Button from './design/Button';
import ButtonPromise from './design/ButtonPromise';

interface InitialUserFormProps {
  sala: string;
  onJoin: () => void;
  master: boolean;

}/**
 * The InitialUserForm component is a form that allows users to draw themselves, enter their username and submit it.
 * @param  - - `sala`: The room or game identifier.
 * @returns The InitialUserForm component is returning a JSX element.
 */
const InitialUserForm: React.FC<InitialUserFormProps> = ({ sala, onJoin, master }) => {
  const [username, setUsername] = useState('');
  const [drawingData, setDrawingData] = useState('');

  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Exporta el dibuix
      const data = await canvasRef.current!.exportImage('png');
      setDrawingData(data);

      // Processa el formulari nomaes si hi ha un nom dusuari i dades de dibuix
      if (username && data) {
        const playersCollectionRef = collection(db, 'grabatoTest', sala, 'players');
        const newPlayerData = {
          name: username,
          avatar: data,
          isMaster: master,
        };

        const docRef = await addDoc(playersCollectionRef, newPlayerData);
        const playerData = {
          playerId: docRef.id,
          sala,
        };
        localStorage.setItem('GarabatoTest', JSON.stringify(playerData));
        onJoin();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DrawingCanvas canvasRef={canvasRef} />
      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 border rounded"
        />

        <ButtonPromise onClick={() => handleSubmit(new Event('click') as any)}>
          ¡Ya está!
        </ButtonPromise>

        {/* <Button text="Submit" onClick={handleSubmit}/> */}
      </div>
    </>
  );
};

export default InitialUserForm;

import React, { useRef, useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import DrawingCanvas from './DrawingCanvas';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';

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

    // Exporta el dibuix
    canvasRef.current!
      .exportImage('png')
      .then(data => {
        setDrawingData(data);

        // Processa el formulari només si hi ha un nom d'usuari i dades de dibuix
        if (username && data) {
          const playersCollectionRef = collection(db, 'grabatoTest', sala, 'players');
          const newPlayerData = {
            name: username,
            avatar: data,
            isMaster: master,
          };

          addDoc(playersCollectionRef, newPlayerData).then(docRef => {
            const playerData = {
              playerId: docRef.id,
              sala,
                
            };
            localStorage.setItem('GarabatoTest', JSON.stringify(playerData));
            onJoin();
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
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
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </div>
    </>
  );
};

export default InitialUserForm;

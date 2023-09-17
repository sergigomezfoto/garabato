"use client"

import { db } from "@/firebase/firebase";
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { useState } from "react";
import { useRouter } from 'next/navigation'; // Importa useRouter per navegar a la ruta desitjada
import SendRoomWhatsapp from '../../../components/SendRoomWhatsapp';
import CopyToClipboard from '../../../components/CopyToClipboard';

export default function Create() {
  const [word, setWord] = useState('');
  const [warning, setWarning] = useState('');
  const [gameCreated, setGameCreated] = useState(false); // Estat per saber si el joc ha estat creat
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWarning('');
    setGameCreated(false);
    if (word.trim() === '') {
      setWarning('Escrive alguna palabra');
      return; // Si és buit o només espais, no facis res més.
    }
    
    const gameDocRef = doc(db, 'grabatoTest', word);
    const gameDocSnapshot = await getDoc(gameDocRef);
    if (!gameDocSnapshot.exists()) {
      await setDoc(gameDocRef, { created: new Date(), closedRoom: false });
      setGameCreated(true); // Estableix que el joc ha estat creat
    } else {
      setWarning(`Ya hay una sala ${word}`);
    }
  };

  const handleGoToGame = () => {
    router.push(`/join/${word}`); //TODO: go directly to join with the room id you just created
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!gameCreated ? (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="createID">
              Crea un sala
            </label>
            <input
              id="createID"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="p-2 border rounded"
              placeholder="nombre de la sala"
            />
            {warning && <p className="text-red-500">{warning}</p>}
          </div>
          <button type="submit" className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Crear
          </button>
        </form>
      ) : (<>
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl text-center"><span className="font-bold "> {window.location.origin}/join/{word}</span></h2>
          {/* <p className="text-green-500 text-2xl">{word}</p> */}
        </div>
        <div className="py-6">
          <CopyToClipboard textToCopy={`${window.location.origin}/join/${word}`} className="mr-2" />
           <span className="mx-2"> o </span> 
          <SendRoomWhatsapp url={`${window.location.origin}/join/${word}`} />
        </div>

        
        <button onClick={handleGoToGame} className="mt-12 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Ves a la sala <span className="font-bold " >{word}</span>
        </button>

      </>
      )}
    </div>
  );
}
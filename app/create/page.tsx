"use client"

import { db } from "@/firebase/firebase";
import { getDoc,setDoc,doc} from 'firebase/firestore';
import { useState } from "react";
import { useRouter } from 'next/navigation'; // Importa useRouter per navegar a la ruta desitjada

export default function Create() {
  const [word, setWord] = useState('');
  const [warning, setWarning] = useState('');
  const [gameCreated, setGameCreated] = useState(false); // Estat per saber si el joc ha estat creat
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWarning('');
    setGameCreated(false);

    const gameDocRef = doc(db, 'grabatoTest', word);
    const gameDocSnapshot = await getDoc(gameDocRef);

    if (!gameDocSnapshot.exists()) {
      await setDoc(gameDocRef, { created: new Date(), closedRoom: false });
      setGameCreated(true); // Estableix que el joc ha estat creat
    } else {
      setWarning('El joc ja existeix');
    }
  };

  const handleGoToGame = () => {
    router.push(`/join/${word}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {!gameCreated ? (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input 
            type="text" 
            value={word} 
            onChange={(e) => setWord(e.target.value)} 
            className="p-2 border rounded"
            placeholder="Nom del joc"
          />
          {warning && <p className="text-red-500">{warning}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Crear
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold">Envia-ho a qui vulguis</h2>
          <p className="text-green-500 text-2xl">{word}</p>
          <button onClick={handleGoToGame} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Vaig
          </button>
        </div>
      )}
    </div>
  );
}
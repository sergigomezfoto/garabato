"use client"

import { db } from "@/firebase/firebase";
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { useState } from "react";
import { useRouter } from 'next/navigation'; // Importa useRouter per navegar a la ruta desitjada
import SendRoomWhatsapp from '../../../components/SendRoomWhatsapp';
import CopyToClipboard from '../../../components/CopyToClipboard';
import Button from '../../../components/design/Button';
import normalizeInput from '../../helpers/normalizeInputText';

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
    router.push(`/join/${word}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!gameCreated ? (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4" autoComplete="off">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="createID">
              Crea un sala
            </label>
            <input
              id="createID"
              type="text"
              value={word}
              onChange={(e) => setWord(normalizeInput(e.target.value))}
              className="p-2 border rounded"
              placeholder="nombre de la sala"
            />
            {warning && <p className="text-red-500">{warning}</p>}
          </div>
          <Button text="Crear" type="submit" />
        </form>
      ) : (
        <>
          <span className="text-sl text-center font-bold break-words lg:text-xl md:text-lg sm:text-base text-sm w-full"> {window.location.origin}/join/{word}</span>

          <div className="py-4 flex gap-4 justify-center">
            <CopyToClipboard textToCopy={`${window.location.origin}/join/${word}`} className="mr-2" />

            <SendRoomWhatsapp url={`${window.location.origin}/join/${word}`} />
          </div>

          <Button onClick={handleGoToGame}>
            Ir a la sala <span className="font-bold " >{word}</span>
          </Button>

        </>
      )}
    </div>
  );
}
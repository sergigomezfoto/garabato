"use client"

import { db } from "@/firebase/firebase";
import { getDoc, setDoc, doc, collection, addDoc } from 'firebase/firestore';
import { useState } from "react";
import { useRouter } from 'next/navigation'; // Importa useRouter per navegar a la ruta desitjada
import JoinPage from "../join/page";
import Link from "next/link";

export default function Create() {
  const [users, setUsers] = useState(['']);
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
      setUsers([...users, 'none']);
      const playersCollectionRef = collection(db, 'grabatoTest', word, 'players');
      const newPlayerData = {
        name: "",
        master: true,  // Store drawing string here
      };

      const docRef = await addDoc(playersCollectionRef, newPlayerData);
      const playerId = docRef.id;
    } else {
      setWarning('That game id is already taken');
    }
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
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Crear
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl text-center">Other players should join at<span className="font-bold "> {window.location.origin}/join</span> using the id:</h2>
          <p className="text-green-500 text-2xl">{word}</p>
          <Link href={{
            pathname:"/join", query:{
              sala: word,
              master: true, 
            }
          }} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Click Wait Room
          </Link>
        </div>
      )}
    </div>
  );
}
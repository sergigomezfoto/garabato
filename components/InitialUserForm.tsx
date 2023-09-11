'use client'

import { db } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface InitialUserFormProps {
  sala: string;
  onJoin: () => void;
}

const InitialUserForm: React.FC<InitialUserFormProps> = ({ sala, onJoin }) => {
  const [username, setUsername] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://randomuser.me/api/")
      .then(response => response.json())
      .then(data => {
        setImageUrl(data.results[0].picture.large);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && imageUrl) {
      const playersCollectionRef = collection(db, 'grabatoTest', sala, 'players');
      const newPlayerData = {
        name: username,
        avatar: imageUrl
      };
      // Crea un nou document i obté la referència del document creat
      const docRef = await addDoc(playersCollectionRef, newPlayerData);
      // Obté l'ID del document creat

      const playerData = {
        playerId: docRef.id,
        sala: sala
      };
      localStorage.setItem('GarabatoTest', JSON.stringify(playerData));
      onJoin();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {imageUrl ? <img src={imageUrl} alt="Imatge aleatòria"  className="rounded-full" /> : <p>Carregant imatge...</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nom d'usuari"
        className="p-2 border rounded"
      />
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Enviar
      </button>
    </div>
  );
}

export default InitialUserForm;

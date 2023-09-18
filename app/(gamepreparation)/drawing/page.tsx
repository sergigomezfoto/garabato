'use client'

import React, { useEffect, useRef, useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from "@/firebase/firebase";
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import DrawingCanvas from '@/components/DrawingCanvas';


type StoredPlayerData = {
  playerId: string;
  sala: string;

};
interface PlayerData {
  name: string;
  score: number;
  avatar: string;
  drawing: string;
  phrase: string;
  turnId: number;
}
const Drawing = () => {

  const [player, setPlayer] = useState<StoredPlayerData>({ playerId: "", sala: "" });
  const [playerData, setPlayerData] = useState<PlayerData | undefined>(undefined);
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('GarabatoTest');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPlayer(parsedData);
      if (parsedData.playerId) {
        const playerRef = doc(db, "grabatoTest", parsedData.sala, "players", parsedData.playerId);
        const fetchData = async () => {
          const docSnap = await getDoc(playerRef);
          if (docSnap.exists()) {
            setPlayerData(docSnap.data() as PlayerData);
          } else {
            console.log("No es troba el document!");
          }
        };
        fetchData();
      }
    }
  }, []);

  const handleOnClick = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(player);
    canvasRef.current!
      .exportImage('png')
      .then(async draw => {
        if (draw) {
          //Update user drawing data
          const playerRef = doc(db, "grabatoTest", player.sala, "players", player.playerId);
          await updateDoc(playerRef, {
            drawing: draw
          }).then(() => {
            console.log("Data saved successfully!");
          })
            .catch(error => {
              console.log(error);
            })
        }
      }
      )
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl my-6">Your word is: <strong>{playerData?.phrase || 'cargando...'}</strong></h1>
      <DrawingCanvas canvasRef={canvasRef} />
      <i className="my-10">Dibuja..</i>
      <button onClick={handleOnClick}>
        Done
      </button>
    </div>
  );
}

export default Drawing;
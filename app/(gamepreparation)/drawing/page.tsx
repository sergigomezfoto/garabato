'use client'

import React, { useEffect, useRef, useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from "@/firebase/firebase";
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import DrawingCanvas from '@/components/DrawingCanvas';
import ButtonPromise from '../../../components/design/ButtonPromise';


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

  // const handleOnClick = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log(player);
  //   canvasRef.current!
  //     .exportImage('png')
  //     .then(async draw => {
  //       if (draw) {
  //         //Update user drawing data
  //         const playerRef = doc(db, "grabatoTest", player.sala, "players", player.playerId);
  //         await updateDoc(playerRef, {
  //           drawing: draw
  //         }).then(() => {
  //           console.log("Data saved successfully!");
  //         })
  //           .catch(error => {
  //             throw error;
  //           })
  //       }
  //     }
  //     )
  // }
  const handleOnClick = async () => {
    try {
      console.log(player);
      const draw = await canvasRef.current!.exportImage('png');
      if (draw) {
        const playerRef = doc(db, "grabatoTest", player.sala, "players", player.playerId);
        await updateDoc(playerRef, { drawing: draw });
        console.log("Data saved successfully!");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
}


  return (
    <>
      {/* <div className="flex flex-col items-center flex-grow"> */}
      <h1 className="text-2xl my-6"><strong>{playerData?.phrase || 'cargando...'}</strong></h1>
      <DrawingCanvas canvasRef={canvasRef} />
      <i className="mb-4">¡Dibuja la frase que te ha tocado!</i>

      {/* <button onClick={handleOnClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
        ¡Ya está!
      </button> */}
      <ButtonPromise onClick={handleOnClick}>
        ¡Enviar dibujo!
      </ButtonPromise>

    </>

  );
}

export default Drawing;
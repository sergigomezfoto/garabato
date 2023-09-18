'use client'

import React, { useEffect, useRef, useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import DrawingCanvas from '@/components/DrawingCanvas';
import { getDatabase, ref, onValue } from 'firebase/database';

type StoredPlayerData = {
  playerId: string;
  sala: string;
};

const Drawing = () => {
  const [player, setPlayer] = useState<StoredPlayerData>({ playerId: "", sala: "" });
  const [playerData, setPlayerData] = useState();
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('GarabatoTest');
    console.log('Stored', storedData);
    if (storedData) {
      console.log("dentro");
      setPlayer(JSON.parse(storedData));
      console.log(player); //Sin datos al inicio?

      //Get user data
      const dataBase = getDatabase();
      const playerRef = ref(dataBase, 'grabatoTest/' + `${player.sala}/` + 'players/' + player.playerId)
      onValue(playerRef, (snapshot: any) => {
        const data = snapshot.val();
        //setPlayerData(snapshot.val());
        //console.log('Player Data:', playerData);
        console.log(data);
      });
    }
  }, []);

  const done = async (e: React.FormEvent) => {
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
      <h1 className="text-4xl my-6">Your word is: <strong>{'${playerData.phrase}'}</strong></h1>
      <DrawingCanvas canvasRef={canvasRef} />
      <i className="my-10">Please, draw for the rest of the players can guess your phrase.</i>
      <button onClick={done}>
        Done
      </button>
    </div>
  );
}

export default Drawing;
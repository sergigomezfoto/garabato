'use client'

import React, { useEffect, useRef, useState } from 'react';
import { doc, updateDoc, getDoc, collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from "@/firebase/firebase";
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import DrawingCanvas from '@/components/DrawingCanvas';
import ButtonPromise from '../../../components/design/ButtonPromise';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';

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
  const [playersDrawDone, setPlayersDrawDone] = useState<PlayerData[]>([]);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
  const [draw, setDraw] = useState<boolean>(false);
  const router = useRouter();
  
  const [interactionCount, setInteractionCount] = useState(0);
  const [isButtonActive, setButtonActive] = useState(false);
  
  const handleCanvasInteraction = () => {
    console.log('interacted');
    setInteractionCount(prevCount => prevCount + 1);
    if (interactionCount === 1) { 
      setButtonActive(true);
    }// Comença a comptar des de 0, així que a la segona interió serià 1
  };
  
  useEffect(() => {
    console.log('Drawing: useEffect');
    
    loadPlayers();
    const storedData = localStorage.getItem('GarabatoTest');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPlayer(parsedData);
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

      const playersCollectionRef = collection(db, "grabatoTest", parsedData.sala, "players");
      const unsubscribePlayers = onSnapshot(playersCollectionRef, (snapshot) => {
        const playersDone = snapshot.docs
          .map((doc) => doc.data().drawing)
          .filter((value) => value !== null);
        setPlayersDrawDone(playersDone);
      });

      return () => {
        console.log('Drawing: useEffect return');     
        unsubscribePlayers();}
    }
  }, []);

  useEffect(() => {
    console.log('Drawing: useEffect playersDrawDone');
    console.log('players.length: ',players.length);
    console.log('playersDrawDone.length: ',playersDrawDone.length);
    console.log('draw: ',draw);  
    if (draw === true && players.length === playersDrawDone.length) {
      router.push('/0/guess');
    }
  }, [playersDrawDone, draw, router, players.length]);

  const loadPlayers = () => {
    const storedData = localStorage.getItem('GarabatoTest');
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data) {
        const playersCollectionRef = collection(db, 'grabatoTest', data.sala, 'players');
        getDocs(playersCollectionRef).then(snapshot => {
          const allPlayers: PlayerData[] = snapshot.docs.map(doc => ({
            name: doc.data().name,
            score: doc.data().score,
            avatar: doc.data().avatar,
            drawing: doc.data().drawing,
            phrase: doc.data().phrase,
            turnId: doc.data().turnId,
          }));

          setPlayers(allPlayers);
        });
      }
    }
  }

  const handleOnClick = async () => {
    try {
      console.log(player);
      const drawing = await canvasRef.current!.exportImage('png');
      if (drawing) {
        const playerRef = doc(db, "grabatoTest", player.sala, "players", player.playerId);
        await updateDoc(playerRef, { drawing: drawing });
        console.log("Data saved successfully!");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
    setDraw(true);
  }


  return (
    <>
      {draw ? (<ProgressBar
        totalPlayers={players.length}
        playersReady={playersDrawDone.length}
        text='Espera que terminen todos los jugadores de dibujar'
      />) : (
        <>
          <h1 className="text-2xl my-6"><strong>{playerData?.phrase || 'cargando...'}</strong></h1>
          <DrawingCanvas canvasRef={canvasRef} onChange={handleCanvasInteraction} />
          <i className="mb-4">¡Dibuja la frase que te ha tocado!</i>
          <ButtonPromise onClick={handleOnClick}
          isDisabled={!isButtonActive}
          >
            ¡Enviar dibujo!
          </ButtonPromise>
        </>)
      }
    </>


  );
}

export default Drawing;
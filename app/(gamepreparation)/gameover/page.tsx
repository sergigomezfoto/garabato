'use client'

import ButtonPromise from "@/components/design/ButtonPromise";
import { collection, deleteDoc, doc, getDocs, loadBundle } from 'firebase/firestore';
import { db } from "@/firebase/firebase";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import SinglePlayer from "@/components/SinglePlayer";

interface Player {
    name: string;
    score: number;
    avatar: string;
    drawing: string;
    phrase: string;
    turnId: number;
}


const GameOver = () => {
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>([]);
    const [p, setP] = useState<Player[]>([]);
    const [playersOrder, setPlayersOrder] = useState<Player[]>([])
    const [sala, setSala] = useState<String>("");

    useEffect(() => {
        loadData();
        orderData();
        //console.log(p);
    }, []);

    const orderData = () => {
        const sortedList = [...players].sort((a, b) => (a.score > b.score ? 1 : a.score < b.score ? -1 : 0)).reverse();
        setPlayersOrder(sortedList);
    }

    const loadData = () => {
        const storedData = localStorage.getItem('GarabatoTest');
        if (storedData) {
            const data = JSON.parse(storedData);
            setSala(data.sala);
            const playersCollectionRef = collection(db, 'grabatoTest', 'salax', 'players');
            getDocs(playersCollectionRef).then(snapshot => {
                const allPlayers: Player[] = snapshot.docs.map(doc => ({
                    name: doc.data().name,
                    score: doc.data().score,
                    avatar: doc.data().avatar,
                    drawing: doc.data().drawing,
                    phrase: doc.data().phrase,
                    turnId: doc.data().turnId,
                }));

                setP(allPlayers);
            });
        }
    }

    const loadPlayers = () => {
        //Simulación de puntuación
        if (players.length === 0) {
            for (let i = 0; i < 10; i++) {
                const player: Player = {
                    name: `Juan${i}`,
                    score: i + Math.floor(Math.random() * (10 - 0 + 1) + 0),
                    avatar: '',
                    drawing: '',
                    phrase: '',
                    turnId: 0,

                }
                setPlayers((players) => [...players, player]);
            }
        }

    }

    if (playersOrder.length === 0) {
        loadPlayers();
        return <div>Cargando...</div>;
    }

    const handleOnClick = async () => {
        try {
            //This operation don´t remove the subcollections
            //await deleteDoc(doc(db, 'grabatoTest', `${sala}`));
            //localStorage.removeItem('GarabatoTest');
            //console.log("Sala delete successfully!");

            router.push("/");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const colorRender = (index: number): string => {
        switch (index) {
            case 0:
                return 'bg-yellow-500'
            case 1:
                return 'bg-stone-400'
            case 2:
                return 'bg-amber-700'
            default:
                return 'bg-black'
        }
    }

    return (
        <>
            <h1 className="my-2 text-xl"><strong>Lista de clasificación</strong></h1>
            <div className="overflow-auto h-80 m-2">
                {playersOrder.map((player, index) => (
                    <div key={index} className="relative w-60 bg-white rounded-lg border border-stone-600 my-2 p-1">
                        <div className={`top-1 right-1 absolute w-7 text-center text-white text-xl rounded-full shadow-sm shadow-stone-500 border border-stone-600 ${colorRender(index)}`}><strong>{index + 1}</strong></div>
                        <div key={index} className="flex items-center">
                            <SinglePlayer key={index} avatar={"/gh.png"} name={player.name} />
                            <p className="pl-4">Score: {player.score}</p>
                        </div>
                    </div>
                ))}
            </div>
            <ButtonPromise onClick={handleOnClick}>
                Volver a jugar
            </ButtonPromise>
        </>

    );

}

export default GameOver;
'use client'

import ButtonPromise from "@/components/design/ButtonPromise";
import { collection, deleteDoc, doc, getDocs, loadBundle } from 'firebase/firestore';
import { db } from "@/firebase/firebase";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

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
        const sortedList = [...players].sort((a, b) => (a.score > b.score ? 1 : a.score < b.score ? -1 : 0));
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
                    name: `${i}`,
                    score: i + Math.random(),
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

    return (
        <>
            <strong>Lista de clasificación</strong>
            <div>
                {playersOrder.map((player, index) => (
                    <li key={index}>Name{player.name} Score {player.score}</li>
                ))}
            </div>
            <ButtonPromise onClick={handleOnClick}>
                Volver a jugar {sala}
            </ButtonPromise>
        </>

    );

}

export default GameOver;
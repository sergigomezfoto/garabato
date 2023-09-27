'use client'

import ButtonPromise from "@/components/design/ButtonPromise";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/firebase/firebase";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import SinglePlayer from "@/components/SinglePlayer";
import getDataFromLocalStorage from "@/app/helpers/getFromLocalStorage";
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
    const [playersOrder, setPlayersOrder] = useState<Player[]>([]);
    const [load, setLoad] = useState<Boolean>(false);

    useEffect(() => {
        const loadPlayers = () => {
            const storedData = localStorage.getItem('GarabatoTest');
            let allPlayers: Player[] = [];
            if (storedData) {
                const data = JSON.parse(storedData);
                const playersCollectionRef = collection(db, 'grabatoTest', data.sala, 'players');
                getDocs(playersCollectionRef).then(snapshot => {
                    allPlayers = snapshot.docs.map(doc => ({
                        name: doc.data().name,
                        score: doc.data().score,
                        avatar: doc.data().avatar,
                        drawing: doc.data().drawing,
                        phrase: doc.data().phrase,
                        turnId: doc.data().turnId,
                    }));
                    console.log('not order', allPlayers);
                    const sortedList = [...allPlayers].sort((a, b) => (a.score > b.score ? 1 : a.score < b.score ? -1 : 0)).reverse();
                    setPlayersOrder(sortedList);
                    setLoad(true);
                    console.log("sortedList", sortedList);
                    console.log("playersOrder", playersOrder);
                });
            }
        }
        loadPlayers();
    }, []);

    const handleOnClick = async () => {
        const storedData = getDataFromLocalStorage();
        const sala = storedData ? storedData.sala : 'valorPerDefecte';  // Utilitza 'valorPerDefecte' si 'sala' no està definit
        const apiUrl = `${window.location.origin}/api/deleteFromFirestore`;
        // console.log('apiUrl', apiUrl);
        // console.log(sala);
        // console.log(JSON.stringify({ "docPath":sala }));
        try {
          const response = await fetch(apiUrl, { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "docPath":sala }),
          });

          const data = await response.json();
          if (response.ok) {
            console.log('Document i col·lecció esborrats amb èxit:', data);         
          } else {
            console.log('Error esborrant document i col·lecció:', data);
          }
          router.push("/");
        } catch (error) {
          console.error('Hi ha hagut un error amb la petició:', error);
          router.push("/");
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
            {load ? (
                <>
                    <div className="mb-3">
                        <h1 className="ml-1 mb-4 text-xl"><strong>Lista de clasificación</strong></h1>
                        {playersOrder.map((player, index) => (
                            <div key={index} className="pl-2 relative w-60 bg-white rounded-lg border border-stone-600 my-2 p-1">
                                <div className={`top-1 right-1 absolute w-7 text-center text-white text-xl rounded-full shadow-sm shadow-stone-500 border border-stone-600 ${colorRender(index)}`}><strong>{index + 1}</strong></div>
                                <div key={index} className="flex items-center">
                                    <SinglePlayer key={index} avatar={player.avatar} name={player.name} />
                                    <p className="pt-2 ml-4">Puntuación: {player.score}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <ButtonPromise onClick={handleOnClick}>
                        Volver a jugar
                    </ButtonPromise>
                </>
            ) : (<div>Cargando...</div>)
            }
        </>

    );

}

export default GameOver;
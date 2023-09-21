'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { handleUpdate } from "../../../hooks/handleUpdate";
import { fetchPlayersData } from "../../../hooks/databaseDataRetreival";
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

type StoredPlayerData = {
    playerId: string;
    sala: string;
};

type Player = {
    id: string;
	isMaster?: boolean;
    name: string;
    avatar: string;
	turnId?: number; //This is the turnId each player are the drawer
	drawing?: string
    phrase?: string;
	guessMade?: string;
	guessVoted?: string;
	points?: number;
	score?: number;
};

// Test data Oriol:
	const sala = "hola";
	//const whoamiId = "CXcVHaxEqIYa3bbCUTgH"; const whoamiTurn = 1;
	//const whoamiId = "Cyjas3jW8in2YStdypTi"; const whoamiTurn = 2;
	//const whoamiId = "zSvSa9QA7siQHrNOQj8K"; const whoamiTurn = 3;
	const whoamiId = "Al2c0UwLHC6buXVbZu3c";
	const original_title = "Poto"

const dummyLocalStorageData = {
	playerId: whoamiId,
	sala: sala
}

const ShowVotes = () => {

	const { turnid } = useParams();
	const currentTurnId = parseInt(turnid as string, 10); //This sets who is the drawer this turn
	const router = useRouter();

	const [localId, setlocalId] = useState<StoredPlayerData | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);

	//This will be used to rotate between the guesses in turnid order:
	const [guessId, setGuessId] = useState<number|null>(null); 
	
	useEffect(() => {
        // Recuperar les dades del jugador des de localStorage
        const storedData = localStorage.getItem('GarabatoTest');
        if (storedData) {
            setlocalId(JSON.parse(storedData));
        } else {
			setlocalId(dummyLocalStorageData)
		}
    }, []);

    useEffect(() => {
		// Recuperar datos de todos los jugadores:
        if (localId) {
            const playersCollectionRef = collection(db, 'grabatoTest', localId.sala, 'players');
            getDocs(playersCollectionRef).then(snapshot => {
                const players: Player[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    avatar: doc.data().avatar,
					guessMade: doc.data().guessMade,
					guessVoted: doc.data().guessVoted,
					turnId: doc.data().turnId
                }));
                setPlayers(players);
            });
        }
    }, [localId]);

	//This use effect needs to be splited in parts to be executed only for the guessId we are showing results,
	// probably points per player should be something external since they are only used to show it here and then added to score
	useEffect(() => {

		// Find the player who is the current drawer
		const drawer_idx = players.findIndex(player => player.turnId === currentTurnId);

		// Extract the phrase from the current drawer's object
		const original_title = players[drawer_idx]?.phrase;

		// Update points for players who correctly chose the original title
		players.forEach((player: Player, _ , players: Player[]) => {
			if (player.guessVoted === original_title) {
				player.points = 200
				players[drawer_idx].points = 200
			}
		});
	
		// Update points for players whose guess was chosen by another player
		players.forEach((player: Player) => {
			const count = players.filter((p: Player, _ , array: Player[]) => p.guessVoted === player.guessMade).length;
			player.points = (player.points ?? 0) + count * 100;
		});
	
	}, []);

	return (
		<div className="flex flex-col justify-center items-center">
			<h1>Votes</h1>
			<ul className="m-5">
				<li className="m-3">guess 1 :: 1 :: jugador1 :: autor </li>
				<li className="m-3">guess 2 :: 2 :: jugador2 :: autor </li>
				{/* <li>guess 3 :: 0 :: :: autor </li>
                <li>guess 4 :: 0 ::  :: autor </li>
                <li>guess 5 :: 1 :: jugador4 :: autor </li> */}
			</ul>
		</div>
	);
};

export default ShowVotes;

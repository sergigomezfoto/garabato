'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { handleUpdate } from "../../../hooks/handleUpdate";
import { fetchPlayersData } from "../../../hooks/databaseDataRetreival";
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';


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

const ShowPartialResults = () => {
	
	//Router and path parameters
	const router = useRouter();
	const { turnid } = useParams();
	const currentTurnId = parseInt(turnid as string, 10); //This sets who is the drawer this turn

	//Local storage
	const localStorageItem: string | null = localStorage.getItem("GarabatoTest");
	const { playerId: myId, sala } = localStorageItem ? JSON.parse(localStorageItem) : { playerId: "", sala: "" };

	//Use states
    const [players, setPlayers] = useState<Player[]>([]);
	const [guessId, setGuessId] = useState<number|null>(null); 
	const [myTurn, setMyTurn] = useState<any>();
	const [showPartialResults, setShowPartialResults] = useState(false);
	const [drawerIdx, setDrawerIdx] =useState<number|null>(null)

	//Fetch all players data.
	useEffect(() => {
		const result = await fetchPlayersData(sala, setPlayers, myId, setMyTurn);
		if (result) {
			const { playersData, myTurn } = result;
			const mappedPlayersData = playersData.map(player => player.playerFields) as Player[];
			// Find the player who is the current drawer
			setDrawerIdx(mappedPlayersData.findIndex(player => player.turnId === currentTurnId))
		  }
		console.log(myTurn);
	}, []);


	useEffect(() => {
		let interval: NodeJS.Timeout;
		
		

		if (players.length > 0) {
		  let currentIdx = 0;
		  interval = setInterval(() => {
			// Set the guessId to the turnId of the player at the current index
			setGuessId(players[currentIdx]?.turnId?);
	  
			// Show the partial results
			setShowPartialResults(true);
	  
			// Hide the partial results after X seconds (e.g., 5 seconds)
			setTimeout(() => {
			  setShowPartialResults(false);
			}, 5000);
	  
			// Update the current index for the next iteration
			currentIdx = (currentIdx + 1) % players.length;
		  }, 7000); // This 7000ms should be greater than the 5000ms used for showing the partial results
		}
	  
		// Cleanup interval when unmounting the component
		return () => {
		  if (interval) {
			clearInterval(interval);
		  }
		};
	  }, [players]);
	
	useEffect(() => {

		if(drawerIdx) {
			// Extract the phrase from the current drawer's object
			const original_title = players[drawerIdx]?.phrase;

			// Update points for players who correctly chose the original title
			players.forEach((player: Player, _ , players: Player[]) => {
				if (player.guessVoted === original_title) {
					player.points = 200
					players[drawerIdx].points = 200
				}
			});
		
			// Update points for players whose guess was chosen by another player
			players.forEach((player: Player) => {
				const count = players.filter((p: Player, _ , array: Player[]) => p.guessVoted === player.guessMade).length;
				player.points = (player.points ?? 0) + count * 100;
			});
		}
		
	}, [drawerIdx, guessId]);


	return (
		<div className="flex flex-col justify-center items-center">
		  <h1>Votes</h1>
		  {showPartialResults && (
			<div className="results-container">
			  {players.map((player, idx) => (
				<div key={idx} className="result-item">
				  <span className="player-name">{player.name}</span>:
				  <span className="player-points">{player.points ?? 0}</span>
				  <span className="player-guess">
					{player.guessVoted === player.guessMade ? " (chosen by self)" : ""}
				  </span>
				</div>
			  ))}
			</div>
		  )}
		</div>
	  );
};

export default ShowPartialResults;

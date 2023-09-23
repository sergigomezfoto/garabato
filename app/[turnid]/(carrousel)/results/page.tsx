'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
	const [turnOrder, setTurnOrder] = useState<number[]>([]);
	const currentIdx = useRef(0); // Initialized to 0


	//Fetch all players data.
	useEffect(() => {
		const resultsFetchData = async () => {
			const result = await fetchPlayersData(sala, setPlayers, myId, setMyTurn);
			if (result) {
			  const { playersData } = result;
			  const mappedPlayersData = playersData.map(player => player.playerFields) as Player[];
			  // Find the player who is the current drawer
			  const drawerIdx_ = mappedPlayersData.findIndex(player => player.turnId === currentTurnId)
			  setDrawerIdx(drawerIdx_);

			  // Initialize turnOrder state, putting the drawer's ID last
			  const orderedTurns = mappedPlayersData.map(player => player.turnId!);
			  const drawerTurn = orderedTurns.splice(drawerIdx_, 1)[0];
			  orderedTurns.push(drawerTurn);
			  setTurnOrder(orderedTurns);
			}
		  };
		  
		  resultsFetchData();
	}, []);

	// I need to modify this to calculate points only for the current guess using players points as partial to show
	// and adding to score each iteration
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
		
	}, [currentIdx]);

	//it sets a time interval and executed the callback function inside it
	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (turnOrder.length > 0) {

		  	interval = setInterval(() => {
			// Set the guessId to the turnId of the player at the current index
			setGuessId(turnOrder[currentIdx.current]);
	  
			// Show the partial results
			setShowPartialResults(true);
	  
			// Hide the partial results after X seconds (e.g., 5 seconds)
			setTimeout(() => {
			  setShowPartialResults(false);
			}, 5000);
	  
			// Update the current index for the next iteration
			currentIdx.current = (currentIdx.current + 1) % turnOrder.length;
		  }, 7000); // This 7000ms should be greater than the 5000ms used for showing the partial results
		}
	  
		// Cleanup interval when unmounting the component
		return () => {
		  if (interval) {
			clearInterval(interval);
		  }
		};
	  }, [players]);
	



	return (
		<div className="flex flex-col justify-center items-center">
		<h1 className="text-3xl font-bold mb-4">Votes</h1>
		{showPartialResults && (
			<div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
			{guessId !== null && (
				<>
				<p className="text-lg italic mb-4">
					{players.find(player => player.turnId === guessId)?.name} tried to fooled you with: 
				</p>
				<h2 className="text-2xl font-semibold mb-2">
					{players.find(player => player.turnId === guessId)?.guessMade}
				</h2>
				<h3 className="text-xl font-medium mb-3">Players fooled:</h3>
				<ul className="list-decimal list-inside">
					{players
					.filter(player => player.guessVoted === players.find(p => p.turnId === guessId)?.guessMade)
					.map((player, index) => (
						<li key={index} className="mb-1">
						{player.name} contributed <span className="font-semibold">{player.points ?? 0}</span> points
						</li>
					))}
				</ul>

				{drawerIdx !== null && guessId === players[drawerIdx]?.turnId && (
					<p className="text-red-500 font-medium mt-4">
					Special point calculation for drawer
					</p>
				)}
				</>
			)}
			</div>
		)}
		</div>
	  );
};

export default ShowPartialResults;

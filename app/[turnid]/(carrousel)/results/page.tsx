'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { handleUpdate } from "../../../hooks/handleUpdate";
import { fetchPlayersData } from "../../../hooks/databaseDataRetreival";
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Scope_One } from "next/font/google";


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
	pointsForAuthor?: number;
	score?: number;
	totalScore?: number;
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
	const [showPartialResults, setShowPartialResults] = useState(false);
	const [drawerIdx, setDrawerIdx] =useState<number|null>(null)
	const [turnOrder, setTurnOrder] = useState<number[]>([]);
	const currentIdx = useRef(-1); // Initialized to 0


	//Fetch all players data.
	useEffect(() => {
		const resultsFetchData = async () => {
			const result = await fetchPlayersData(sala, setPlayers, myId, ()=>{});
			if (result) {
			  const { playersData } = result;
			  const mappedPlayersData = playersData.map(player => player.playerFields) as Player[];
			  // Find the player who is the current drawer
			  const drawerIdx_ = mappedPlayersData.findIndex(player => player.turnId === currentTurnId)
			  setDrawerIdx(drawerIdx_);

			  // Initialize turnOrder state, putting the drawer's ID last
			  const turnOrder_ = mappedPlayersData.map(player => player.turnId!);
			  const drawerTurn = turnOrder_.splice(drawerIdx_, 1)[0];
			  turnOrder_.push(drawerTurn);
			  setTurnOrder(turnOrder_);
			}
		  };
		  
		  resultsFetchData();
	}, []);

	useEffect(() => {

		// Copy the players array to make changes
		const updatedPlayers = [...players];
		
		if(drawerIdx !== null && guessId !== null) {


			// Find the player who made the current guess
			const guessAuthorIdx = players.findIndex(player => player.turnId === guessId);

			if (guessAuthorIdx) {
				const originaTitle = players[drawerIdx]?.phrase;

				// Voters who chose the current guess
				const votersForCurrentGuessIdxs = players.findIndex(player => player.guessVoted === players[guessAuthorIdx].guessMade);

				// Count how many players voted for the current guess
				const count = players.filter((player) => player.guessVoted === players[guessAuthorIdx].guessMade).length;

				// Give score to the guessAuthor
				updatedPlayers[guessAuthorIdx].score = 100 * count;

				// Update pointsForAuthor
				updatedPlayers.forEach((player) => {
					// If player voted for the current guess
					if (player.guessVoted == players[guessAuthorIdx].guessMade) {
						player.pointsForAuthor = 100
					} else {
						player.pointsForAuthor = 0
					}

					//if we are in the original title 
					if (guessAuthorIdx === drawerIdx && player.guessVoted === originaTitle) {
					  player.score = (player.score ?? 0) + 100;
					}
				});

        	}

			// Update the state
			setPlayers(updatedPlayers);

		}
	}, [guessId, drawerIdx]);

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
	  }, [players, turnOrder]);
	



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
						{player.name} contributed <span className="font-semibold">{player.pointsForAuthor ?? 0}</span> points
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

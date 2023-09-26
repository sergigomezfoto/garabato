'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { fetchPlayersData } from "../../hooks/databaseDataRetreival";
import calculatePoints from "@/app/helpers/calculatePoints"
import {updatePlayersResults, deleteGuessesAndVotes} from "@/app/hooks/updatePlayersResults"
import {Player} from "@/types/types"

const ShowPartialResults = () => {
	
	//Router and path parameters
	const router = useRouter();
	const { turnid } = useParams();
	const currentTurnId = parseInt(turnid as string, 10); //This sets who is the drawer this turn

	
	//Use states
	const [sala, setSala] = useState<string>("")
    const [players, setPlayers] = useState<Player[]>([]);
	const [guessId, setGuessId] = useState<number|null>(null); 
	const [showPartialResults, setShowPartialResults] = useState(false);
	const [drawerIdx, setDrawerIdx] =useState<number|null>(null)
	const [turnOrder, setTurnOrder] = useState<number[]>([]);
	const [currentIdx, setcurrentIdx] = useState(1); // because first useEffect already set the 0 idx
	const [updatePlayerReady, setUpdatePlayerReady] = useState<boolean>(false)

	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
	
	//Fetch all players data.
	useEffect(() => {
		//Local storage
		const localStorageItem: string | null = localStorage.getItem("GarabatoTest");
		const { playerId: myId, sala } = localStorageItem ? JSON.parse(localStorageItem) : { playerId: "", sala: "" };
		setSala(sala)
		
		const resultsFetchData = async () => {
			const result = await fetchPlayersData(sala,  ()=>{}, myId, ()=>{});
			if (result) {
				const { playersData } = result;
				const mappedPlayersData = playersData.map(player => player.playerFields) as Player[];	
				setPlayers(mappedPlayersData)
				
			  // Find the player who is the current drawer
			  const drawerIdx_ = mappedPlayersData.findIndex(player => player.turnId === currentTurnId)
			  setDrawerIdx(drawerIdx_);

			  // Initialize turnOrder state, putting the drawer's ID last
			  const turnOrder_ = mappedPlayersData.map(player => player.turnId!);
			  const drawerTurn = turnOrder_.splice(drawerIdx_, 1)[0];
			  turnOrder_.push(drawerTurn);
			  setTurnOrder(turnOrder_);
			  setGuessId(turnOrder_[0])
			  console.log(`Results: fetch players data executed - sala: ${sala}, myId: ${myId}, currentTurnId: ${currentTurnId}, drawer turnId: ${mappedPlayersData[drawerIdx_].turnId ?? null}, turnOrder: ${turnOrder_}, players length ${mappedPlayersData.length}`)
			}
		  };
		  
		  resultsFetchData();
	}, [currentTurnId]);

	useEffect(() => {

		console.log(`Results: entering interval useEffect - turnOrder: ${turnOrder} `)
		if (turnOrder.length > 0 && drawerIdx !== null && guessId !== null) {
			const delay_ms = 7000
			let guessId_ = guessId			
			const iterateGuesses = async () => {

				if (currentIdx === (players.length -1)) {
					// Navigate to next drawing votes
					if (players.length > currentTurnId + 1){
						await delay(delay_ms)
						console.log("Navigating to next guess")	
						await deleteGuessesAndVotes(players, sala, players[drawerIdx].turnId)
						router.push(`/${currentTurnId + 1}/guess`);

					}
					else {
						await delay(delay_ms)
						console.log("Navigating to final results")
						await deleteGuessesAndVotes(players, sala, players[drawerIdx].turnId)
						router.push(`/gameover`)
					}
				}

				console.log(`Results: interval points useEffect executed: guessId: ${guessId_}}`)
				const {updatedPlayers} = calculatePoints(players, drawerIdx, guessId_, setPlayers);
				updatePlayersResults(updatedPlayers, sala, setUpdatePlayerReady)

				setShowPartialResults(true);
				await delay(delay_ms);

				setShowPartialResults(false);
				await delay(delay_ms);
				// Update the current index for the next iteration
				guessId_ = turnOrder[currentIdx];
				setGuessId(guessId_);
				setcurrentIdx(currentIdx => currentIdx + 1)
			};

			iterateGuesses();

			return () => {
				console.log(`Component is unmounting.  sala: ${sala}, drawerTurnID: ${players[drawerIdx].turnId}, ${JSON.stringify(players)}`);
			}
	  	}
	}, [turnOrder, drawerIdx, guessId]);
	



	return (
		<div className="flex flex-col justify-center items-center">
		<div className="flex flex-col justify-center items-center">
    <h1 className="text-3xl font-bold mb-4">Results</h1>
    {showPartialResults && (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
            {guessId !== null && (
                <>
                    {drawerIdx !== null && guessId === players[drawerIdx]?.turnId ? (
                        <div className="text-red-500 font-medium mt-4">
                            <ul className="list-none space-y-2">
                                {players
                                    .filter(player => player.guessVoted === players.find(p => p.turnId === guessId)?.guessMade)
                                    .map((player, index) => (
                                        <li key={index} className="mb-1 text-lg font-medium">
                                            {player.name} guessed the original title!
                                        </li>
                                    ))}
                            </ul>
                            <p>Points for drawer: 100</p>
                            <p>Points for player: 100</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-lg italic mb-4">
                                {players.find(player => player.turnId === guessId)?.name} tried to fool you with:
                            </p>
                            <h2 className="text-2xl font-semibold mb-2">
                                {players.find(player => player.turnId === guessId)?.guessMade}
                            </h2>
                            <h3 className="text-xl font-medium mb-3">Players fooled:</h3>
                            <ul className="list-none space-y-2">
                                {players
                                    .filter(player => player.guessVoted === players.find(p => p.turnId === guessId)?.guessMade)
                                    .map((player, index) => (
                                        <li key={index} className="mb-1 text-lg font-medium">
                                            {player.name} contributed with <span className="font-semibold">100</span> points to {players.find(player => player.turnId === guessId)?.name}
                                        </li>
                                    ))}
                            </ul>
                        </>
                    )}
                </>
            )}
        </div>
    )}
</div>
		</div>
	  );
};

export default ShowPartialResults;

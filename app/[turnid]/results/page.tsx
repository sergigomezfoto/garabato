'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { fetchPlayersData } from "../../hooks/databaseDataRetreival";
import calculatePoints from "@/app/helpers/calculatePoints"
import { updatePlayersResults, deleteGuessesAndVotes } from "@/app/hooks/updatePlayersResults"
import { Player } from "@/types/types"

const ShowPartialResults = () => {

	//Router and path parameters
	const router = useRouter();
	const { turnid } = useParams();
	const currentTurnId = parseInt(turnid as string, 10); //This sets who is the drawer this turn


	//Use states
	const [sala, setSala] = useState<string>("")
	const [players, setPlayers] = useState<Player[]>([]);
	const [guessId, setGuessId] = useState<number | null>(null);
	const [showPartialResults, setShowPartialResults] = useState(false);
	const [drawerIdx, setDrawerIdx] = useState<number | null>(null)
	const [turnOrder, setTurnOrder] = useState<number[]>([]);
	const [rounds, setRounds] = useState<number>(1)

	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

	//Fetch all players data.
	useEffect(() => {
		//Local storage
		const localStorageItem: string | null = localStorage.getItem("GarabatoTest");
		const { playerId: myId, sala } = localStorageItem ? JSON.parse(localStorageItem) : { playerId: "", sala: "" };
		setSala(sala)

		const resultsFetchData = async () => {
			const result = await fetchPlayersData(sala, () => { }, myId, () => { });
			if (result) {
				const { playersData } = result;
				const mappedPlayersData = playersData.map(player => {
					const newplayerFields = player.playerFields
					newplayerFields.id = player.playerID
					return newplayerFields
				}) as Player[];
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

		console.log(`Results: trying to enter interval useEffect - turnOrder: ${turnOrder}, drawerIdx: ${drawerIdx}, guessId: ${guessId} `)
		if (turnOrder.length > 0 && drawerIdx !== null && guessId !== null) {
			const delay_ms = 5000
			const currentIndex = turnOrder.findIndex(id => id === guessId);
			const nextIndex = (currentIndex + 1)

			console.log(`Results: entered interval useEffect!`)

			const iterateGuesses = async () => {
				console.log(`Results - nextIndex is: ${nextIndex} , players.length is ${players.length}`)
				if (rounds === (players.length + 1)) {
					// Navigate to next drawing votes
					if (players.length > currentTurnId + 1) {
						console.log("Navigating to next guess")
						await deleteGuessesAndVotes(players, sala, players[drawerIdx].turnId)
						router.push(`/${currentTurnId + 1}/guess`);
						return
					}
					else {
						console.log("Navigating to final results")
						await deleteGuessesAndVotes(players, sala, players[drawerIdx].turnId)
						router.push(`/gameover`)
						return
					}
				}

				console.log(`Results: interval points useEffect executed: guessId: ${guessId}}`)
				const { updatedPlayers } = calculatePoints(players, drawerIdx, guessId, setPlayers);
				updatePlayersResults(updatedPlayers, sala)
				await delay(1000);
				setShowPartialResults(true);
				await delay(delay_ms);

				setShowPartialResults(false);

				// Update the current index for the next iteration

				const nextGuessId = turnOrder[nextIndex];
				setGuessId(nextGuessId)
				setRounds(round => round + 1)
			};

			iterateGuesses();

			return () => {
				console.log(`Component is unmounting.`);
			}
		}
	}, [turnOrder, drawerIdx, rounds]);




	return (
		<div className="flex flex-col justify-center items-center">
			<div className="flex flex-col justify-center items-center">
				{showPartialResults && (
					<>
						<h1 className="text-3xl font-bold mb-4">Resultados de esta ronda:</h1>
						<div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
							{guessId !== null && (
								<>
									{drawerIdx !== null && guessId === players[drawerIdx]?.turnId ? (
										<div className="text-green-800 font-medium mt-4">
											<h1>Título original: </h1>
											<h2 className="text-center text-2xl font-semibold mb-2 bg-gray-100 border border-gray-300 rounded shadow-inner p-4">
												{players[drawerIdx]?.phrase}
											</h2>
											<ul className="list-none space-y-2">
												{players
													.filter(player => player.guessVoted === players[drawerIdx].phrase)
													.map((player, index) => (
														<li key={index} className="mb-1 text-lg font-medium">
															{player.name} adivinó el título original!
														</li>
													))}
											</ul>
											<p>Puntos para adivino: 100</p>
											<p>Puntos para el artista: 100</p>
										</div>
									) : (
										<>
											<p className="text-lg italic mb-4">
												{players.find(player => player.turnId === guessId)?.name} intentó engañaros con:
											</p>
											<h2 className="text-center text-2xl font-semibold mb-2 bg-gray-100 border border-gray-300 rounded shadow-inner p-4">
												{players.find(player => player.turnId === guessId)?.guessMade}
											</h2>
											<h3 className="text-xl font-medium mb-3">Los siguientes jugadores cayeron en la trampa:</h3>
											<ul className="list-none space-y-2">
												{players
													.filter(player => player.guessVoted === players.find(p => p.turnId === guessId)?.guessMade)
													.map((player, index) => (
														<li key={index} className="mb-1 text-lg font-medium">
															{player.name} le ha regalado <span className="font-semibold">100</span> puntos a {players.find(player => player.turnId === guessId)?.name}
														</li>
													))}
											</ul>
										</>
									)}
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ShowPartialResults;

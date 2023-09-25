"use client";

import { fetchPlayersData } from "@/app/hooks/databaseDataRetreival";
import { handleUpdate } from "@/app/hooks/handleUpdate";
import ProgressBar from "@/components/ProgressBar";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Player = {
	playerFields: {
		guessVoted: string;
		phrase: string;
		turnId: number;
		name: string;
		drawing: string;
		guessMade: string;
	};
};

const VoteDrawing = () => {
	const [myTurn, setMyTurn] = useState<any>();
	const { turnid } = useParams();
	const turnIdNumber = parseInt(turnid as string, 10);
	const router = useRouter();

	const [actionStatus, setActionStatus] = useState<boolean>(false);
	const [players, setPlayers] = useState<any>();
	const [actionList, setActionList] = useState<any>();
	const [currentPlayer, setCurrentPlayer] = useState<{
		playerFields: { name: string; drawing: string; turnId: number };
	} | null>(null);
	const [vote, setVote] = useState("");

	const localStorageItem = localStorage.getItem("GarabatoTest");
	const { playerId: myId, sala: sala } = JSON.parse(localStorageItem);

	//Fetch all players data and set up listener
	useEffect(() => {
		fetchPlayersData(sala, setPlayers, myId, setMyTurn);

		const playersCollectionRef = collection(db, "grabatoTest", sala, "players");
		const unsubscribePlayers = onSnapshot(playersCollectionRef, (snapshot) => {
			const playersDone = snapshot.docs
				.map((doc) => doc.data().guessVoted)
				.filter((value) => value !== undefined);
			setActionList(playersDone);
		});

		return () => unsubscribePlayers();
	}, []);

	//Filter player based on turnIdNumber.
	useEffect(() => {
		if (players) {
			const currentPlayer = players.find(
				(player: { playerFields: { turnId: number } }) =>
					player.playerFields.turnId === turnIdNumber
			);

			if (currentPlayer) {
				setCurrentPlayer(currentPlayer);
				if (currentPlayer.playerFields.turnId === myTurn) {
					setActionStatus(true);
				}
			}
		}
	}, [players]);

	// Handle vote
	const handleVote = async (vote: string) => {
		await handleUpdate(sala, myId, vote, "guessVoted", setActionStatus);
	};

	//Reroute players when all players are done.
	useEffect(() => {
		if (actionStatus === true && players?.length === actionList?.length + 1) {
			router.push(`/${turnIdNumber}/results`);
		}
	}, [actionList, actionStatus]);

	return (
		<div className="flex flex-col justify-center items-center">
			{currentPlayer ? (
				actionStatus === false ? (
					<div className="flex flex-col items-center space-y-2">
						<h1>Este es el dibujo de {currentPlayer.playerFields.name}.</h1>
						<img
							src={currentPlayer.playerFields.drawing}
							alt="Dibujo"
							className="m-5"
						/>
						<h1>Vota lo que crees que es.</h1>

						<ul className="flex flex-wrap justify-center items-center gap-4">
							{players.map((player: Player, index: number) => (
								<button
									key={index}
									value={vote}
									className="p-2 bg-orange-500 m-1 rounded-lg text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
									onClick={() =>
										handleVote(
											player.playerFields.turnId === turnIdNumber
												? player.playerFields.phrase
												: player.playerFields.guessMade
										)
									}
								>
									{player.playerFields.turnId === turnIdNumber
										? player.playerFields.phrase
										: player.playerFields.guessMade}
								</button>
							))}
						</ul>
					</div>
				) : (
					<ProgressBar
						totalPlayers={players.length}
						playersReady={actionList.length + 1}
						text="Espera a que todos los jugadores voten."
					/>
				)
			) : (
				<p>No se ha encontrado ningun jugador con el turnid: {turnid}</p>
			)}
		</div>
	);
};

export default VoteDrawing;

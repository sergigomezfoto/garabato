"use client";

import { fetchPlayersData } from "@/app/hooks/databaseDataRetreival";
import { handleUpdate } from "@/app/hooks/handleUpdate";
import ProgressBar from "@/components/ProgressBar";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import SinglePlayer from "@/components/SinglePlayer";

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
		playerFields: {
			name: string;
			drawing: string;
			turnId: number;
			avatar: string;
		};
	} | null>(null);
	const [vote, setVote] = useState("");

	const [myId, setMyId] = useState("");
	const [sala, setSala] = useState("");

	//Fetch all players data and set up listener
	useEffect(() => {
		const localStorageItem = localStorage.getItem("GarabatoTest");

		if (localStorageItem) {
			const { playerId: field1, sala: field2 } = JSON.parse(localStorageItem);
			setMyId(field1);
			setSala(field2);
			fetchPlayersData(field2, setPlayers, field1, setMyTurn);

			const playersCollectionRef = collection(
				db,
				"grabatoTest",
				field2,
				"players"
			);
			const unsubscribePlayers = onSnapshot(
				playersCollectionRef,
				(snapshot) => {
					const playersDone = snapshot.docs
						.map((doc) => doc.data().guessVoted)
						.filter((value) => value !== undefined);
					setActionList(playersDone);
				}
			);

			return () => unsubscribePlayers();
		}
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
	}, [players, turnIdNumber, myTurn]);

	// Handle vote
	const handleVote = async (vote: string) => {
		await handleUpdate(sala, myId, vote, "guessVoted", setActionStatus);
	};

	//Reroute players when all players are done.
	useEffect(() => {
		if (actionStatus === true && players?.length === actionList?.length + 1) {
			router.push(`/${turnIdNumber}/results`);
		}
	}, [actionList, actionStatus, router, turnIdNumber, players?.length]);

	return (
		<div className="flex flex-col justify-center items-center">
			{currentPlayer ? (
				actionStatus === false ? (
					<div className="flex flex-col items-center space-y-2">
						<h1>Este es el dibujo de:</h1>
						<SinglePlayer
							avatar={currentPlayer.playerFields.avatar}
							name={currentPlayer.playerFields.name}
						/>
						<img
							src={currentPlayer.playerFields.drawing}
							alt="Dibujo"
							className="m-5 max-h-[50vh]"
						/>
						<h1>Vota lo que crees que es.</h1>

						<ul className="flex flex-wrap justify-center items-center gap-4">
							{players
								.filter(
									(player: Player) => player.playerFields.turnId !== myTurn
								)
								.map((player: Player, index: number) => (
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
						text="Los jugadores estan votando lo que opinan del dibujo, espera a que todos terminen."
					/>
				)
			) : (
				<p>No se ha encontrado ningun jugador con el turnid: {turnid}</p>
			)}
		</div>
	);
};

export default VoteDrawing;

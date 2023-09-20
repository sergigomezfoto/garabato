"use client";

import { fetchPlayersData } from "@/app/hooks/databaseDataRetreival";
import { handleUpdate } from "@/app/hooks/handleUpdate";
import ProgressBar from "@/components/ProgressBar";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";

const GuessDrawing = () => {
	//TODO
	//Room name comes from before
	const sala = "hola";
	//Drawing comes from before, for now using random picture.
	const image =
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU";
	//These whoami variables come from before
	const whoamiName = "uri";
	//const whoamiId = "CXcVHaxEqIYa3bbCUTgH"; const whoamiTurn = 1;
	//const whoamiId = "Cyjas3jW8in2YStdypTi"; const whoamiTurn = 2;
	//const whoamiId = "zSvSa9QA7siQHrNOQj8K"; const whoamiTurn = 3;
	const whoamiId = "Al2c0UwLHC6buXVbZu3c";
	const whoamiTurn = 4;

	const { turnid } = useParams();
	const turnIdNumber = parseInt(turnid as string, 10);
	const router = useRouter();

	const [actionStatus, setActionStatus] = useState<boolean>(false);
	const [players, setPlayers] = useState<any>();
	const [actionList, setActionList] = useState<any>();
	const [currentPlayer, setCurrentPlayer] = useState();
	const [guess, setGuess] = useState("");

	//Fetch all players data.
	useEffect(() => {
		fetchPlayersData(sala, setPlayers);
	}, [sala]);

	//Filter player based on turnIdNumber.
	useEffect(() => {
		if (players) {
			const currentPlayer = players.find(
				(player: { playerFields: { turnId: number } }) =>
					player.playerFields.turnId === turnIdNumber
			);

			if (currentPlayer) {
				setCurrentPlayer(currentPlayer);
				if (currentPlayer.playerFields.turnId === whoamiTurn) {
					setActionStatus(true);
				}
			}
		}
	}, [players]);

	// Handle form submit
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await handleUpdate(sala, whoamiId, guess, "guessMade", setActionStatus);
	};

	//Listen to databse and control player status
	useEffect(() => {
		const playersCollectionRef = collection(db, "grabatoTest", sala, "players");
		const unsubscribePlayers = onSnapshot(playersCollectionRef, (snapshot) => {
			const playersDone = snapshot.docs
				.map((doc) => doc.data().guessMade)
				.filter((value) => value !== undefined);
			setActionList(playersDone);
		});
		if (actionStatus === true && players?.length === actionList?.length + 1) {
			router.push(`/${turnIdNumber}/vote`);
		}

		return () => unsubscribePlayers();
	}, [sala, actionStatus]);

	return (
		<div className="flex flex-col justify-center items-center">
			{currentPlayer ? (
				actionStatus === false ? (
					<div className="flex flex-col items-center space-y-2">
						<h1>Este es el dibujo de {currentPlayer.playerFields.name}.</h1>
						<img src={image} alt="Dibujo" className="m-5" />
						<h1>Descríbelo con pocas palabras.</h1>
						<form onSubmit={handleSubmit}>
							<input
								className="m-3"
								type="text"
								placeholder=""
								name="pictureGuess"
								value={guess}
								onChange={(e) => setGuess(e.target.value)}
								autoComplete="off"
								required
							/>
							<button
								type="submit"
								className="rounded-full shadow-lg px-1 py-0.5"
								style={{ backgroundColor: "#FFB6C1" }}
							>
								¡Hecho!
							</button>
						</form>
					</div>
				) : (
					<ProgressBar
						totalPlayers={players.length}
						playersReady={actionList.length + 1}
					/>
				)
			) : (
				<p>No se ha encontrado ningun jugador con el turnid: {turnid}</p>
			)}
		</div>
	);
};

export default GuessDrawing;

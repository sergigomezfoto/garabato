"use client";

import { fetchPlayersData } from "@/app/hooks/databaseDataRetreival";
import { handleUpdate } from "@/app/hooks/handleUpdate";
import ProgressBar from "@/components/ProgressBar";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const GuessDrawing = () => {
	console.log("I am the first console log");
	const [myTurn, setMyTurn] = useState<any>();
	const [myId, setMyId] = useState<string>("");
	const [sala, setSala] = useState<string>("");
	const { turnid } = useParams();
	const turnIdNumber = parseInt(turnid as string, 10);
	const router = useRouter();

	const [actionStatus, setActionStatus] = useState<boolean>(false);
	const [players, setPlayers] = useState<any>();
	const [actionList, setActionList] = useState<any>();
	const [currentPlayer, setCurrentPlayer] = useState<{
		playerFields: { name: string; drawing: string; turnId: number };
	} | null>(null);
	const [guess, setGuess] = useState("");

	//Fetch my data
	useEffect(() => {
		console.log("I am fetch my data hook");
		const localStorageItem = localStorage.getItem("GarabatoTest");
		if (localStorageItem) {
			const { playerId, sala } = JSON.parse(localStorageItem);
			console.log(playerId, sala);
			setMyId(playerId);
			setSala(sala);
		}
	}, []);

	//Fetch all players data.
	useEffect(() => {
		console.log("I am fetch all players data hook");
		if (myId && sala) {
			fetchPlayersData(sala, setPlayers, myId, setMyTurn);
			console.log(myTurn);
		}
	}, [myId, sala]);

	//Filter player based on turnIdNumber.
	useEffect(() => {
		console.log("I am filter hook");
		console.log("At this point, this variables should be filled: ", myId, sala);
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

	// Handle form submit
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await handleUpdate(sala, myId, guess, "guessMade", setActionStatus);
	};

	//Listen to databse and control player status
	useEffect(() => {
		console.log("I am the listener hook");
		const playersCollectionRef = collection(db, "grabatoTest", sala, "players");
		const unsubscribePlayers = onSnapshot(playersCollectionRef, (snapshot) => {
			const playersDone = snapshot.docs
				.map((doc) => doc.data().guessMade)
				.filter((value) => value !== undefined);
			setActionList(playersDone);
		});

		return () => unsubscribePlayers();
	}, [myId, sala]);

	//Reroute players when all players are done.
	useEffect(() => {
		console.log("I am the rerouter hook");
		if (actionStatus === true && players?.length === actionList?.length + 1) {
			console.log("now all routed!");
			router.push(`/${turnIdNumber}/vote`);
		}
	}, [actionList]);

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
						text="Espera a que todos los jugadores envien su palabra."
					/>
				)
			) : (
				<p>No se ha encontrado ningun jugador con el turnid: {turnid}</p>
			)}
		</div>
	);
};

export default GuessDrawing;

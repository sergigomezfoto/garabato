"use client";

import { fetchPlayersData } from "@/app/hooks/databaseDataRetreival";
import { handleUpdate } from "@/app/hooks/handleUpdate";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

//A ver esto donde se refleja

const ShowDrawing = () => {
	//TODO
	//Room name comes from before
	const sala = "hola";
	//Drawing comes from before, for now using random picture.
	const image =
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU";
	//These whoami variables come from before
	const whoamiTurn = 1;
	const whoamiName = "uri";
	const whoamiId = "zSvSa9QA7siQHrNOQj8K"; //CXcVHaxEqIYa3bbCUTgH Cyjas3jW8in2YStdypTi
	//Add listener and redirection to artist user.

	const [actionStatus, setActionStatus] = useState<boolean>(false);
	const [players, setPlayers] = useState<any>();
	const [orto, setOrto] = useState<any>();
	const [currentPlayer, setCurrentPlayer] = useState();
	const { turnid } = useParams();
	const turnIdNumber = parseInt(turnid as string, 10);
	const [guess, setGuess] = useState("");
	const router = useRouter();

	useEffect(() => {
		fetchPlayersData(sala, setPlayers);
	}, [sala]);

	useEffect(() => {
		if (players) {
			const currentPlayer = players.find(
				(player) => player.playerFields.turnId === turnIdNumber
			);
			setCurrentPlayer(currentPlayer);
			if (currentPlayer.playerFields.turnId === whoamiTurn) {
				setActionStatus(true);
			}
		}
	}, [players]);

	//Filter player based on turnIdNumber.

	// Handle form submit
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await handleUpdate(
			sala,
			whoamiId,
			guess,
			turnIdNumber,
			"guessMade",
			"vote",
			router,
			setActionStatus
		);
	};

	useEffect(() => {
		const playersCollectionRef = collection(db, "grabatoTest", sala, "players");
		const unsubscribePlayers = onSnapshot(playersCollectionRef, (snapshot) => {
			const playersDone = snapshot.docs.map((doc) => doc.data().guessMade);
			setOrto(playersDone);
		});

		return () => unsubscribePlayers(); // Desubscriure's quan el component es desmonti
	}, [sala]);

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
					<div className="flex flex-col items-center space-y-2">
						<h1>Eres tu atontao.</h1>
						<h1>List of Players:</h1>
						<ul>
							{orto.map((guessito: string) => (
								<li key={guessito}>{guessito}</li>
							))}
						</ul>
					</div>
				)
			) : (
				<p>No matching player found for turnid: {turnid}</p>
			)}
		</div>
	);
};

export default ShowDrawing;

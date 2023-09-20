"use client";

import { fetchPlayersData } from "@/app/hooks/databaseDataRetreival";
import { handleUpdate } from "@/app/hooks/handleUpdate";
import ProgressBar from "@/components/ProgressBar";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const VoteDrawing = () => {
	//TODO
	//Room name comes from before
	const sala = "hola";
	//Drawing comes from before, for now using random picture.
	const image =
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU";
	//These whoami variables come from before
	const whoamiName = "uri";
	//const whoamiId = "CXcVHaxEqIYa3bbCUTgH"; const whoamiTurn = 1;
	const whoamiId = "Cyjas3jW8in2YStdypTi";
	const whoamiTurn = 2;
	//const whoamiId = "zSvSa9QA7siQHrNOQj8K"; const whoamiTurn = 3;
	//const whoamiId = "Al2c0UwLHC6buXVbZu3c"; const whoamiTurn = 4;

	const { turnid } = useParams();
	const turnIdNumber = parseInt(turnid as string, 10);
	const router = useRouter();

	const [actionStatus, setActionStatus] = useState<boolean>(false);
	const [players, setPlayers] = useState<any>();
	const [actionList, setActionList] = useState<any>();
	const [currentPlayer, setCurrentPlayer] = useState();
	const [vote, setVote] = useState("");

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

	// Handle vote
	const handleVote = async (vote: string) => {
		await handleUpdate(sala, whoamiId, vote, "guessVoted", setActionStatus);
	};

	//Listen to databse and control player status
	useEffect(() => {
		const playersCollectionRef = collection(db, "grabatoTest", sala, "players");
		const unsubscribePlayers = onSnapshot(playersCollectionRef, (snapshot) => {
			const playersDone = snapshot.docs
				.map((doc) => doc.data().guessVoted)
				.filter((value) => value !== undefined);
			setActionList(playersDone);
		});
		if (actionStatus === true && players?.length === actionList?.length + 1) {
			router.push(`/${turnIdNumber}/results`);
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
						<h1>Vota lo que crees que es.</h1>

						<ul className="flex flex-wrap justify-center items-center gap-4">
							{players.map((player, index) => (
								<button
									key={index}
									value={vote}
									className="p-2 bg-orange-500 m-1 rounded-lg text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
									onClick={() => handleVote(player.playerFields.guessMade)}
								>
									{player.playerFields.guessMade}
								</button>
							))}
						</ul>
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

export default VoteDrawing;

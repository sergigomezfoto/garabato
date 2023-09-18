"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";
import { handleUpdate } from "../../../hooks/handleUpdate";
import { fetchPlayersData } from "../../../hooks/databaseDataRetreival";

const DrawingGuesses = () => {
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
	//currentPlayer comes from before.

	const [players, setPlayers] = useState<any[]>([]);
	const { turnid } = useParams();
	const turnIdNumber = parseInt(turnid as string, 10);
	const router = useRouter();

	useEffect(() => {
		fetchPlayersData(sala, setPlayers); // Use the utility function to fetch player data
	}, [sala]);

	//Filter player based on turnIdNumber.
	const currentPlayer = players.find(
		(player) => player.playerFields.turnId === turnIdNumber
	);

	console.log("This is ", players);

	// Handle vote
	const handleVote = async (vote: string) => {
		await handleUpdate(
			sala,
			whoamiId,
			vote,
			turnIdNumber,
			"guessVoted",
			"results",
			router
		);
	};

	return (
		<div className="flex flex-col justify-center items-center">
			{currentPlayer ? (
				currentPlayer.playerFields.turnId !== whoamiTurn ? (
					<div className="flex flex-col items-center space-y-2">
						<h1>Este es el dibujo de {currentPlayer.playerFields.name}.</h1>
						<img src={image} alt="Dibujo" className="m-5" />
						<h1>Vota lo que crees que es.</h1>

						<ul className="flex flex-wrap justify-center items-center gap-4">
							{players.map((player, index) => (
								<button
									key={index}
									className="p-2 bg-orange-500 m-1 rounded-lg text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
									onClick={() => handleVote(player.playerFields.guessMade)}
								>
									{player.playerFields.guessMade}
								</button>
							))}
						</ul>
					</div>
				) : (
					<div className="flex flex-col items-center space-y-2">
						<h1>Eres tu atontao.</h1>
					</div>
				)
			) : (
				<p>No matching player found for turnid: {turnid}</p>
			)}
		</div>
	);
};

export default DrawingGuesses;

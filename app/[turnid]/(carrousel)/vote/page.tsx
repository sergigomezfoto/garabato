"use client";

import { fetchPlayersData } from "@/app/hooks/databaseDataRetreival";
import { db } from "@/firebase/firebase";
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

	const [guesses, setGuesses] = useState<any[]>([]);
	const [players, setPlayers] = useState<any[]>([]);

	useEffect(() => {
		fetchPlayersData(sala, setPlayers); // Use the utility function to fetch player data
	}, [sala]);

	console.log("This is ", players);

	const handleVote = async (vote: string) => {
		// Get the guess object that the user wants to vote for
		console.log("avore", vote);

		// Increment the "vote" property of the selected guess in the database
		const guessDocRef = doc(db, "grabatoTest", sala, "players", whoamiId);

		try {
			await updateDoc(guessDocRef, {
				guessVoted: vote,
			});
			console.log("Vote updated successfully!");
		} catch (error) {
			console.error("Error updating vote:", error);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center">
			<h1>Guesses</h1>
			<img
				src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU"
				alt="dibujo"
				className="m-5"
			/>

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
	);
};

export default DrawingGuesses;

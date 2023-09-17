"use client";

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
	//whoamiTurn comes from before
	const whoamiTurn = 3;
	//whoamiName comes from before
	const whoamiName = "mama";
	//Add listener and redirection to artist user.
	//currentPlayer comes from before.
	const playerInTurn = "CXcVHaxEqIYa3bbCUTgH";

	const [guesses, setGuesses] = useState<any[]>([]);

	useEffect(() => {
		//Create reference to players in DB.
		const playerDocRef = doc(db, "grabatoTest", sala, "players", playerInTurn);

		// Get the player document data and access the nameGuessVote field
		getDoc(playerDocRef)
			.then((docSnapshot) => {
				if (docSnapshot.exists()) {
					const playerData = docSnapshot.data();
					if (playerData && playerData.nameGuessVote) {
						const nameGuessesVote = playerData.nameGuessVote;
						setGuesses(nameGuessesVote);
					} else {
						console.log(
							"namePlusGuess field does not exist in player document."
						);
					}
				} else {
					console.log("Player document does not exist.");
				}
			})
			.catch((error) => {
				console.error("Error fetching player document:", error);
			});
	}, [sala]);

	console.log("This is ", guesses[0].guess);

	return (
		<div className="flex flex-col justify-center items-center">
			<h1>Guesses</h1>
			<img
				src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU"
				alt="dibujo"
				className="m-5"
			/>

			<ul className="flex flex-wrap justify-center items-center gap-4">
				{guesses.map((guess, index) => (
					<button className="p-2 bg-orange-500 m-1 rounded-lg text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300">
						<li key={index}>{guess.guess}</li>
					</button>
				))}
			</ul>
		</div>
	);
};

export default DrawingGuesses;

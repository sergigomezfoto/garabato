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

		// Get the player document data and access the namePlusGuess field
		getDoc(playerDocRef)
			.then((docSnapshot) => {
				if (docSnapshot.exists()) {
					const playerData = docSnapshot.data();
					if (playerData && playerData.namePlusGuess) {
						const namePlusGuesses = playerData.namePlusGuess;
						setGuesses(namePlusGuesses);
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
	}, [sala, playerInTurn]);

	console.log("This is ", guesses);

	return (
		<div className="flex flex-col justify-center items-center">
			<h1>Guesses for Player {playerInTurn}</h1>
			<ul>
				{guesses.map((guess, index) => (
					<li key={index}>{JSON.stringify(guess)}</li>
				))}
			</ul>
		</div>
	);

	/*return (
		<div className="flex flex-col justify-center items-center">
			<h1>Guesses</h1>
			<img
				src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU"
				alt="dibujo"
				className="m-5"
			/>
			<button className="m-3">Guess 1</button>
			<button className="m-3">Guess 2</button>
			
		</div>
	);*/
};

export default DrawingGuesses;

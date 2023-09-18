"use client";

import { db } from "@/firebase/firebase";
import {
	arrayUnion,
	collection,
	doc,
	getDocs,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

	const [players, setPlayers] = useState<any[]>([]);
	const { turnid } = useParams();
	const turnIdNumber = parseInt(turnid as string, 10);
	const [guess, setGuess] = useState("");
	const router = useRouter();

	useEffect(() => {
		//Create reference to players in DB.
		const playersCollectionRef = collection(db, "grabatoTest", sala, "players");
		//Get all players information.
		getDocs(playersCollectionRef)
			.then((querySnapshot) => {
				const playersData = querySnapshot.docs.map((doc) => {
					// Include the document ID as a property
					const dataWithId = {
						playerID: doc.id,
						playerFields: doc.data(),
					};
					return dataWithId;
				});
				setPlayers(playersData);
			})
			.catch((error) => {
				console.error("Error fetching players:", error);
			});
	}, [sala]);

	//Filter player based on turnIdNumber.
	const currentPlayer = players.find(
		(player) => player.playerFields.turnId === turnIdNumber
	);

	//Handle form submit.
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		//Create reference to player in DB.
		const playerDocRef = doc(db, "grabatoTest", sala, "players", whoamiId);

		try {
			//Update the player's document with the guess
			await updateDoc(playerDocRef, {
				guessMade: guess,
			});
			console.log("Guess saved successfully!");
			router.push(`/${turnid}/vote`);
		} catch (error) {
			console.error("Error saving guess:", error);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center">
			{currentPlayer ? (
				currentPlayer.playerFields.turnId !== whoamiTurn ? (
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
					</div>
				)
			) : (
				<p>No matching player found for turnid: {turnid}</p>
			)}
		</div>
	);
};

export default ShowDrawing;

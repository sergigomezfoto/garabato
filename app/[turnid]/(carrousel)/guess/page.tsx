"use client";

import { db } from "@/firebase/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const ShowDrawing = () => {
	//TODO
	//Room name comes from before
	const sala = "hola";
	//Drawing comes from before, for now using random picture.
	const image =
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU";
	//whoamiTurn comes from before
	const whoamiTurn = 2;
	//whoamiName comes from before
	const whoamiName = "mama";

	const [players, setPlayers] = useState<any[]>([]);
	const { turnid } = useParams();
	const turnidNumber = parseInt(turnid as string, 10);
	const [guess, setGuess] = useState("");

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

	//Filter player based on turnidNumber.
	const currentPlayer = players.find(
		(player) => player.playerFields.turnid === turnidNumber
	);

	//Handle form submit.
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		//Create reference to player in DB.
		const playerDocRef = doc(
			db,
			"grabatoTest",
			sala,
			"players",
			currentPlayer.playerID
		);

		try {
			//Update the player's document with the guess
			await setDoc(playerDocRef, { guess }, { merge: true });
			console.log("Guess saved successfully!");
		} catch (error) {
			console.error("Error saving guess:", error);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center">
			{currentPlayer ? (
				currentPlayer.playerFields.turnid !== whoamiTurn ? (
					<div className="flex flex-col items-center space-y-2">
						<h1>Este es el dibujo de {currentPlayer.name}.</h1>
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

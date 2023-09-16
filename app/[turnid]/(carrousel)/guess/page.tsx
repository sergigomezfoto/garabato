"use client";

import { DoneButtonStructure } from "@/components/DoneButton";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { useState, useEffect } from "react";

const ShowDrawing = () => {
	const sala = "hola";

	const [players, setPlayers] = useState<any[]>([]);

	useEffect(() => {
		const playersCollectionRef = collection(db, "grabatoTest", sala, "players");
		const unsubscribePlayers = onSnapshot(playersCollectionRef, (snapshot) => {
			const playersData = snapshot.docs.map((doc) => doc.data());
			setPlayers(playersData);
		});

		return () => unsubscribePlayers(); // Desubscriure's quan el component es desmonti
	}, [sala]);

	return (
		<div className="flex flex-wrap max-w-md justify-center gap-4">
			{players.map((player, index) => (
				<div key={index} className="flex flex-col items-center space-y-2">
					<img
						src={player.avatar}
						alt={player.name}
						className="rounded-full w-16 h-16"
					/>
					<span className="text-lg">{player.name}</span>
				</div>
			))}
		</div>
	);

	/*	//This variables will be obtained from DB
	const user = "Uri";
	const image =
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU";

	return (
		<div className="flex flex-col justify-center items-center">
			<h1>Este es el dibujo de {user}.</h1>
			<img src={image} alt="Dibujo" className="m-5" />
			<h1>Descríbelo con pocas palabras.</h1>
			<form>
				<input className="m-3" type="text" placeholder="" />
				<DoneButtonStructure text="¡Hecho!" hexCode="#FFB6C1" />
			</form>
		</div>
	);

	*/
};

export default ShowDrawing;

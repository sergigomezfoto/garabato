import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function fetchPlayersData(
	sala: string,
	setPlayers: (players: any[]) => void,
	myId: string,
	setMyTurn: (players: any[]) => void
) {
	try {
		//Create reference to players in DB.
		const playersCollectionRef = collection(db, "grabatoTest", sala, "players");
		//Get all players information.
		const querySnapshot = await getDocs(playersCollectionRef);
		//Modify data as needed.
		const playersData = querySnapshot.docs.map((doc) => ({
			playerID: doc.id,
			playerFields: doc.data(),
		}));
		setPlayers(playersData);

		setMyTurn(
			playersData.find((playerData) => playerData.playerID === myId)
				?.playerFields.turnId
		);
	} catch (error) {
		console.error("Error fetching players:", error);
	}
}

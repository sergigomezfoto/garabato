import { db } from "@/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export async function handleUpdate(
	sala: string,
	whoamiId: string,
	update: string,
	updateField: string,
	setActionStatus: Dispatch<SetStateAction<boolean>>
) {
	//Create reference to player in DB.
	const docRef = doc(db, "grabatoTest", sala, "players", whoamiId);

	try {
		await updateDoc(docRef, {
			[updateField]: update,
		});
		console.log("Updated successfully!");
		setActionStatus(true);
	} catch (error) {
		console.error("Error saving:", error);
	}
}

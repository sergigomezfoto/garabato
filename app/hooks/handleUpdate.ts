import { db } from "@/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export async function handleUpdate(
	sala: string,
	whoamiId: string,
	update: string,
	turnid: number,
	updateField: string,
	redirectTo: string,
	router: string[] | AppRouterInstance
) {
	//Create reference to player in DB.
	const docRef = doc(db, "grabatoTest", sala, "players", whoamiId);

	try {
		await updateDoc(docRef, {
			[updateField]: update,
		});
		console.log("Updated successfully!");
		router.push(`/${turnid}/${redirectTo}`);
	} catch (error) {
		console.error("Error saving:", error);
	}
}

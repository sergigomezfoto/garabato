import { doc, writeBatch, getFirestore } from "firebase/firestore";
import {Player} from '@/types/types'
import { Dispatch, SetStateAction } from "react";

const db = getFirestore();

export default async function updatePlayersDB(
  players: Player[],
  sala: string,
  setUpdatePlayerReady: Dispatch<SetStateAction<boolean>>,
  resetGuessAndVoted: boolean = false
) {
  // Create a batch instance
  const batch = writeBatch(db);

  try {
    players.forEach((player) => {
      // Create reference to each player in DB.
      const docRef = doc(db, "grabatoTest", sala, "players", player.id);
      
      if (resetGuessAndVoted){
        const guessMade = ''
        const guessVoted = ''
      } else {
        const guessMade = player.guessMade
        const guessVoted = player.guessVoted
      }

      // Stage each update in the batch
      batch.update(docRef, {
        isMaster: player.isMaster,
        name: player.name,
        avatar: player.avatar,
        turnId: player.turnId,
        drawing: player.drawing,
        phrase: player.phrase,
        guessMade: player.guessMade,
        guessVoted: player.guessVoted,
        score: player.score,
        totalScore: player.totalScore,
      });
    });

    // Commit the batch
    await batch.commit();

    console.log("Players updated successfully!");
    setUpdatePlayerReady(true);
  } catch (error) {
    console.error("Error updating players:", error);
  }
}

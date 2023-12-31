import { doc, writeBatch, getFirestore, deleteField } from "firebase/firestore";
import { Player } from '@/types/types'
import { Dispatch, SetStateAction } from "react";

const db = getFirestore();

export async function updatePlayersResults(
  players: Player[],
  sala: string,
) {
  // Create a batch instance
  const batch = writeBatch(db);

  try {
    players.forEach((player) => {
      // Create reference to each player in DB.
      const docRef = doc(db, "grabatoTest", sala, "players", player.id);
      if (player.score) {
        // Stage each update in the batch
        batch.update(docRef, {
          score: player.score,
        })
      } else {
        batch.update(docRef, {
          score: 0,
        })
      }
        ;
    });

    // Commit the batch
    await batch.commit();

    console.log("Players updated successfully!");
  } catch (error) {
    console.error("Error updating players:", error);
  }
};

export async function deleteGuessesAndVotes(
  players: Player[],
  sala: string,
  drawerTurnId: number|undefined
) {
  // Create a batch instance
  const batch = writeBatch(db);

  try {
    players.forEach((player) => {
      // Create reference to each player in DB.
      const docRef = doc(db, "grabatoTest", sala, "players", player.id);

      if (drawerTurnId !== player.turnId) {
        // Stage each update in the batch
        batch.update(docRef, {
          guessMade: deleteField(),
          guessVoted: deleteField(),
          score: 0,
          totalScore: (player.totalScore ?? 0) + (player.score ?? 0)
        });
      } else {
        batch.update(docRef, {
          score: 0,
          totalScore: (player.totalScore ?? 0) + (player.score ?? 0)
        });
      }
    }
    );

    // Commit the batch
    await batch.commit();
    console.log("Players guesses and votes deleted successfully!");
  } catch (error) {
    console.error("Error updating players:", error);
  }
}

import {Player} from "@/types/types"
import { Dispatch, SetStateAction } from "react";

const calculatePoints = (players: Player[], drawerIdx: number, guessId: number, setPlayers: Dispatch<SetStateAction<Player[]>>) => {


    // Copy the players array to make changes
    const updatedPlayers = [...players];

    if (drawerIdx !== null && guessId !== null) {


        // Find the player who made the current guess
        const guessAuthorIdx = players.findIndex(player => player.turnId === guessId);

        if (guessAuthorIdx != -1) {
            const originaTitle = players[drawerIdx]?.phrase;

            // Voters who chose the current guess
            const votersForCurrentGuessIdxs = players.findIndex(player => player.guessVoted === players[guessAuthorIdx].guessMade);

            // Count how many players voted for the current guess
            const count = players.filter((player) => player.guessVoted === players[guessAuthorIdx].guessMade).length;

            // Give score to the guessAuthor
            updatedPlayers[guessAuthorIdx].score = (updatedPlayers[guessAuthorIdx].score ?? 0) + 100 * count;

            // Update pointsForAuthor
            updatedPlayers.forEach((player) => {
                // If player voted for the current guess
                if (player.guessVoted == players[guessAuthorIdx].guessMade) {
                    player.pointsForAuthor = 100
                } else {
                    player.pointsForAuthor = 0
                }

                //if we are in the original title 
                if (guessAuthorIdx === drawerIdx && player.guessVoted === originaTitle) {
                    player.score = (player.score ?? 0) + 100;
                }
            });

        }

        // Update the state
        setPlayers(updatedPlayers);
        return {updatedPlayers}
    }

}

export default calculatePoints
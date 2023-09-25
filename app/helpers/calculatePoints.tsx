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

            // Count how many players voted for the current guess
            const count = players.filter((player) => player.guessVoted === players[guessAuthorIdx].guessMade).length;

            // Give score to the guessAuthor
            updatedPlayers[guessAuthorIdx].score = (updatedPlayers[guessAuthorIdx].score ?? 0) + 100 * count;

            //if we are in the original title and someone gueesed it
            if (guessAuthorIdx === drawerIdx && count) {
                // Update score for drawer
                players[drawerIdx].score = (players[drawerIdx].score ?? 0) + 100;
                // Update score for players
                updatedPlayers.forEach((player) => {
                    //if we are in the original title 
                    if (guessAuthorIdx === drawerIdx && player.guessVoted === originaTitle) {
                        player.score = (player.score ?? 0) + 100;
                    }
                });
            }


        }

        // Update the state
        setPlayers(updatedPlayers);
        return {updatedPlayers}
    }

}

export default calculatePoints
import { Player } from "@/types/types"
import { Dispatch, SetStateAction } from "react";

const calculatePoints = (players: Player[], drawerIdx: number, guessId: number, setPlayers: Dispatch<SetStateAction<Player[]>>) => {
    console.log('55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555');
    console.log('55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555');
    // log all the arguments
    console.log("players: ", players);
    console.log("drawerIdx: ", drawerIdx);
    console.log("guessId: ", guessId);
    
    
    
    // Copy the players array to make changes
    const updatedPlayers = [...players];
    
    if (drawerIdx !== null && guessId !== null) {
        console.log('primer if');
        
        
        // Find the player who made the current guess
        const guessAuthorIdx = players.findIndex(player => player.turnId === guessId);
        
        if (guessAuthorIdx != -1) {
            console.log('segon if');
            const originaTitle = players[drawerIdx]?.phrase;

            if (guessAuthorIdx !== drawerIdx) {
            // Count how many players voted for the current guess
            const count = players.filter((player) => player.guessVoted === players[guessAuthorIdx].guessMade).length;
            // Give score to the guessAuthor
            updatedPlayers[guessAuthorIdx].score = (updatedPlayers[guessAuthorIdx].score ?? 0) + 100 * count;
            } else {
                //if we are in the original title and someone gueesed it
                console.log('tercer if');
                
                // Update score for drawer
                players[drawerIdx].score = (players[drawerIdx].score ?? 0) + 100;
                // Update score for players
                updatedPlayers.forEach((player) => {
                    console.log('quart if');

                    if (player.guessVoted === originaTitle) {
                        player.score = (player.score ?? 0) + 100;
                    }
                });
            }
            
        }
        
        // Update the state
        setPlayers(updatedPlayers);
    }
    console.log("updatedPlayers: ", updatedPlayers);
    console.log('55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555');
    console.log('55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555');
    
    return { updatedPlayers }
    
}

export default calculatePoints
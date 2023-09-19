import { Timestamp } from "firebase/firestore";

type PossiblePaths = 'create' | 'join' | 'drawing' | 'startgame' | 'guess' | 'vote' | 'results' | 'score' | 'finalresults';

type Room = {
    room: string;
    closedRoom: boolean;
    created: Timestamp;
    game_current_path: string;
}

type Player = {
    id: number;
    isMaster: boolean;
    local_current_path: PossiblePaths;
    name?: string;
    avatar?: string //max 1MB
    drawing?: string
    phrase?: string;
    turnId?: number;
    guessVoted?: boolean;
    guessMade?: boolean;
    score?: number
}

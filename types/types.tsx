import { Timestamp } from "firebase/firestore";


export type Player = {
    id: string;
	isMaster?: boolean;
    name: string;
    avatar: string;
	turnId?: number; //This is the turnId each player are the drawer
	drawing?: string
    phrase?: string;
	guessMade?: string;
	guessVoted?: string;
	pointsForAuthor?: number;
	score?: number;
	totalScore?: number;
};
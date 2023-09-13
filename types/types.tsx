type Game = {
    id: number;
    status: boolean;
    current_path: string; 
}

type User = {
    id: number;
    name: string;
    portrait_svg: string //max 1MB
    master: boolean;
    local_current_path: string;
    score: number;
}

type Drawing = {
    id: number;
    drawing_svg: string; //max 1MB
    original_title: string;
    guess: Guess;
    
}

type Guess = { //ex Celeste, space cow, [Oriol, Jordi]
    author: string;
    phrase: string;
    votes: string[];
}
const changeFirstLetter = (input: string, probability: number): string => {
    if (Math.random() >= probability) {
        return input;
    }

    const firstLetter = input.charAt(0);
    const restOfString = input.slice(1);

    return (Math.random() < 0.5 ? firstLetter.toUpperCase() : firstLetter.toLowerCase()) + restOfString;
};
const removeSingleSpace = (input: string, probability: number): string => {
    if (Math.random() >= probability) {
        return input;
    }

    const words = input.split(" ");
    let spaceRemoved = false;
    let newWords: string[] = [];

    //7 Escoleixo una posicio aleatòria per eliminar un espai
    const randomPosition = Math.floor(Math.random() * (words.length - 1));

    for (let i = 0; i < words.length; i++) {
        if (i === 0) {
            newWords.push(words[i]);
            continue;
        }

        if (!spaceRemoved && i === randomPosition + 1) {
            spaceRemoved = true;
            newWords[randomPosition] += words[i];
        } else {
            newWords.push(" " + words[i]);
        }
    }

    return newWords.join("");
};

const addSingleSpace = (input: string, probability: number): string => {
    if (Math.random() >= probability || input.length < 3) {
        return input;
    }

    const randomPosition = Math.floor(Math.random() * (input.length - 2)) + 1;

    return input.slice(0, randomPosition) + ' ' + input.slice(randomPosition);
};

const togglePeriod = (input: string, probability: number): string => {
    if (Math.random() >= probability) {
        return input;
    }

    if (input.endsWith('.')) {
        return input.slice(0, -1);
    } else {
        return input + '.';
    }
};
const removeRandomAccent = (input: string, probability: number): string => {
    if (Math.random() >= probability) {
        return input;
    }

    const accentsMap: { [key: string]: string } = {
        'á': 'a',
        'é': 'e',
        'í': 'i',
        'ó': 'o',
        'ú': 'u',
        'à': 'a',
        'è': 'e',
        'ì': 'i',
        'ò': 'o',
        'ù': 'u',
        'ä': 'a',
        'ë': 'e',
        'ï': 'i',
        'ö': 'o',
        'ü': 'u',
        'â': 'a',
        'ê': 'e',
        'î': 'i',
        'ô': 'o',
        'û': 'u'
    };
    const positions: number[] = [];
    const entries = Array.from(input).entries();
    let iter = entries.next();

    while (!iter.done) {
        const [index, char] = iter.value;
        if (accentsMap.hasOwnProperty(char)) {
            positions.push(index);
        }
        iter = entries.next();
    }

    if (positions.length === 0) {
        return input;
    }

    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    const char = input.charAt(randomPosition);
    const newChar = accentsMap[char];

    return input.slice(0, randomPosition) + newChar + input.slice(randomPosition + 1);
};

const duplicateRandomLetter = (input: string, probability: number): string => {
    if (Math.random() >= probability || input.length === 0) {
        return input;
    }

    const positions: number[] = [];
    const entries = Array.from(input).entries();
    let iter = entries.next();

    while (!iter.done) {
        const [index, char] = iter.value;
        if (char !== ' ') {
            positions.push(index);
        }
        iter = entries.next();
    }

    if (positions.length === 0) {
        return input;
    }

    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    const char = input.charAt(randomPosition);

    return input.slice(0, randomPosition) + char + input.slice(randomPosition);
};

const substituteLettersSpanish = (input: string, probability: number): string => {
    if (Math.random() >= probability) {
        return input;
    }

    const indices = Array.from({ length: input.length }, (_, i) => i);
    const shuffledIndices = [...indices].sort(() => Math.random() - 0.5);

    let newStringArray = new Array(input.length).fill('');
    let currentProbability = probability;

    for (const index of shuffledIndices) {
        let char = input[index];

        if (Math.random() < currentProbability) {
            switch (char) {
                case 'g':
                    if (input[index + 1] !== 'u') { // si no va seguit de u pq és menys probable que es confongui
                        char = 'j';
                    }
                    break;
                case 'j':
                    if (input[index + 1] !== 'u') { // si no va seguit de u pq és menys probable que es confongui
                        char = 'g';
                    }
                    break;
                case 'l':
                    if (input[index + 1] === 'l') {
                        char = 'y';
                        newStringArray[index + 1] = ''; // Elimino la segona 'l'
                    }
                    break;
                case 'h':
                    if (index === 0 || input[index - 1] === ' ') {
                        char = '';
                    }
                    break;
            }

            // Redueixola probabilitat de realitzar una altra substitucio
            currentProbability *= 0.8;
        }

        newStringArray[index] = char;
    }

    return newStringArray.join('');
};

const normalizeInteriorWordCase = (input: string, probability: number): string => {
    const words = input.split(" ");
    const newWords = words.map((word, index) => {
        if (index === 0) {
            return word; // No canviem la primera paraula
        }

        const firstLetter = word.charAt(0);
        if (firstLetter === firstLetter.toUpperCase() && Math.random() < probability) {
            return word.toLowerCase();
        }

        return word;
    });

    return newWords.join(" ");
};

const addRandomLetter = (input: string, probability: number): string => {
    if (Math.random() >= probability || input.length < 3) {
        return input;
    }

    const words = input.split(" ");
    const randomWordIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomWordIndex];

    if (randomWord.length < 2) {
        return input;
    }

    const randomPosition = Math.floor(Math.random() * (randomWord.length - 1)) + 1;
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z

    const newWord = randomWord.slice(0, randomPosition) + randomLetter + randomWord.slice(randomPosition);
    words[randomWordIndex] = newWord;

    return words.join(" ");
};


const humanizeString = (input: string): string => {
    const transformations = [
        { func: normalizeInteriorWordCase, prob: 0.6 },
        { func: changeFirstLetter, prob: 0.6 },
        { func: removeRandomAccent, prob: 0.5 },
        { func: substituteLettersSpanish, prob: 0.4 },
        { func: addRandomLetter, prob: 0.3 },
        { func: duplicateRandomLetter, prob: 0.1 },
        { func: removeSingleSpace, prob: 0.08 },
        { func: addSingleSpace, prob: 0.08 },
        { func: togglePeriod, prob: 0.06 },
    ];

    return transformations.reduce((acc, { func, prob }) => func(acc, prob), input);
};


export default humanizeString;
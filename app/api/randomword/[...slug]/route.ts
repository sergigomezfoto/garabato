import { NextResponse } from 'next/server';
import data from '../data.json';

const getRandomIndex = (array: string[]) => {
    return Math.floor(Math.random() * array.length);
};

//helper que ajuda a comprovar si s'ha fet servir una part de la frase
const getRandomUnusedItem = (set: Set<unknown>, data: string[]) => {
    let item;
    do {
        item = data[getRandomIndex(data)];
    } while (set.has(item));
    return item;
};

const MINLENGHT = 30;
const MINNUM = 2;
export const GET = async (req: Request, { params }: { params: { slug: string } }) => {
    const { slug } = params;
    const num = parseInt(slug[0], 10);
    let maxlen = parseInt(slug[1], 10);
    maxlen = isNaN(maxlen) ? 4000000 : maxlen;
    try {

        if (isNaN(num) || num < MINNUM) {
            return NextResponse.json({ error: `Invalid number of phrases. Minimum: ${MINNUM}` }, { status: 400 });

        }
        if (isNaN(maxlen) || maxlen < MINLENGHT) {
            return NextResponse.json({  error: `Max length too short to generate phrases. Minimum lenght: ${MINLENGHT}` }, { status: 400 });

        }
        if (num > data.person.length || num > data.action.length || num > data.place.length) {
            return NextResponse.json({ error: `Requested number of phrases exceeds available data` }, { status: 400 });
        }
        // sets per elminiar repeticions
        let usedPersons = new Set();
        let usedActions = new Set();
        let usedPlaces = new Set();

        let phrases = [];
        for (let i = 0; i < num; i++) {
            let randomPerson, randomAction, randomPlace;
            let randomPhrase;
            let attempts = 0;

            do {
                attempts++;
                randomPerson = getRandomUnusedItem(usedPersons, data.person);
                randomAction = getRandomUnusedItem(usedActions, data.action);
                randomPlace = getRandomUnusedItem(usedPlaces, data.place);

                if (!randomPerson || !randomAction || !randomPlace) {
                    throw new Error("Failed to generate a random phrase");
                }

                const capitalizedRandomPerson = randomPerson.charAt(0).toUpperCase() + randomPerson.slice(1);
                randomPhrase = `${capitalizedRandomPerson.trim()} ${randomAction.trim()} ${randomPlace.trim()}`;
            } while (randomPhrase.length > maxlen && attempts < 5000);

            if (attempts === 5000) {
                throw new Error("Failed to generate a phrase within the maximum length");
            }
            usedPersons.add(randomPerson);
            usedActions.add(randomAction);
            usedPlaces.add(randomPlace);
            phrases.push(randomPhrase);
        }
        return NextResponse.json({ phrases: phrases });
    } catch (error) {
        return NextResponse.json({ error: `Error generating the random phrases: [ ${error} ]` }, { status: 500 });
    }

}
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/*
en lloc de borrar les coleccions (firestore té problemes amb això en client, i via node gastem massa recursos tota la estona) la solució intermitja per treure
del mapa la sala i després ,en bloc i cada cert temps via node borrar les col·leccions de les sales que tinguin el nom DELETE_* és
renombrar la sala a DELETE_* i després borrar les col·leccions de les sales que tinguin el nom DELETE_* .
Una altra solució sería fer una API en next que es comuniqui amb firebase i que aquesta API es comuniqui amb el client per borrar les col·leccions. però
s'hauría de protergir l'API amb un token o algo així perquè no es pugui fer servir per borrar les col·leccions de tothom.


*/

const renameSalaToDelete = async (salaId: string) => {
    const uniqueString = `DELETE_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const salaRef = doc(db, 'garabatoTest', salaId);
    await updateDoc(salaRef, { nom: uniqueString });
};

export default renameSalaToDelete;
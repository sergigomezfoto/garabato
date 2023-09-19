'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { handleUpdate } from "../../../hooks/handleUpdate";
import { fetchPlayersData } from "../../../hooks/databaseDataRetreival";
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

type StoredPlayerData = {
    playerId: string;
    sala: string;
};

type Player = {
    id: string;
    name: string;
    avatar: string;
};

const dummyPlayerData = {
	playerId: "9230-gudewvidfw",
	sala: "pablotest45"
}

const ShowVotes = () => {

	const [players, setPlayers] = useState<any[]>([]);
	const { turnid } = useParams();
	const turnIdNumber = parseInt(turnid as string, 10);
	const router = useRouter();

	const [playerData, setPlayerData] = useState<StoredPlayerData | null>(null);
    const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);

	
	useEffect(() => {
        // Recuperar les dades del jugador des de localStorage
        const storedData = localStorage.getItem('GarabatoTest');
        if (storedData) {
            setPlayerData(JSON.parse(storedData));
        } else {
			setPlayerData(dummyPlayerData)
		}
    }, []);

    useEffect(() => {
        if (playerData) {
            const playersCollectionRef = collection(db, 'grabatoTest', playerData.sala, 'players');
            getDocs(playersCollectionRef).then(snapshot => {
                const players: Player[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    avatar: doc.data().avatar
                }));
                setOtherPlayers(players);
            });
        }
    }, [playerData]);

	return (
		<div className="flex flex-col justify-center items-center">
			<h1>Votes</h1>
			<ul className="m-5">
				<li className="m-3">guess 1 :: 1 :: jugador1 :: autor </li>
				<li className="m-3">guess 2 :: 2 :: jugador2 :: autor </li>
				{/* <li>guess 3 :: 0 :: :: autor </li>
                <li>guess 4 :: 0 ::  :: autor </li>
                <li>guess 5 :: 1 :: jugador4 :: autor </li> */}
			</ul>
		</div>
	);
};

export default ShowVotes;

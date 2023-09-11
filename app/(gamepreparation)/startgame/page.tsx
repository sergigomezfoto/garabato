
'use client'
import { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
type StoredPlayerData = {
    playerId: string;
    sala: string;
};

type Player = {
    id: string;
    name: string;
    avatar: string;
};

const StartGame = () => {
    const [playerData, setPlayerData] = useState<StoredPlayerData | null>(null);
    const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);

    useEffect(() => {
        // Recuperar les dades del jugador des de localStorage
        const storedData = localStorage.getItem('GarabatoTest');
        if (storedData) {
            setPlayerData(JSON.parse(storedData));
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
            {playerData && (
                <>
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Benvingut al joc!</h2>
                        <p>El teu ID és: <strong>{playerData.playerId}</strong></p>

                        {/* Mostra les dades del jugador actual basant-nos en l'ID del jugador */}
                        {otherPlayers.filter(player => player.id === playerData.playerId).map(player => (
                            <div key={player.id} className="text-center my-4">
                                <div className="flex justify-center mb-4">
                                    <img src={player.avatar} alt={player.name} className="rounded-full w-32 h-32" />
                                </div>
                                <p>Tu ets el jugador: <strong>{player.name}</strong></p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-center">Altres Jugadors</h2>

                    <div className="flex flex-wrap justify-center gap-4">
                        {/* Exclou el jugador actual de la llista d'altres jugadors */}
                        {otherPlayers.filter(player => player.id !== playerData.playerId).map(player => (
                            <div key={player.id} className="flex flex-col items-center space-y-2">
                                <img src={player.avatar} alt={player.name} className="rounded-full w-16 h-16" />
                                <span className="text-sm">{player.id}</span>
                                <span className="text-lg">{player.name}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
export default StartGame;
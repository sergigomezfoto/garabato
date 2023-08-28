"use client"

import { useEffect } from "react";

function generateShortID(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from({ length: 5 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
  }

export default function RoomID() {
    const id = generateShortID()
    useEffect(() => {
        localStorage.setItem('roomID', id );
    },[])

    return (<strong>{id}</strong>)
}

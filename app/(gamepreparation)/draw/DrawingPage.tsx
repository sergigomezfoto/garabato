"use client"

import DrawingCanvas from "../../../components/DrawingCanvas";

const getDraw = (jugador: any) => {
    jugador = "";
}

const DrawingPage = (props:any) => {
    return (
        <div className="flex flex-col items-center h-screen">
            <h1 className="text-4xl my-6">Your word is: <strong>{props.word}</strong></h1>
            <DrawingCanvas onGetImage={getDraw} />
            <i className="my-10">Please, draw for the rest of the players can guess your phrase.</i>
        </div>
    );
}

export default DrawingPage;
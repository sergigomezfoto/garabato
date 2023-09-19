"use client";


import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useState,useEffect } from 'react';


interface DrawingCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
}
//TODO POSAR 2 COLORS NOMÉS AL DEL DIBUIX, I COLOR ANDOM POTSER AL DE L'USUARI.
/**
 * The below code is a TypeScript React component called DrawingCanvas that renders a canvas element
 * to draw with one color with your finger or mouse, with a hack to work around a Firefox bug.
 * @param  - - `canvasRef`: A reference to the ReactSketchCanvas component, which allows you to access
 * and manipulate the canvas programmatically.
 * @returns The component is returning a `ReactSketchCanvas` component with the specified props.
 */
const DrawingCanvas: React.FC<DrawingCanvasProps> = ({  canvasRef }) => {
  const [strokeColor, setStrokeColor] = useState('black');
  useEffect(() => {
    // Hack to work around Firfox bug in react-sketch-canvas
    // https://github.com/vinothpandian/react-sketch-canvas/issues/54
    document
      .querySelector("#react-sketch-canvas__stroke-group-0")
      ?.removeAttribute("mask");
      console.log("canvasRef", canvasRef);
      
  }, []);


  return (
//HACK A ELS TIPUS DE REACTSKETCHCANVAS HEIGHT DEMANA UN STRING PERÒ "100%" NO FUNCIONA NOMÉS FUNCIONA POSAR QUALSEVOL NÚMERO AL PROP HEIGHT. TYOUS CAMBIAT A streing|number
      // @ts-ignore <- Esto elimina el error de typescript con el tipo de height

      // <ReactSketchCanvas ref={canvasRef} strokeColor="black" strokeWidth={5} width='100%' height="100%" className='div-canvas' /> 
      // <div className="relative">
      
      <ReactSketchCanvas 
        ref={canvasRef} 
        strokeColor={strokeColor} 
        strokeWidth={5} 
        width='100%' 
        height="100%" 
        className='div-canvas' 
      />

    //   <div className="absolute top-0 right-0 space-x-2">
    //     <button 
    //       className="w-8 h-8 bg-red-500" 
    //       onClick={() => setStrokeColor('red')} 
    //     ></button>
    //     <button 
    //       className="w-8 h-8 bg-blue-500" 
    //       onClick={() => setStrokeColor('blue')} 
    //     ></button>
    //   </div>
    // </div>

  );
};
export default DrawingCanvas;

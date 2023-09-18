"use client";


import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useEffect } from 'react';
interface DrawingCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({  canvasRef }) => {

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
      <ReactSketchCanvas ref={canvasRef} strokeColor="black" strokeWidth={5} height="100%" width="100%" className="flex-grow mb-4" />

  );
};
export default DrawingCanvas;

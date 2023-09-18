"use client";


import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useEffect } from 'react';
interface DrawingCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
}

/**
 * The below code is a TypeScript React component called DrawingCanvas that renders a canvas element
 * to draw with one color with your finger or mouse, with a hack to work around a Firefox bug.
 * @param  - - `canvasRef`: A reference to the ReactSketchCanvas component, which allows you to access
 * and manipulate the canvas programmatically.
 * @returns The component is returning a `ReactSketchCanvas` component with the specified props.
 */
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
      // @ts-ignore <- Esto elimina el error de typescript con el tipo de height
      <ReactSketchCanvas ref={canvasRef} strokeColor="black" strokeWidth={5} height="100%" width="100%" className="flex-grow mb-4" /> 

  );
};
export default DrawingCanvas;

"use client";


import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useState,useEffect } from 'react';


interface DrawingCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
  onChange?: () => void;
}
//TODO POSAR 2 COLORS NOMÉS AL DEL DIBUIX, I COLOR ANDOM POTSER AL DE L'USUARI.

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({  canvasRef , onChange = () => {} }) => {
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

      
      <ReactSketchCanvas 
        onChange={onChange}
        ref={canvasRef} 
        strokeColor={strokeColor} 
        strokeWidth={5} 
        width='100%' 
        height="100%" 
        className='div-canvas' 
        
      />

  );
};
export default DrawingCanvas;

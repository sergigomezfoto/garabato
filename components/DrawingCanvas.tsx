"use client";


import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useState,useEffect } from 'react';


interface DrawingCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
  onChange?: () => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({  canvasRef ,onChange = () => {}}) => {
  const [strokeColor, setStrokeColor] = useState('black');
  const [numInteraction, setNumInteraction] = useState(0);
  console.log("canvasRef");
  
  useEffect(() => {
    // Hack to work around Firfox bug in react-sketch-canvas
    // https://github.com/vinothpandian/react-sketch-canvas/issues/54
    document
      .querySelector("#react-sketch-canvas__stroke-group-0")
      ?.removeAttribute("mask");
      console.log("canvasRef", canvasRef);
      
  }, []);

  const handleonChange = () => {
    
    if(numInteraction < 2){
      onChange();
      setNumInteraction(prev => prev + 1);
    }
  };

  return (
//HACK A ELS TIPUS DE REACTSKETCHCANVAS HEIGHT DEMANA UN STRING PERÒ "100%" NO FUNCIONA NOMÉS FUNCIONA POSAR QUALSEVOL NÚMERO AL PROP HEIGHT. TYOUS CAMBIAT A streing|number
      // @ts-ignore <- Esto elimina el error de typescript con el tipo de height

      // <ReactSketchCanvas ref={canvasRef} strokeColor="black" strokeWidth={5} width='100%' height="100%" className='div-canvas' /> 
      // <div className="relative">
      
      <ReactSketchCanvas 
        ref={canvasRef} 
        onChange={handleonChange}
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

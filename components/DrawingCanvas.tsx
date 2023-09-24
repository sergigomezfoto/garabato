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
      console.log("hack per firefox");
      
  }, []);

  const handleonChange = () => {
    
    if(numInteraction < 2){
      onChange();
      setNumInteraction(prev => prev + 1);
    }
  };

  return (

      
      <ReactSketchCanvas 
        ref={canvasRef} 
        onChange={handleonChange}
        strokeColor={strokeColor} 
        strokeWidth={5} 
        width='100%' 
        height="100%" 
        className='div-canvas' 
      />
  );
};
export default DrawingCanvas;

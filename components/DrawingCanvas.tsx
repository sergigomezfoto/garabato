"use client";


import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useState,useEffect } from 'react';
import { randomInt } from 'crypto';
import randomCanvasColors from '@/app/helpers/randomCanvasColors';


interface DrawingCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
  onChange?: () => void;
}
const DrawingCanvas: React.FC<DrawingCanvasProps> = ({  canvasRef ,onChange = () => {}}) => {
  const [colors, setColors] = useState(() => randomCanvasColors()); // Es genera una vegada a l'iniciar el component
  const [strokeColor, setStrokeColor] = useState(colors[0]);
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
    <div className="relative flex-grow w-full max-w-[500px] mb-4 mt-4">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <div
          className="w-5 h-5 rounded-full cursor-pointer"
          style={{ backgroundColor: colors[0] }}
          onClick={() => setStrokeColor(colors[0])}
        ></div>
        <div
          className="w-5 h-5 rounded-full cursor-pointer"
          style={{ backgroundColor: colors[1] }}
          onClick={() => setStrokeColor(colors[1])}
        ></div>
      </div>
      
      <ReactSketchCanvas 
        ref={canvasRef} 
        onChange={numInteraction < 2 ? handleonChange : undefined} // deixar de fer el onChange a la de 2 que ja no es necessita
        strokeColor={strokeColor} 
        strokeWidth={5} 
        width='100%' 
        height="100%" 
        className='div-canvas' 
      />

    </div>
  );
};
export default DrawingCanvas;

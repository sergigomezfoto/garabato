"use client";


import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
interface DrawingCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({  canvasRef }) => {
  return (
    <div>
      <ReactSketchCanvas ref={canvasRef} strokeColor="black" strokeWidth={5} />
    </div>
  );
};
export default DrawingCanvas;

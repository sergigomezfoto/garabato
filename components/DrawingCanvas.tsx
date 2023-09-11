"use client";
import React, { useRef } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';

interface DrawingCanvasProps {
  onGetImage: (data: string) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onGetImage }) => {
	const canvasRef = useRef<ReactSketchCanvasRef | null>(null);

  const handleExport = () => {
    canvasRef.current!
      .exportImage('png')
      .then(data => {
        onGetImage(data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      <ReactSketchCanvas ref={canvasRef} strokeColor="black" strokeWidth={5} />
      <button onClick={handleExport}>Save Portrait</button>
    </div>
  );
};

export default DrawingCanvas;

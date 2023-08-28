"use client"
import React, { useState, useEffect } from 'react';
import {ReactSketchCanvas} from 'react-sketch-canvas';

export default function DrawingCanvas() {
  const [width, setWidth] = useState("30%");
  const [height, setHeight] = useState("40%");

  //Effect to handle windows resize, prob not needed for mobile
  /* useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); */

  return (
    <ReactSketchCanvas
      width={`{width}`}
      height={`{height}`}
      strokeWidth={5}
      strokeColor='red'
    />
  );
}

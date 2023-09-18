

// components/LoadingText.tsx

import React from 'react';

interface LoadingTextProps {
  text: string;
}

const LoadingText: React.FC<LoadingTextProps> = ({ text }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center space-y-2">
        <div className="loader"></div>
        <p className="text-white font-bold">{text}</p>
      </div>
    </div>
  );
};

export default LoadingText;
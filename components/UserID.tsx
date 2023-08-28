"use client"
import { useState, useEffect } from 'react';
import crypto from 'crypto';
import DrawingCanvas from './DrawingCanvas';

export default function UserID() {
  const [userName, setUserName] = useState('');
  const [secureID, setSecureID] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedSecureID = localStorage.getItem('secureID');
    if (storedName && storedSecureID) {
      setUserName(storedName);
      setSecureID(storedSecureID);
    }
  }, []);

  useEffect(() => {
    if (userName) {
      // Create a unique salt
      const salt = crypto.randomBytes(16).toString('hex');

      // Hash the username with the salt
      const hash = crypto.pbkdf2Sync(userName, salt, 1000, 64, 'sha512').toString('hex');

      // Store them securely (well, as securely as client-side allows)
      localStorage.setItem('userName', userName);
      localStorage.setItem('secureID', hash);
      setSecureID(hash);
    }
  }, [userName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  return (
    <div>
      <input 
        type="text" 
        value={userName} 
        onChange={handleChange} 
        placeholder="Enter your username"
      />
      {/* Debug: Show the secure ID (you'd normally not show this) */}
      <p>Your secure ID is: {secureID}</p>
      <h2>Draw yourself:</h2>
      <DrawingCanvas/>
    </div>
  );
}

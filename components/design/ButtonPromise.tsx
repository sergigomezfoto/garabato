import React, { useState } from 'react';

export interface ButtonPromiseProps {
    color?: string;
    text?: string;
    type?: 'submit' | 'button' | 'reset';
    onClick: () => Promise<any>;
    children?: React.ReactNode;
}

const ButtonPromise: React.FC<ButtonPromiseProps> = ({ color = 'blue', text, type, onClick, children }) => {
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleClick = async () => {
        if (state !== 'loading') {
            setState('loading');
            try {
                await onClick();
                setState('success');
            } catch (e) {
                setState('error');
                setTimeout(() => setState('idle'), 2000);
            }
        }
    };

    let displayText;
    let bgColor;
    switch (state) {
        case 'loading':
            displayText = (<span className="spinner" />); // Reemplaça amb el teu spinner blanc
            bgColor = `bg-${color}-500 hover:bg-${color}-700`;
            break;
        case 'success':
            displayText = "¡Hecho!";
            bgColor = "bg-green-500";
            break;
        case 'error':
            displayText = "¡Error!";
            bgColor = "bg-red-500";
            break;
        default:
            displayText = children ? children : text;
            bgColor = `bg-${color}-500 hover:bg-${color}-700`;
            break;
    }

    const baseClass = `${bgColor} text-white font-bold py-2 px-4 rounded m-2`;

    return (
        <button 
            type={type}
            className={baseClass} 
            onClick={handleClick}
            disabled={state === 'loading' || state === 'success'}
        >
            {displayText}
        </button>
    );
};

export default ButtonPromise;

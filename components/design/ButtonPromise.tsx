import React, { useState } from 'react';

export interface ButtonPromiseProps {
    color?: string;
    text?: string;
    type?: 'submit' | 'button' | 'reset';
    onClick: () => Promise<any>;
    children?: React.ReactNode;
    isDisabled?: boolean;
}

const ButtonPromise: React.FC<ButtonPromiseProps> = ({ color = 'blue', text, type, onClick, children, isDisabled = false }) => {
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleClick = async () => {
        if (state !== 'loading' && !isDisabled) {
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

    let displaySpinner = false;
    let bgColor;
    let textContent = children ? children : text;
    switch (state) {
        case 'loading':
            displaySpinner = true;
            bgColor = `bg-${color}-500 hover:bg-${color}-700`;
            break;
        case 'success':
            textContent = "¡Hecho!";
            bgColor = "bg-green-500";
            break;
        case 'error':
            textContent = "¡Error!";
            bgColor = "bg-red-500";
            break;
        default:
            bgColor = isDisabled ? 'bg-gray-300 cursor-not-allowed' : `bg-${color}-500 hover:bg-${color}-700`;
            break;
    }
    const baseClass = `flex items-center justify-center ${bgColor} text-white font-bold py-2 px-4 rounded m-2`;


    return (
        <button
            type={type}
            className={baseClass}
            onClick={handleClick}
            disabled={state === 'loading' || state === 'success' || isDisabled}
        >
            <span className={`button-text ${displaySpinner ? 'hidden-button' : ''}`}>{textContent}</span>
            {displaySpinner && <span className="button-spinner"></span>}
        </button>
    );
};

export default ButtonPromise;
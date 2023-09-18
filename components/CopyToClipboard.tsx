import React, { useState } from 'react';

interface CopyToClipboardProps {
    textToCopy: string;
    className?: string;
}

/**
 * This is a React component that allows users to copy text to the clipboard and displays a message
 * when the text is successfully copied.
 * @param  - - `textToCopy`: The text that will be copied to the clipboard when the button is clicked.
 * @returns The component is returning a button element with an onClick event handler that calls the
 * handleCopyClick function. The button has a className prop that is used for styling. Inside the
 * button, there is an icon element from the Font Awesome library and the text "Copia y envia".
 */
const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ textToCopy, className }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Amaga el missatge després de 2 segons
        } catch (err) {
            console.error('Error al copiar el text: ', err);
        }
    };

    return (
        <>
            <button onClick={handleCopyClick} className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                <i className="fas fa-copy"></i> Copia y envia
            </button>
            {isCopied && <span className="ml-2 text-green-500">¡Copiado!</span>}
        </>

    );
}

export default CopyToClipboard;
import React, { useState } from 'react';

interface CopyToClipboardProps {
    textToCopy: string;
    className?: string;
}

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
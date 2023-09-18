
interface SendRoomWhatsappProps {
    url: string;
    className?: string;
}

/**
 * This is a TypeScript React component that renders a button to share a URL on WhatsApp.
 * @param  - - `url`: The URL that will be shared on WhatsApp.
 * @returns The code is returning a button component with an onClick event handler that calls the
 * shareOnWhatsApp function. The button has a class name for styling and displays an icon and text.
 */
const SendRoomWhatsapp: React.FC<SendRoomWhatsappProps> = ({ url }) => {


    const shareOnWhatsApp = () => {
        const message = `Juega a Garabato en:\n\n${url}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <button onClick={shareOnWhatsApp} className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">
           <i className="fab fa-whatsapp"></i> Comparte
        </button>
    );
}

export default SendRoomWhatsapp;

interface SendRoomWhatsappProps {
    url: string;
    className?: string;
}
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
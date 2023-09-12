import { useRouter } from 'next/navigation';
interface SendRoomWhatsappProps {
    url: string;
}
const SendRoomWhatsapp: React.FC<SendRoomWhatsappProps> = ({ url }) => {
    const router = useRouter();

    const shareOnWhatsApp = () => {
        const message = `Check out this amazing website: ${url}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

        router.push(whatsappUrl);
    };

    return (
        <button onClick={shareOnWhatsApp}>
            Share on WhatsApp
        </button>
    );
}

export default SendRoomWhatsapp;
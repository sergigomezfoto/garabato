

export interface ButtonProps {
    color?: string;
    text?: string;
    type?: 'submit' | 'button' | 'reset';
    onClick?: () => void;
    children?: React.ReactNode;
}
const Button = ({ color = 'blue', text = 'soc un botó', type, onClick, children }: ButtonProps) => {
    const baseClass = `bg-${color}-500 hover:bg-${color}-700 text-white font-bold py-2 px-4 rounded m-2`;

    // Si es proporcionen `children`, s'utilitzen; sinó, s'utilitza el text.
    const content = children ? children : text;

    return <button type={type} onClick={onClick} className={baseClass}>{content}</button>;
};

export default Button;





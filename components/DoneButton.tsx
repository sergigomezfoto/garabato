interface DoneButtonProps {
	text: string;
	hexCode: string;
}

export const DoneButtonStructure: React.FC<DoneButtonProps> = ({
	text,
	hexCode,
}) => {
	return (
		<button
			className="rounded-full shadow-lg px-1 py-0.5"
			style={{ backgroundColor: hexCode }}
		>
			{text}
		</button>
	);
};

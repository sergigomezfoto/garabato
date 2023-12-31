import React from "react";

const ProgressBar: React.FC<{ totalPlayers: number; playersReady: number; text: string }> = ({
	totalPlayers,
	playersReady,
	text,
}) => {
	// Calculate the percentage of players ready
	const percentage = (playersReady / totalPlayers) * 100;

	return (
		<div className="flex flex-col items-center space-y-2">
			<h1>{text}</h1>
			<div className="w-full bg-gray-300 rounded-lg p-1 relative">
				<div
					className="h-6 bg-pink-300 text-black font-bold transition-width duration-500 ease-in-out"
					style={{ width: `${percentage}%` }}
				>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
						{percentage.toFixed(2)}%
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProgressBar;

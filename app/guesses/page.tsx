import RootLayout from "../layout";

const DrawingGuesses = () => {
	return (
		<RootLayout>
			<div className="flex flex-col justify-center items-center">
				<h1>Guesses</h1>
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU"
					alt="dibujo"
					className="m-5"
				/>
				<button className="m-3">Guess 1</button>
				<button className="m-3">Guess 2</button>
				{/* <button>Guess 3</button>
            <button>Guess 4</button>
            <button>Guess 5</button> */}
			</div>
		</RootLayout>
	);
};

export default DrawingGuesses;

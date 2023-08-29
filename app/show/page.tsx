import RootLayout from "../layout";

const ShowDrawing = () => {
	return (
		<RootLayout>
			<div className="flex flex-col justify-center items-center">
				<h1>Dibujo</h1>
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU"
					alt="dibujo"
					className="m-5"
				/>
				<form>
					<input className="m-3" type="text" placeholder="Adivina el dibujo" />
					<button className="m-3" type="submit">
						Enviar
					</button>
				</form>
			</div>
		</RootLayout>
	);
};

export default ShowDrawing;

import RootLayout from "../layout";

const ShowDrawing = () => {
	return (
		<RootLayout>
			<div>
				<h1>Dibujo</h1>
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU"
					alt="dibujo"
				/>
				<form>
					<input type="text" placeholder="Adivina el dibujo" />
					<button type="submit">Enviar</button>
				</form>
			</div>
		</RootLayout>
	);
};

export default ShowDrawing;

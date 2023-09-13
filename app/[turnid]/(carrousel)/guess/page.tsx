import { DoneButtonStructure } from "@/components/DoneButton";

const ShowDrawing = () => {
	//This variables will be obtained from DB
	const user = "Uri";
	const image =
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdJElDmsk5euD5idRSZMgBHYSPkI0ECTH8OmEm93E4PFQN5ZcLUuuDwedKrqpIYLTaE0&usqp=CAU";

	return (
		<div className="flex flex-col justify-center items-center">
			<h1>Este es el dibujo de {user}.</h1>
			<img src={image} alt="Dibujo" className="m-5" />
			<h1>Descríbelo con pocas palabras.</h1>
			<form>
				<input className="m-3" type="text" placeholder="" />
				<DoneButtonStructure text="¡Hecho!" hexCode="#FFB6C1" />
			</form>
		</div>
	);
};

export default ShowDrawing;

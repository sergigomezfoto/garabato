import RootLayout from "../layout";

const ShowVotes = () => {
	return (
		<RootLayout>
			<div className="flex flex-col justify-center items-center">
				<h1>Votes</h1>
				<ul className="m-5">
					<li className="m-3">guess 1 :: 1 :: jugador1 :: autor </li>
					<li className="m-3">guess 2 :: 2 :: jugador2 :: autor </li>
					{/* <li>guess 3 :: 0 :: :: autor </li>
                <li>guess 4 :: 0 ::  :: autor </li>
                <li>guess 5 :: 1 :: jugador4 :: autor </li> */}
				</ul>
			</div>
		</RootLayout>
	);
};

export default ShowVotes;

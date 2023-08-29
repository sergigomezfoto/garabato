import RootLayout from "../layout";

const ShowVotes = () => {
	return (
		<RootLayout>
			<div>
				<h1>Votes</h1>
				<ul>
					<li>guess 1 :: 1 :: jugador1 :: autor </li>
					<li>guess 2 :: 2 :: jugador2 :: autor </li>
					{/* <li>guess 3 :: 0 :: :: autor </li>
                <li>guess 4 :: 0 ::  :: autor </li>
                <li>guess 5 :: 1 :: jugador4 :: autor </li> */}
				</ul>
			</div>
		</RootLayout>
	);
};

export default ShowVotes;

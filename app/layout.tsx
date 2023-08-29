import "./globals.css";
import { Cabin_Sketch } from "next/font/google";

const cabinSketch = Cabin_Sketch({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html className={cabinSketch.className}>
			<body className="flex flex-col place-items-center">
				<header className="text-8xl m-5 ">Garabato</header>

				{children}

				<footer className="text-xl m-5 flex flex-col place-items-center">
					<p>Sergi Gómez, Pablo Mena, Celeste Ortiz & Oriol Rocabert</p>
					<a href="https://github.com/sergigomezfoto/garabato" target="_blank">
						<img src="/gh.png" className="w-7" />
					</a>
				</footer>
			</body>
		</html>
	);
}

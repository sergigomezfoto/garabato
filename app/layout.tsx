import "./globals.css";
import { Inter, Cabin_Sketch } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
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

				<footer className="text-xl m-5">
					Sergi Gómez, Pablo Mena, Celeste Ortiz & Oriol Rocabert
				</footer>
			</body>
		</html>
	);
}

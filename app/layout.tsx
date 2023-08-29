import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html className={inter.className}>
			<body className="flex flex-col place-items-center">
				<header className="text-8xl m-5">Garabato</header>

				{children}

				<footer>Sergi Gómez, Pablo Mena, Celeste Ortiz & Oriol Rocabert</footer>
			</body>
		</html>
	);
}

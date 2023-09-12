import Head from "next/head";
import "./globals.css";
import { Cabin_Sketch } from "next/font/google";
import type { Metadata } from 'next'
const cabinSketch = Cabin_Sketch({ weight: "400", subsets: ["latin"] });
export const metadata: Metadata = {
	title: 'Garabato',
	description: 'The drawing game',
	viewport: {
		width: 'device-width',
		initialScale: 1,
		maximumScale: 1,
	  },

  }
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (<>
		<html lang="en" className={cabinSketch.className}>
		<head>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
		</head>
			<body >
				<header className="text-6xl md:text-8xl p-5 text-center">Garabato</header>
				<div className="flex flex-col items-center justify-center flex-grow">
					{children}
				</div>
				<footer className="text-sm text-center ">
					<a href="https://github.com/sergigomezfoto/garabato" target="_blank" title="Garabato GitHub repository">
						<i className="fab fa-github fa-lg"></i>
					</a>
					<p>Sergi Gómez, Pablo Mena, Celeste Ortiz & Oriol Rocabert</p>
				</footer>
			</body>
		</html>
	</>
	);
}

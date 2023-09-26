import "./globals.css";
import { Cabin_Sketch } from "next/font/google";
import type { Metadata } from "next";
const cabinSketch = Cabin_Sketch({ weight: "400", subsets: ["latin"] });
export const metadata: Metadata = {
	title: "Garabato",
	description: "The drawing game",
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 1,
	},
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<html lang="en" className={cabinSketch.className}>
				<head>
					<link
						rel="stylesheet"
						href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
					/>
				</head>
				<body>
					<div className="wrapper">
						<header>
							Garabato
							{/*<BackgroundMusic audioFile="/DoodleFitSongShort.mp3" />*/}
						</header>

						<main>
							<div className="content-wrapper">{children}</div>
						</main>

						<footer>
							<p>Sergi, Pablo, Celeste & Oriol</p>
							<a
								href="https://github.com/sergigomezfoto/garabato"
								target="_blank"
								title="Garabato GitHub repository"
							>
								<img src="/gh.png" className="git" alt="git" />
							</a>
						</footer>
					</div>
				</body>
			</html>
		</>
	);
}

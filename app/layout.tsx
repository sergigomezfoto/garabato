import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<html lang="en">
				<header>Header</header>
				<body className={inter.className}>{children}</body>
				<footer>Footer</footer>
			</html>
		</>
	);
}

"use client";

import Timer from "@/components/notused/Timer";
import { usePathname, useRouter, useParams } from "next/navigation";

interface CarrouselLayoutProps {
	children: React.ReactNode;
	pageTimeout?: number;
}

const CarrouselLayout = ({ children }: CarrouselLayoutProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const { turnid } = useParams();
	const turnidNumber = parseInt(turnid as string, 10);
	const consoleLog = () => {
		router.push("/");
		console.log("carrousel ends");
	};

	return (
		<div>
			{children}
			{/*	<Timer
				turnid={turnidNumber}
				currentRoute={pathname}
				loopCount={3}
				onEnd={consoleLog}
	/> */}
		</div>
	);
};

export default CarrouselLayout;

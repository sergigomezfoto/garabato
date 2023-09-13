"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Countdown from "./Countdown";

interface TimerProps {
	turnid: number;
	currentRoute: string;
	loopCount?: number;
	onEnd?: () => void;
}

const Timer: React.FC<TimerProps> = ({
	turnid,
	currentRoute,
	loopCount = 1,
	onEnd,
}) => {
	const router = useRouter();

	const lastCarrousel = [
		{ route: `/${turnid}/guess`, timeout: 3000 },
		{ route: `/${turnid}/vote`, timeout: 3000 },
		{ route: `/${turnid}/results`, timeout: 3000 },
	];

	const [state, setState] = useState({
		currentRouteIndex: lastCarrousel.findIndex(
			(route) => route.route === currentRoute
		),
		secondsLeft:
			lastCarrousel[
				lastCarrousel.findIndex((route) => route.route === currentRoute)
			].timeout / 1000,
		completedLoops: 0,
	});
	const hasCalledOnEnd = useRef(false);

	const navigateToNextRoute = () => {
		const nextRouteIndex = (state.currentRouteIndex + 1) % lastCarrousel.length;
		const nextRoute = lastCarrousel[nextRouteIndex];
		router.push(nextRoute.route);
		setState((prev) => ({
			...prev,
			currentRouteIndex: nextRouteIndex,
			secondsLeft: nextRoute.timeout / 1000,
		}));
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (state.secondsLeft > 1) {
				setState((prev) => ({ ...prev, secondsLeft: prev.secondsLeft - 1 }));
			} else {
				if (
					state.completedLoops + 1 < loopCount ||
					state.currentRouteIndex + 1 < lastCarrousel.length
				) {
					navigateToNextRoute();
				} else if (!hasCalledOnEnd.current && onEnd) {
					onEnd();
					hasCalledOnEnd.current = true;
				}
				if (state.currentRouteIndex + 1 >= lastCarrousel.length) {
					setState((prev) => ({
						...prev,
						completedLoops: prev.completedLoops + 1,
					}));
				}
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [state]);

	return (
		<div>
			<Countdown seconds={state.secondsLeft} />
		</div>
	);
};

export default Timer;

'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Countdown from './Countdown';

const lastCarrousel = [
    { route: '/show', timeout: 2000 },
    { route: '/guesses', timeout: 6000 },
    { route: '/votes', timeout: 3000 },
];

interface TimerProps {
    currentRoute: string;
    loopCount?: number;
    onEnd?: () => void;
}

const Timer: React.FC<TimerProps> = ({ currentRoute, loopCount = 1, onEnd }) => {
    const router = useRouter();
    const [state, setState] = useState({
        currentRouteIndex: lastCarrousel.findIndex((route) => route.route === currentRoute),
        secondsLeft: lastCarrousel[lastCarrousel.findIndex((route) => route.route === currentRoute)].timeout / 1000,
        completedLoops: 0
    });
    const hasCalledOnEnd = useRef(false);

    const navigateToNextRoute = () => {
        const nextRouteIndex = (state.currentRouteIndex + 1) % lastCarrousel.length;
        const nextRoute = lastCarrousel[nextRouteIndex];
        router.push(nextRoute.route);
        setState(prev => ({
            ...prev,
            currentRouteIndex: nextRouteIndex,
            secondsLeft: nextRoute.timeout / 1000
        }));
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (state.secondsLeft > 1) {
                setState(prev => ({ ...prev, secondsLeft: prev.secondsLeft - 1 }));
            } else {
                if (state.completedLoops + 1 < loopCount || (state.currentRouteIndex + 1 < lastCarrousel.length)) {
                    navigateToNextRoute();
                } else if (!hasCalledOnEnd.current && onEnd) {
                    onEnd();
                    hasCalledOnEnd.current = true;
                }
                if (state.currentRouteIndex + 1 >= lastCarrousel.length) {
                    setState(prev => ({ ...prev, completedLoops: prev.completedLoops + 1 }));
                }
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [state]);

    return <div><Countdown seconds={state.secondsLeft}/></div>;
};




export default Timer;

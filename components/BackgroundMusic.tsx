"use client";

import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

type BackgroundMusicProps = {
	audioFile: string;
};

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ audioFile }) => {
	const [isMuted, setIsMuted] = useState(true);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (audioRef.current) {
			if (isMuted) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
		}
	}, [isMuted]);

	const toggleMute = () => {
		setIsMuted(!isMuted);
	};

	return (
		<div className="music-control">
			<audio ref={audioRef} src={audioFile} loop muted={isMuted} />
			<button className="mute-button" onClick={toggleMute}>
				<FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
			</button>
			{/* <p>{`muuuuteds${isMuted}`}</p> */}
		</div>
	);
};

export default BackgroundMusic;

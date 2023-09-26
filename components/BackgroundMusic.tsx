"use client";

import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

type BackgroundMusicProps = {
	audioFile: string;
};

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ audioFile }) => {
	const [isMuted, setIsMuted] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const toggleMute = () => {
		if (audioRef.current) {
			audioRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	return (
		<div className="music-control">
			<audio
				ref={audioRef}
				src={audioFile}
				loop
				autoPlay={!isMuted}
				muted={isMuted}
			/>
			<button className="mute-button" onClick={toggleMute}>
				<FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
			</button>
		</div>
	);
};

export default BackgroundMusic;

import { useRef, useEffect } from 'react';

/**
 * A reusable hook for handling audio playback.
 *
 * @param {string} audioSrc - The source URL of the audio file.
 */
const useAudio = (audioSrc) => {
	const audioRef = useRef(new Audio(audioSrc));

	// Set initial volume or other audio properties
	useEffect(() => {
		audioRef.current.volume = 0.8; // Example: Reduce volume to avoid peaking

		return () => {
			audioRef.current.pause();
			audioRef.current.currentTime = 0; // Reset audio position
		};
	}, []);

	/**
	 * Plays the audio from the start.
	 */
	const play = () => {
		audioRef.current.pause();
		audioRef.current.currentTime = 0; // Ensure audio starts from the beginning
		audioRef.current.play().catch((error) => console.error('Error playing sound:', error));
	};

	/**
	 * Stops the audio playback and resets its position.
	 */
	const stop = () => {
		audioRef.current.pause();
		audioRef.current.currentTime = 0;
	};

	return { play, stop };
};

export default useAudio;

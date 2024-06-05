// src/middleware/audioMiddleware.js
const iosDarkNoise = '/IOS Dark Noise Background sound 1 Hour.mp3'; // Ensure this path is correct
const backgroundAudio = new Audio(iosDarkNoise);
backgroundAudio.loop = true;

const audioMiddleware = (store) => {
	return (next) => (action) => {
		const prevState = store.getState().timer;
		const result = next(action); // This line updates the state
		const newState = store.getState().timer;

		// Handle playing or pausing the audio based on state changes
		if (!prevState.isActive && newState.isActive) {
			backgroundAudio.play();
		} else if (prevState.isActive && !newState.isActive) {
			backgroundAudio.pause();
		}

		return result;
	};
};

export default audioMiddleware;

// src/middleware/timerMiddleware.js
import { setSeconds, setIsActive, setIsOvertime, resetTimer, setDuration } from '../slices/timerSlice';

const timerMiddleware = (store) => {
	let intervalId = null;

	const startTimer = () => {
		if (!intervalId) {
			intervalId = setInterval(() => {
				const { seconds, isOvertime, duration } = store.getState().timer;

				console.log(isOvertime);

				if (seconds <= 0 && !isOvertime) {
					store.dispatch(setIsOvertime(true));
					store.dispatch(setDuration(duration + 1));
				} else {
					if (!isOvertime) {
						store.dispatch(setSeconds(seconds - 1));
					}

					store.dispatch(setDuration(duration + 1));
				}
			}, 1000);
		}
	};

	const stopTimer = () => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	};

	return (next) => (action) => {
		const prevState = store.getState().timer.isActive;
		const result = next(action);
		const newState = store.getState().timer.isActive;

		if (prevState !== newState) {
			if (newState) {
				startTimer();
			} else {
				stopTimer();
			}
		}

		return result;
	};
};

export default timerMiddleware;

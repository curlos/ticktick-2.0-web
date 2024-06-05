// src/middleware/timerMiddleware.js
import { setSeconds, setIsActive, setIsOvertime, resetTimer } from '../slices/timerSlice';

const timerMiddleware = (store) => {
	let intervalId = null;

	const startTimer = () => {
		if (!intervalId) {
			intervalId = setInterval(() => {
				const { seconds, isOvertime } = store.getState().timer;
				if (seconds <= 0 && !isOvertime) {
					store.dispatch(setIsOvertime(true));
				} else {
					store.dispatch(setSeconds(seconds - 1));
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

import { secondsToMinutes } from '../../../utils/helpers.utils';

export const getTopPositioningFromTime = (date) => {
	// Extract the hours and minutes
	const hours = date.getHours();
	const minutes = date.getMinutes();

	// Calculate top position: each hour block is 60px, and each minute is 1px
	const topPosition = hours * 60 + minutes;

	return topPosition;
};

export const getHeightValue = (focusRecord) => {
	let heightValue = 20;
	const { duration } = focusRecord;
	const durationInMinutes = secondsToMinutes(duration);

	if (durationInMinutes > 20) {
		heightValue = durationInMinutes;
	}

	return heightValue + 'px';
};

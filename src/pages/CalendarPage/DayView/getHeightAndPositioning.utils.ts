import { secondsToMinutes } from '../../../utils/helpers.utils';

export const getTopPositioningFromTime = (date, fromWeekView) => {
	// Extract the hours and minutes
	const hours = date.getHours();
	const minutes = date.getMinutes();

	// Calculate top position: each hour block is 60px, and each minute is 1px
	let topPosition = hours * 60 + minutes;

	if (fromWeekView) {
		topPosition *= 2;
	}

	return topPosition;
};

export const getHeightValue = (focusRecord, fromWeekView) => {
	let heightValue = fromWeekView ? 40 : 20;
	const { duration } = focusRecord;
	const durationInMinutes = secondsToMinutes(duration);

	if (durationInMinutes > 20) {
		heightValue = fromWeekView ? durationInMinutes * 2 : durationInMinutes;
	}

	return heightValue + 'px';
};

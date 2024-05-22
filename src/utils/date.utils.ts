export const isTodayUTC = (date) => {
	const today = new Date();
	const inputDate = new Date(date);

	// Convert both dates to UTC date strings and compare
	const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	const inputDateUTC = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

	return todayUTC === inputDateUTC;
};

export const isTomorrowUTC = (date) => {
	const today = new Date();
	const tomorrow = new Date();
	tomorrow.setUTCDate(today.getUTCDate() + 1); // Increment the day by 1

	const inputDate = new Date(date);
	const tomorrowUTC = Date.UTC(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
	const inputDateUTC = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

	return tomorrowUTC === inputDateUTC;
};

export const isInXDaysUTC = (date: Date | string | null, daysFromNow: number) => {
	const today = new Date();
	const xDaysFromNow = new Date();
	xDaysFromNow.setUTCDate(today.getUTCDate() + daysFromNow); // Increment the day by 7

	const inputDate = new Date(date);
	const xDaysFromNowUTC = Date.UTC(xDaysFromNow.getFullYear(), xDaysFromNow.getMonth(), xDaysFromNow.getDate());
	const inputDateUTC = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

	return xDaysFromNowUTC === inputDateUTC;
};

export const isWithinNext7DaysUTC = (date) => {
	const today = new Date();
	const nextWeek = new Date();
	nextWeek.setUTCDate(today.getUTCDate() + 7); // Set to 7 days from today

	const inputDate = new Date(date);
	const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	const nextWeekUTC = Date.UTC(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate());
	const inputDateUTC = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

	return inputDateUTC > todayUTC && inputDateUTC <= nextWeekUTC;
};

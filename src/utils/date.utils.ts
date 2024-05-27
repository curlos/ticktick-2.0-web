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

export const getTimesArray = () => {
	let timesArray = [];
	for (let hour = 0; hour < 24; hour++) {
		for (let min = 0; min < 60; min += 30) {
			let time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
			timesArray.push(time);
		}
	}
	return timesArray;
};

export const convertTimesToTimeZone = (timesArray, timeZone) => {
	return timesArray.map((time) => {
		let [hour, minute] = time.split(':');
		let date = new Date(
			Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), hour, minute)
		);
		let formatter = new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: timeZone,
			hour12: true,
		});
		return formatter.format(date);
	});
};

export const setTimeOnDateString = (dateString, timeString) => {
	// Parse the existing date string to get a Date object
	const date = new Date(dateString);

	// Function to check if the date is in DST for Eastern Time
	const isDST = (date) => {
		const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
		const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
		return date.getTimezoneOffset() < Math.max(jan, jul);
	};

	if (timeString) {
		// Extract hours and minutes from the time string (formatted as "HH:mm AM/PM")
		const [time, period] = timeString.split(' ');
		let [hours, minutes] = time.split(':');
		hours = parseInt(hours);
		minutes = parseInt(minutes);

		// Convert 12-hour format to 24-hour if necessary
		if (period === 'PM' && hours !== 12) {
			hours += 12;
		} else if (period === 'AM' && hours === 12) {
			hours = 0;
		}

		// Set the desired time on the existing date object
		date.setHours(hours, minutes, 0, 0);
	} else {
		// Determine if DST is in effect for the date
		const dstActive = isDST(date);
		const utcOffset = dstActive ? 4 : 5; // DST: UTC-4, otherwise UTC-5

		// Set time to 12:00 AM EST/EDT, adjusted for DST
		date.setUTCHours(0 + utcOffset, 0, 0, 0); // Sets to 12:00 AM EST
	}

	return date;
};

export const getCurrentTimeString = () => {
	const now = new Date();
	let hours = now.getHours();
	const minutes = now.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';

	// Convert hours from 24-hour time to 12-hour time
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'

	// Minutes should be two digits
	const minutesStr = minutes < 10 ? '0' + minutes : minutes;

	// Format the time in AM/PM notation
	return `${hours}:${minutesStr} ${ampm}`;
};

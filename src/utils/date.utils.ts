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

export const getFormattedTimeString = (inputDate) => {
	// Ensure inputDate is a valid Date object
	const date = inputDate instanceof Date ? inputDate : new Date();

	// Extract time components
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';

	// Convert hours from 24-hour time to 12-hour time
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'

	// Ensure minutes are two digits
	const minutesStr = minutes < 10 ? '0' + minutes : minutes;

	// Format the time in AM/PM notation
	return `${hours}:${minutesStr} ${ampm}`;
};

export const formatDateTime = (dateTimeStr) => {
	const date = new Date(dateTimeStr);

	// Extracting hours and minutes for the time without leading zeros
	const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
	const time = date.toLocaleTimeString('en-US', optionsTime);

	// Extracting the day and month for the date
	const optionsDate = { month: 'long', day: 'numeric' };
	const day = date.toLocaleDateString('en-US', optionsDate);

	return { time, day };
};

export const groupByEndTimeDay = (records) => {
	const grouped = {};

	records.forEach((record) => {
		// Extract the date part of the endTime
		const endTime = new Date(record.endTime);
		const day = endTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

		// Initialize the array if it does not already exist
		if (!grouped[day]) {
			grouped[day] = [];
		}

		// Push the current record into the correct day array
		grouped[day].push(record);
	});

	// Create an array from the grouped object and sort it by date
	const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
	const sortedGrouped = {};
	sortedKeys.forEach((key) => {
		sortedGrouped[key] = grouped[key];
	});

	return sortedGrouped;
};

export const getLast7Days = () => {
	let result = [];

	for (let i = 0; i < 7; i++) {
		const date = new Date(); // Get today's date
		date.setDate(date.getDate() - i); // Subtract `i` days from today
		result.push(date); // Format the date as "YYYY-MM-DD" and add to the result array
	}

	return result.reverse(); // Reverse the array to start from 7 days ago to today
};

export const getDayNameAbbreviation = (date) => {
	// Get the full name of the day in English
	const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
	// Return the first two letters
	return dayName.substring(0, 3);
};

export function areDatesEqual(date1: Date | null, date2: Date | null) {
	if (!date1 || !date2) {
		return false;
	}

	const datesEqual =
		date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear();

	return datesEqual;
}

export function areTimesEqual(time1: Date | null, time2: Date | null): boolean {
	if (!time1 || !time2) {
		return false;
	}

	return (
		time1.getHours() === time2.getHours() &&
		time1.getMinutes() === time2.getMinutes() &&
		time1.getSeconds() === time2.getSeconds()
	);
}

export const getMonthAndDay = (date) => {
	// Convert the date to a string with the format "Month day"
	return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

export const formatDateBasedOnYear = (inputDate) => {
	const currentDate = new Date(); // Get the current date
	const inputYear = inputDate.getFullYear(); // Extract the year from the input date
	const currentYear = currentDate.getFullYear(); // Extract the current year

	// Compare the input date's year with the current year
	if (inputYear < currentYear) {
		// If the input date is from a previous year, format it as "Month day, year"
		return inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	} else {
		// If the input date is from the current year, format it as "Month day"
		return inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
	}
};

export const formatCheckedInDayDate = (inputDate) => {
	return inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const getCalendarMonth = (year, month, weeksInCalendar = 6) => {
	const calendar = [];
	const firstDayOfMonth = new Date(year, month, 1);
	const currentDay = new Date(firstDayOfMonth);
	const dayOfWeek = currentDay.getDay();
	currentDay.setDate(currentDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

	for (let week = 0; week < weeksInCalendar; week++) {
		const days = [];
		for (let i = 0; i < 7; i++) {
			// 7 days per week
			days.push(new Date(currentDay));
			currentDay.setDate(currentDay.getDate() + 1);
		}
		calendar.push(days);
	}

	return calendar;
};

export const groupByMonthAndYear = (checkedInDays) => {
	const grouped = {};

	// Iterate over each entry in the checkedInDays object
	for (const [key, value] of Object.entries(checkedInDays)) {
		// Parse the date using the Date constructor and format it to "Month Year"
		const date = new Date(key + ','); // Adding comma to correct the date string format if needed
		const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

		// Check if the grouped object already has this monthYear key, if not initialize it
		if (!grouped[monthYear]) {
			grouped[monthYear] = {};
		}

		// Add the current day's data to the corresponding monthYear key
		grouped[monthYear][key] = value;
	}

	return grouped;
};

export const getSortedObjectsByDate = (checkedInDays) => {
	// Convert the object into an array of entries
	const entries = Object.entries(checkedInDays).map(([date, details]) => ({
		date,
		...details,
	}));

	// Sort the array based on the date, most recent first
	entries.sort((a, b) => {
		// Convert date strings to Date objects for comparison
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		return dateB - dateA; // Descending order
	});

	return entries;
};

export const getMonthAndYear = (day) => {
	const month = day.toLocaleString('default', { month: 'long' }); // Get the full name of the month
	const year = day.getFullYear(); // Get the full year

	return `${month} ${year}`; // Combine them into a single string
};

export const isFutureDate = (dateStr) => {
	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparison

	const targetDate = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

	return targetDate > currentDate;
};

export const getAllDaysInWeekFromDate = (date) => {
	let result = [];
	let dayOfWeek = date.getDay(); // Get day of the week (0 is Sunday, 1 is Monday, etc.)
	let start = new Date(date); // Copy date to avoid mutating the original date
	let end = new Date(date);

	// Adjust start date to the previous Monday
	start.setDate(start.getDate() - ((dayOfWeek + 6) % 7));

	// Loop for 7 days from the start date to get the full week
	for (let i = 0; i < 7; i++) {
		let day = new Date(start);
		day.setDate(day.getDate() + i);
		result.push(day);
	}

	return result;
};

export const getAllDaysInMonthFromDate = (date) => {
	let result = [];
	let year = date.getFullYear(); // Get the year of the date
	let month = date.getMonth(); // Get the month of the date (0-indexed)

	// Calculate the number of days in the month
	let daysInMonth = new Date(year, month + 1, 0).getDate();

	// Loop through all days of the month
	for (let day = 1; day <= daysInMonth; day++) {
		result.push(new Date(year, month, day));
	}

	return result;
};

/**
 * Generates all dates between two dates inclusively.
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Date[]} An array of all dates between the start and end date.
 */
export const getAllDaysInRange = (startDate, endDate) => {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
};

export const getAllDatesInYear = (year) => {
	const startDate = new Date(`${year}-01-02`); // Start of the year
	const endDate = new Date(`${year}-12-31`); // End of the year
	const dates = [];

	for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
		dates.push(new Date(date)); // Add a new Date object to the array
	}

	return dates;
};

export const getAllHours = () => {
	const date = new Date();
	date.setMinutes(0); // Set minutes to 0
	date.setSeconds(0); // Set seconds to 0
	date.setMilliseconds(0); // Set milliseconds to 0

	const hours = [];
	for (let i = 0; i < 24; i++) {
		date.setHours(i);
		// Format to local time string and remove minutes and seconds
		const formattedHour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		hours.push(formattedHour);
	}
	return hours;
};

export const sortArrayByEndTime = (array, type = 'descending') => {
	// Create a deep copy of the array to avoid modifying the original
	const arrayCopy = array.map((item) => ({ ...item }));

	if (type === 'descending') {
		return arrayCopy.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
	}

	return arrayCopy.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
};

export const parseTimeStringAMorPM = (timeStr, baseDateStr) => {
	const time = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
	if (!time) return null;

	const baseDate = baseDateStr ? new Date(baseDateStr) : new Date();
	let hours = parseInt(time[1], 10);
	const minutes = parseInt(time[2], 10);
	const isPM = time[3].toUpperCase() === 'PM';

	// Handle noon and midnight cases specifically
	if (hours === 12) {
		hours = isPM ? 12 : 0;
	} else if (isPM) {
		hours += 12;
	}

	baseDate.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds
	return baseDate;
};

export const isInSameHour = (date1, date2) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate() &&
		date1.getHours() === date2.getHours()
	);
};

export const sortObjectByDateKeys = (data) => {
	// Create an array from the object keys and sort it based on the date
	const sortedKeys = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));

	// Create a new object with keys ordered by date
	const sortedObject = {};
	sortedKeys.forEach((key) => {
		sortedObject[key] = data[key];
	});

	return sortedObject;
};

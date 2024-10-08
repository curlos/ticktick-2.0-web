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

export const getTimeString = (dateToUse) => {
	const date = dateToUse || new Date();
	let hours = date.getHours();
	const minutes = date.getMinutes();
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

export const groupTasksByDate = (tasks) => {
	const grouped = {};

	tasks.forEach((task) => {
		const associatedTaskTime = getAssociatedTimeForTask(task);

		if (!associatedTaskTime) {
			return;
		}

		const taskTime = new Date(associatedTaskTime.value);
		const day = taskTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

		// Initialize the array if it does not already exist
		if (!grouped[day]) {
			grouped[day] = [];
		}

		// Push the current record into the correct day array
		grouped[day].push(task);
	});

	// Create an array from the grouped object and sort it by date
	const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
	const sortedGrouped = {};
	sortedKeys.forEach((key) => {
		sortedGrouped[key] = grouped[key];
	});

	return sortedGrouped;
};

export const getAssociatedTimeForTask = (task) => {
	if (task['completedTime']) {
		return {
			key: 'completedTime',
			value: task['completedTime'],
		};
	} else if (task['willNotDo']) {
		return {
			key: 'willNotDo',
			value: task['willNotDo'],
		};
	} else if (task['isDeleted']) {
		return {
			key: 'isDeleted',
			value: task['isDeleted'],
		};
	} else if (task['dueDate']) {
		return {
			key: 'dueDate',
			value: task['dueDate'],
		};
	}

	return null;
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

export const getLast7Weeks = () => {
	let result = [];

	for (let i = 0; i < 7; i++) {
		let week = [];
		for (let j = 0; j < 7; j++) {
			// Get each day of the week
			const date = new Date();
			date.setDate(date.getDate() - (i * 7 + j)); // Subtract `i * 7 + j` days to get each day of the week
			week.push(new Date(date)); // Add the date to the current week
		}
		result.push(week); // Add the week to the result array
	}

	return result.reverse(); // Reverse to start from 7 weeks ago to today
};

export const getLast7Months = () => {
	let result = [];

	for (let i = 0; i < 7; i++) {
		let month = [];
		const today = new Date();
		const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1); // Start at the 1st of the month

		// Loop through all days in the current month
		while (monthDate.getMonth() === (today.getMonth() - i + 12) % 12) {
			month.push(new Date(monthDate)); // Add the day to the current month array
			monthDate.setDate(monthDate.getDate() + 1); // Go to the next day
		}

		result.push(month); // Add the month to the result array
	}

	return result.reverse(); // Reverse to start from 7 months ago to this month
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

export const getFormattedLongDay = (inputDate) => {
	return inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const getFormattedShortMonthDay = (inputDate) => {
	return inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

// TODO: Add a second, optional parameter in this function so that we can get X amount of days instead of only the surrounding week.
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

export const getAllMultiDaysFromDate = (date, multiDays) => {
	const dates = [];
	for (let i = 0; i < multiDays; i++) {
		const newDate = new Date(date); // Create a new Date object based on the initial date
		newDate.setDate(date.getDate() + i); // Increment the day by 'i'
		dates.push(newDate);
	}
	return dates;
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

export const getAllDaysInYearFromDate = (date) => {
	let result = [];
	let year = date.getFullYear(); // Get the year of the date

	// Loop through all months of the year
	for (let month = 0; month < 12; month++) {
		// Calculate the number of days in the month
		let daysInMonth = new Date(year, month + 1, 0).getDate();

		// Loop through all days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			result.push(new Date(year, month, day));
		}
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

export const getMonthDayString = (date) => {
	// Using toLocaleDateString with options for locale-specific month name and day number
	const month = date.toLocaleDateString('en-US', { month: 'short' }); // Gets the abbreviated month
	const day = date.getDate(); // Gets the day of the month

	// Concatenate month and day to form the required string
	return `${month} ${day}`;
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

export const sortArrayByProperty = (array, property, type = 'descending') => {
	// Create a deep copy of the array to avoid modifying the original
	const arrayCopy = array.map((item) => ({ ...item }));

	if (type === 'descending') {
		return arrayCopy.sort((a, b) => new Date(b[property]) - new Date(a[property]));
	}

	return arrayCopy.sort((a, b) => new Date(a[property]) - new Date(b[property]));
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

export const getDurationFromDates = (date1, date2) => {
	// Calculate the difference in milliseconds
	const diffInMilliseconds = date2.getTime() - date1.getTime();

	// Convert milliseconds to seconds
	const diffInSeconds = diffInMilliseconds / 1000;

	return diffInSeconds;
};

export const isDateBefore = (firstDate, secondDate) => {
	// Convert date inputs to Date objects if they are not already
	const date1 = new Date(firstDate);
	const date2 = new Date(secondDate);

	// Compare the time values of the dates
	return date1.getTime() < date2.getTime();
};

export const isWeekendDay = (date) => {
	const dayOfWeek = date.getDay();
	return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
};

export function generateQuarterHourDates(date, timeString) {
	// Determine if the timeString is in 12-hour format with AM/PM
	const isTwelveHourFormat = /AM|PM/i.test(timeString);

	// Parse the timeString to get hours and minutes
	let [time, period] = timeString.split(' ');
	let [hours, minutes] = time.split(':');

	if (isTwelveHourFormat) {
		// Convert 12-hour format to 24-hour format if necessary
		hours = parseInt(hours);
		minutes = parseInt(minutes);
		if (period === 'PM' && hours !== 12) {
			hours += 12;
		} else if (period === 'AM' && hours === 12) {
			hours = 0;
		}
	} else {
		// Handle 24-hour time format
		hours = parseInt(hours);
		minutes = parseInt(minutes);
	}

	// Set the hours and minutes to the date object
	date.setHours(hours, minutes, 0, 0);

	// Generate each quarter-hour increment as a new Date object
	const quarterHourDates = [];
	for (let i = 0; i < 4; i++) {
		let newDate = new Date(date.getTime()); // Create a new Date object from the current date
		newDate.setMinutes(date.getMinutes() + 15 * i); // Set minutes to quarter-hour marks
		quarterHourDates.push(newDate);
	}

	return quarterHourDates;
}

/**
 * Checks if a given time string is within 25 minutes of a reference date.
 *
 * @param {string} timeString - Time in the format "hh:mm PM" or "hh:mm AM" (e.g., "11:00 PM").
 * @param {Date} referenceDate - The reference date to compare against.
 * @returns {boolean} - Returns true if the time string is within 25 minutes of the reference date.
 */
export function isTimeWithin25Minutes(timeString, referenceDate) {
	// Parse the time string to extract hours, minutes, and AM/PM
	const timeParts = timeString.match(/(\d+):(\d+)\s(AM|PM)/i);
	if (!timeParts) return false; // Return false if the format is incorrect

	const hours = parseInt(timeParts[1], 10);
	const minutes = parseInt(timeParts[2], 10);
	const period = timeParts[3];

	// Create a new date object based on the reference date
	let comparisonDate = new Date(referenceDate);

	// Convert 12-hour format to 24-hour by adjusting hours based on AM/PM
	if (period === 'PM' && hours !== 12) {
		comparisonDate.setHours(hours + 12);
	} else if (period === 'AM' && hours === 12) {
		comparisonDate.setHours(0);
	} else {
		comparisonDate.setHours(hours);
	}
	comparisonDate.setMinutes(minutes);
	comparisonDate.setSeconds(0);
	comparisonDate.setMilliseconds(0);

	// Calculate the time difference in minutes
	const timeDifference = Math.abs(comparisonDate - referenceDate);
	const minutesDifference = Math.floor(timeDifference / 60000); // Convert milliseconds to minutes

	// Return true if the difference is 25 minutes or less
	return minutesDifference <= 25;
}

export const isTimeBetween = (targetDate, startDate, endDate, offsetMinutes = 10) => {
	// Convert offset minutes to milliseconds
	const offsetMilliseconds = offsetMinutes * 60 * 1000;

	// Get the time in milliseconds since the epoch for each date
	const targetTime = targetDate.getTime();
	const startTime = startDate.getTime() - offsetMilliseconds; // Apply offset to start time
	const endTime = endDate.getTime() + offsetMilliseconds; // Apply offset to end time

	// Check if the target time in milliseconds is between the adjusted start and end times
	return targetTime > startTime && targetTime < endTime;
};

export const getTimeSince = (date) => {
	const now = new Date(); // Current date and time
	const past = new Date(date); // Convert the input date to a Date object
	if (isNaN(past.getTime())) {
		return 'Invalid date'; // Check if the input date is valid
	}

	const seconds = Math.floor((now - past) / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30); // Approximation
	const years = Math.floor(days / 365);

	return {
		seconds: seconds,
		minutes: minutes,
		hours: hours,
		days: days,
		months: months,
		years: years,
	};
};

export const getTimeInBlocks = (startTime, endTime) => {
	// Parse timestamps
	const start = new Date(startTime);
	const end = new Date(endTime);

	// Normalize the start time to the start of the hour
	const startHour = new Date(start);
	startHour.setMinutes(0, 0, 0);

	const results = [];

	// Loop over each hour block from startHour until end
	while (startHour <= end) {
		const nextHour = new Date(startHour);
		nextHour.setHours(nextHour.getHours() + 1);

		// Calculate the overlap of the current hour block with the [start, end] interval
		const overlapStart = startHour < start ? start : startHour;
		const overlapEnd = nextHour > end ? end : nextHour;

		// Calculate seconds in the current block, if any
		if (overlapStart < overlapEnd) {
			const duration = (overlapEnd - overlapStart) / 1000; // convert milliseconds to seconds
			results.push({
				from: `${startHour.getHours().toString().padStart(2, '0')}:00`,
				to: `${nextHour.getHours().toString().padStart(2, '0')}:00`,
				seconds: duration,
			});
		}

		// Move to the next hour block
		startHour.setHours(startHour.getHours() + 1);
	}

	return results;
};

export const getDailyHourBlocks = () => {
	const hourBlocks = {};

	// Loop over each hour of the day
	for (let hour = 0; hour < 24; hour++) {
		// Format the hour to "HH:00" format
		const fromHour = `${hour.toString().padStart(2, '0')}:00`;
		const toHour = `${(hour + 1).toString().padStart(2, '0')}:00`;

		// Initialize each block with from, to, and seconds set to 0
		hourBlocks[fromHour] = {
			from: fromHour,
			to: toHour,
			seconds: 0,
		};
	}

	return hourBlocks;
};

export const convertTo12HourFormat = (hour24) => {
	// Convert the hour string to an integer
	const hour = parseInt(hour24.substring(0, 2), 10);

	// Determine AM or PM suffix
	const suffix = hour >= 12 ? 'PM' : 'AM';

	// Convert 24-hour time to 12-hour format
	const hour12 = hour % 12 === 0 ? 12 : hour % 12;

	// Return formatted string
	return `${hour12}:00 ${suffix}`;
};

export const hasDatePassed = (inputDate) => {
	// Create a Date object from the input string
	const givenDate = new Date(inputDate);

	// Get the current date and time
	const currentDate = new Date();

	// Compare the given date with the current date
	return givenDate < currentDate;
};

function getStartOfWeek(d) {
	const date = new Date(d);
	const day = date.getDay();
	const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
	return new Date(date.setDate(diff));
}

function getStartOfMonth(d) {
	return new Date(d.getFullYear(), d.getMonth(), 1);
}

export const groupDatesByInterval = (dates, interval) => {
	const grouped = {};

	dates.forEach((dateObj) => {
		let key;
		const d = new Date(dateObj);

		switch (interval) {
			case 'Days':
				key = getFormattedShortMonthDay(d);
				break;
			case 'Weeks':
				key = getFormattedShortMonthDay(getStartOfWeek(d));
				break;
			case 'Months':
				key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
				break;
			default:
				throw new Error('Invalid grouping option. Use "days", "weeks", or "months".');
		}

		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(dateObj);
	});

	return grouped;
};

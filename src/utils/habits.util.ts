export const getStreaks = (habit) => {
	const checkedInDays = habit.checkedInDays;
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparison

	// Convert object keys to an array, sort by date, and filter out non-achieved days
	const sortedDates = Object.keys(checkedInDays)
		.map((date) => ({
			date: new Date(date),
			info: checkedInDays[date],
		}))
		.filter((entry) => entry.info.isAchieved !== null)
		.sort((a, b) => a.date - b.date);

	let longestStreak = 0;
	let currentStreak = 0;
	let previousDate = null;
	let isCurrentStreakActive = false;

	sortedDates.forEach((entry, index) => {
		if (previousDate && entry.date - previousDate === 86400000) {
			currentStreak++;
		} else {
			currentStreak = 1; // Reset current streak if not consecutive
		}

		// Update longest streak found
		if (currentStreak > longestStreak) {
			longestStreak = currentStreak;
		}

		// Determine if the current streak is active
		if (entry.date.getTime() === today.getTime() - 86400000) {
			isCurrentStreakActive = true;
		}

		previousDate = entry.date; // Update the previous date to the current date
	});

	return {
		longestStreak,
		currentStreak: isCurrentStreakActive ? currentStreak : 0,
	};
};

export const getAchievedDays = (habit) => {
	const data = habit.checkedInDays;
	// Convert the data object into an array of entries, filter by 'isAchieved' not being null
	const achievedDays = Object.keys(data)
		.filter((date) => data[date].isAchieved !== null)
		.map((date) => new Date(date)).length; // Convert string date to Date object for better usability

	return achievedDays;
};

export const getCheckInsPerMonth = (habit) => {
	const data = habit.checkedInDays;

	const checkInsPerMonth = {};

	Object.keys(data).forEach((date) => {
		if (data[date].isAchieved !== null) {
			const monthYear = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
			if (checkInsPerMonth[monthYear]) {
				checkInsPerMonth[monthYear]++;
			} else {
				checkInsPerMonth[monthYear] = 1;
			}
		}
	});

	return checkInsPerMonth;
};

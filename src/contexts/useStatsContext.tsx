import { createContext, useContext, useEffect, useState } from 'react';
import {
	useGetAllTasksQuery,
	useGetAllProjectsQuery,
	useGetPomoAndStopwatchFocusRecordsQuery,
} from '../services/resources/ticktickOneApi';
import { getFormattedLongDay, getLast7Days, getLast7Months, getLast7Weeks, getTimeSince } from '../utils/date.utils';
import { getFocusDurationFromArray, getGroupedFocusRecordsByDate } from '../utils/helpers.utils';

const StatsContext = createContext();

export const useStatsContext = () => {
	return useContext(StatsContext);
};

export const StatsProvider = ({ children }) => {
	const calendar = useStats();
	return <StatsContext.Provider value={calendar}>{children}</StatsContext.Provider>;
};

const useStats = () => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetAllTasksQuery();
	const { allTasksAndItems, totalCompletedTasks, completedTasksGroupedByDate, completedTasksGroupedByProject } =
		fetchedTasks || {};

	// RTK Query - TickTick 1.0 - Projects
	const {
		data: fetchedProjects,
		isLoading: isLoadingGetProjects,
		error: errorGetProjects,
	} = useGetAllProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	// RTK Query - TickTick 1.0 - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingGetFocusRecords,
		error: errorGetFocusRecords,
	} = useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords } = fetchedFocusRecords || {};

	const accountCreatedDate = new Date('November 3, 2020');
	const timeSinceAccountCreated = getTimeSince(accountCreatedDate);
	const { days } = timeSinceAccountCreated;

	const [groupedFocusRecordsByDate, setGroupedFocusRecordsByDate] = useState(null);
	const [focusRecordsFromToday, setFocusRecordsFromToday] = useState(null);
	const [completedTasksForToday, setCompletedTasksForToday] = useState(null);
	const [totalFocusDuration, setTotalFocusDuration] = useState(0);
	const [focusDurationForToday, setFocusDurationForToday] = useState(0);
	const [statsForLastSevenDays, setStatsForLastSevenDays] = useState(null);
	const [statsForLastSevenWeeks, setStatsForLastSevenWeeks] = useState(null);
	const [statsForLastSevenMonths, setStatsForLastSevenMonths] = useState(null);

	// TODO: I've set it to September 15, 2024 for now since that's the last date with the most up-to-date data but once I stop getting the local data, I need to set this back to Today's date so remove "September 15, 2024".
	const todayDate = new Date('September 15, 2024');
	const todayDateKey = getFormattedLongDay(todayDate);

	useEffect(() => {
		if (isLoadingGetFocusRecords || isLoadingGetTasks || isLoadingGetProjects) {
			return;
		}

		setGroupedFocusRecordsByDate(getGroupedFocusRecordsByDate(focusRecords));
		setTotalFocusDuration(getFocusDurationFromArray(focusRecords));
	}, [isLoadingGetFocusRecords, isLoadingGetTasks, isLoadingGetProjects]);

	useEffect(() => {
		if (!groupedFocusRecordsByDate) {
			return;
		}

		setFocusRecordsFromToday(groupedFocusRecordsByDate[todayDateKey]);
	}, [groupedFocusRecordsByDate]);

	useEffect(() => {
		if (!focusRecordsFromToday || !completedTasksGroupedByDate || !groupedFocusRecordsByDate) {
			return;
		}

		setCompletedTasksForToday(completedTasksGroupedByDate[todayDateKey]);
		setFocusDurationForToday(getFocusDurationFromArray(focusRecordsFromToday));
		setStatsForLastSevenDays(getStatsForLast7Days());
		setStatsForLastSevenWeeks(getStatsForLast7Weeks());
		setStatsForLastSevenMonths(getStatsForLast7Months());
	}, [focusRecordsFromToday, completedTasksGroupedByDate, groupedFocusRecordsByDate]);

	const getStatsForLast7Days = () => {
		// Get the past 7 days including today
		const lastSevenDays = getLast7Days();
		const lastSevenDaysData = [];

		for (let day of lastSevenDays) {
			const dayKey = getFormattedLongDay(day);

			const completedTasks = completedTasksGroupedByDate[dayKey];
			const focusRecords = groupedFocusRecordsByDate[dayKey];
			const focusDuration = (focusRecords && getFocusDurationFromArray(focusRecords)) || 0;

			lastSevenDaysData.push({
				name: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
				completedTasks,
				focusRecords,
				focusDuration,
			});
		}

		return lastSevenDaysData;
	};

	const getStatsForLast7Weeks = () => {
		const lastSevenWeeks = getLast7Weeks();
		const lastSevenWeeksData = [];

		// Fill in the default data that we'll need to edit in the following for loop with the different properties for the stats.
		for (let week of lastSevenWeeks) {
			const lastDayOfTheWeek = week[0];
			const firstDayOfTheWeek = week[week.length - 1];
			const lastDayShortName = lastDayOfTheWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
			const firstDayShortName = firstDayOfTheWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

			lastSevenWeeksData.push({
				name: lastDayShortName,
				fullName: `${firstDayShortName} to ${lastDayShortName}`,
				completedTasks: [],
				focusRecords: [],
				focusDuration: 0,
			});
		}

		// Go through each week and each day in that week, get the stats for that day and add or push it to its week's total stats.
		for (let i = 0; i < lastSevenWeeks.length; i++) {
			const week = lastSevenWeeks[i];
			const currentWeekData = lastSevenWeeksData[i];

			for (let day of week) {
				const dayKey = getFormattedLongDay(day);

				const completedTasks = completedTasksGroupedByDate[dayKey] || [];
				const focusRecords = groupedFocusRecordsByDate[dayKey] || [];
				const focusDuration = (focusRecords && getFocusDurationFromArray(focusRecords)) || 0;

				currentWeekData.completedTasks.push(...completedTasks);
				currentWeekData.focusRecords.push(...focusRecords);
				currentWeekData.focusDuration += focusDuration;
			}
		}

		return lastSevenWeeksData;
	};

	const getStatsForLast7Months = () => {
		const lastSevenMonths = getLast7Months();
		const lastSevenMonthsData = [];

		// Fill in the default data that we'll need to edit in the following for loop with the different properties for the stats.
		for (let month of lastSevenMonths) {
			const firstDayOfTheMonth = month[0];
			const monthShortName = firstDayOfTheMonth.toLocaleDateString('en-US', { month: 'short' });
			const monthLongName = firstDayOfTheMonth.toLocaleDateString('en-US', { month: 'long' });

			lastSevenMonthsData.push({
				name: monthShortName,
				fullName: `${monthLongName}`,
				completedTasks: [],
				focusRecords: [],
				focusDuration: 0,
			});
		}

		// Go through each month and each day in that month, get the stats for that day and add or push it to its month's total stats.
		for (let i = 0; i < lastSevenMonths.length; i++) {
			const month = lastSevenMonths[i];
			const currentMonthData = lastSevenMonthsData[i];

			for (let day of month) {
				const dayKey = getFormattedLongDay(day);

				const completedTasks = completedTasksGroupedByDate[dayKey] || [];
				const focusRecords = groupedFocusRecordsByDate[dayKey] || [];
				const focusDuration = (focusRecords && getFocusDurationFromArray(focusRecords)) || 0;

				currentMonthData.completedTasks.push(...completedTasks);
				currentMonthData.focusRecords.push(...focusRecords);
				currentMonthData.focusDuration += focusDuration;
			}
		}

		return lastSevenMonthsData;
	};

	const getCompletedTasksFromSelectedDates = (datesArr) => {
		const completedTasks = [];

		for (let date of datesArr) {
			const dateKey = getFormattedLongDay(date);
			const completedTasksForDateArr = completedTasksGroupedByDate[dateKey] || [];
			completedTasks.push(...completedTasksForDateArr);
		}

		return completedTasks;
	};

	return {
		total: {
			numOfAllTasks: allTasksAndItems?.length || 0,
			numOfCompletedTasks: totalCompletedTasks || 0,
			numOfProjects: projects?.length || 0,
			numOfDaysSinceAccountCreated: days || 0,
			numOfFocusRecords: focusRecords?.length || 0,
			focusDuration: totalFocusDuration || 0,
		},
		today: {
			numOfCompletedTasks: completedTasksForToday?.length || 0,
			numOfFocusRecords: focusRecordsFromToday?.length || 0,
			focusDuration: focusDurationForToday || 0,
		},
		statsForLastSevenDays,
		statsForLastSevenWeeks,
		statsForLastSevenMonths,
		// From RTK Query
		completedTasksGroupedByDate,
		completedTasksGroupedByProject,
		projectsById,

		// Functions
		getCompletedTasksFromSelectedDates,
	};
};

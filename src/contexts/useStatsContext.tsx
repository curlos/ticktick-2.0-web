import { createContext, useContext, useEffect, useState } from 'react';
import {
	useGetAllTasksQuery,
	useGetAllProjectsQuery,
	useGetPomoAndStopwatchFocusRecordsQuery,
} from '../services/resources/ticktickOneApi';
import { getFormattedLongDay, getLast7Days, getTimeSince } from '../utils/date.utils';
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
	const { allTasksAndItems, totalCompletedTasks, completedTasksGroupedByDate } = fetchedTasks || {};

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

	// TODO: I've set it to September 13, 2024 for now since that's the last date with the most up-to-date data but once I stop getting the local data, I need to set this back to Today's date so remove "September 13, 2024".
	const todayDate = new Date('September 13, 2024');
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

	console.log(statsForLastSevenDays);

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
	};
};

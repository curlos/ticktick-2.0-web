import {
	useGetAllTasksQuery,
	useGetAllProjectsQuery,
	useGetPomoAndStopwatchFocusRecordsQuery,
} from '../services/resources/ticktickOneApi';
import { getFormattedLongDay, getTimeSince } from '../utils/date.utils';
import { getFocusDurationFromArray, getGroupedFocusRecordsByDate } from '../utils/helpers.utils';

const useGetRelevantStats = () => {
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

	const groupedFocusRecordsByDate = getGroupedFocusRecordsByDate(focusRecords);

	const accountCreatedDate = new Date('November 3, 2020');
	const timeSinceAccountCreated = getTimeSince(accountCreatedDate);
	const { days } = timeSinceAccountCreated;

	// TODO: I've set it to September 13, 2024 for now since that's the last date with the most up-to-date data but once I stop getting the local data, I need to set this back to Today's date so remove "September 13, 2024".
	const todayDate = new Date('September 13, 2024');
	const todayDateKey = getFormattedLongDay(todayDate);
	const completedTasksForToday = completedTasksGroupedByDate && completedTasksGroupedByDate[todayDateKey];
	const focusRecordsFromToday = groupedFocusRecordsByDate[todayDateKey];

	const totalFocusDuration = getFocusDurationFromArray(focusRecords);
	const focusDurationForToday = getFocusDurationFromArray(focusRecordsFromToday);

	console.log(totalFocusDuration);

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
	};
};

export default useGetRelevantStats;

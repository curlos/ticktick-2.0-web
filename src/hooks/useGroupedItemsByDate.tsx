import { useState, useEffect } from 'react';
import { useGetFocusRecordsQuery } from '../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../services/resources/habitsApi';
import { useGetProjectsQuery } from '../services/resources/projectsApi';
import { useGetTasksQuery } from '../services/resources/tasksApi';
import { sortObjectByDateKeys } from '../utils/date.utils';

const useGroupedItemsByDate = () => {
	const [allItemsGroupedByDate, setAllItemsGroupedByDate] = useState({});

	// RTK Query - Focus Records
	const { data: fetchedFocusRecords, isLoading: isLoadingGetFocusRecords } = useGetFocusRecordsQuery();
	const { sortedGroupedFocusRecordsAsc, focusRecordsById } = fetchedFocusRecords || {};

	// RTK Query - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks } = useGetTasksQuery();
	// TODO: When a new task is added, not showing up on calendar. Make sure this refreshes so data isn't stale.
	const { tasks, tasksById, groupedTasksByDate } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits } = useGetHabitsQuery();
	const { habitsById } = fetchedHabits || {};

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isLoadingProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const isAllDoneLoading =
		!(isLoadingGetFocusRecords && isLoadingGetTasks && isLoadingGetHabits) &&
		focusRecordsById &&
		tasksById &&
		projectsById &&
		habitsById;

	const sortedTasksByDate = groupedTasksByDate && sortObjectByDateKeys(groupedTasksByDate);
	const sortedFocusRecordsByDate = sortedGroupedFocusRecordsAsc && sortObjectByDateKeys(sortedGroupedFocusRecordsAsc);

	useEffect(() => {
		if (sortedTasksByDate && sortedFocusRecordsByDate) {
			const newAllGroupedByDate = {};

			Object.keys(sortedTasksByDate).forEach((dateKey) => {
				const tasksForThisDay = sortedTasksByDate[dateKey];

				if (!newAllGroupedByDate[dateKey]) {
					newAllGroupedByDate[dateKey] = {};
				}

				newAllGroupedByDate[dateKey].tasks = tasksForThisDay;
			});

			Object.keys(sortedFocusRecordsByDate).forEach((dateKey) => {
				const focusRecordForThisDay = sortedFocusRecordsByDate[dateKey];

				if (!newAllGroupedByDate[dateKey]) {
					newAllGroupedByDate[dateKey] = {};
				}

				newAllGroupedByDate[dateKey].focusRecords = focusRecordForThisDay;
			});

			const newSortedAllGroupedByDate = newAllGroupedByDate && sortObjectByDateKeys(newAllGroupedByDate);
			setAllItemsGroupedByDate(newSortedAllGroupedByDate);
		}
	}, [isAllDoneLoading]);

	return { allItemsGroupedByDate, isAllDoneLoading, focusRecordsById, tasksById, projectsById, habitsById };
};

export default useGroupedItemsByDate;

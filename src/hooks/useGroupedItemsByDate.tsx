import { useState, useEffect } from 'react';
import { useGetFocusRecordsQuery } from '../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../services/resources/habitsApi';
import { useGetProjectsQuery } from '../services/resources/projectsApi';
import { useGetTasksQuery } from '../services/resources/tasksApi';
import { sortObjectByDateKeys } from '../utils/date.utils';
import { filterTaskByFilter } from '../utils/filters.util';

const useGroupedItemsByDate = (filters) => {
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

	useEffect(() => {
		// TODO: Use the passed in filters to filter the the tasks and focus records according to the filters. For example, if GUNPLA is selected as the only chosen project, then only GUNPLA tasks and focus records should be shown.
		const filteredGroupedTasksByDate = {};
		const filteredFocusRecordsByDate = {};

		groupedTasksByDate &&
			Object.keys(groupedTasksByDate).forEach((dateKey) => {
				const tasksForDayArray = groupedTasksByDate[dateKey];

				filteredGroupedTasksByDate[dateKey] = tasksForDayArray.filter(filterTask);
			});

		sortedGroupedFocusRecordsAsc &&
			Object.keys(sortedGroupedFocusRecordsAsc).forEach((dateKey) => {
				const focusRecordsForTheDay = sortedGroupedFocusRecordsAsc[dateKey];
				const filteredFocusRecordsForTheDay = focusRecordsForTheDay.filter((focusRecord) => {
					const { taskId } = focusRecord;

					const foundTask = tasksById[taskId];

					return filterTask(foundTask);
				});

				filteredFocusRecordsByDate[dateKey] = filteredFocusRecordsForTheDay;
			});

		console.log(sortedGroupedFocusRecordsAsc);
		console.log(filteredGroupedTasksByDate);

		const sortedTasksByDate = filteredGroupedTasksByDate && sortObjectByDateKeys(filteredGroupedTasksByDate);
		const sortedFocusRecordsByDate = filteredFocusRecordsByDate && sortObjectByDateKeys(filteredFocusRecordsByDate);

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
	}, [
		isAllDoneLoading,
		fetchedTasks,
		fetchedProjects,
		fetchedHabits,
		fetchedFocusRecords,
		filters.allValue,
		filters.selectedValuesById,
	]);

	const filterTask = (task) => {
		if (filters.allValue.isChecked) {
			return true;
		}

		const { projectsById, tagsById, filtersById } = filters.selectedValuesById;

		const listOfProjects = Object.values(projectsById);
		const listOfTags = Object.values(tagsById);
		const listOfFilters = Object.values(filtersById);

		for (const project of listOfProjects) {
			if (project.isChecked && String(task?.projectId) === String(project._id)) {
				return true;
			}
		}

		for (const tag of listOfTags) {
			if (tag.isChecked && task?.tagIds.includes(String(tag._id))) {
				return true;
			}
		}

		for (const filter of listOfFilters) {
			if (filter.isChecked) {
				const doesTaskMatchTheFilter = filterTaskByFilter(task, filter);
				return doesTaskMatchTheFilter ? true : false;
			}
		}

		return false;
	};

	return { allItemsGroupedByDate, isAllDoneLoading, focusRecordsById, tasksById, projectsById, habitsById };
};

export default useGroupedItemsByDate;

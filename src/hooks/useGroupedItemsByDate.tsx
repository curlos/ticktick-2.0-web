import { useState, useEffect } from 'react';
import { useGetFocusRecordsQuery } from '../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../services/resources/habitsApi';
import { useGetProjectsQuery } from '../services/resources/projectsApi';
import { useGetTasksQuery } from '../services/resources/tasksApi';
import { sortObjectByDateKeys } from '../utils/date.utils';
import { filterTaskByFilter } from '../utils/filters.util';
import { useCalendarContext } from '../contexts/useCalendarContext';

const useGroupedItemsByDate = (filters) => {
	const { selectedTasksToShow } = useCalendarContext();
	const { showCompleted, showHabit, showFocusRecords, showWeekends } = selectedTasksToShow;

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
		if (!isAllDoneLoading) {
			return;
		}

		const filteredGroupedTasksByDate = {};
		const filteredFocusRecordsByDate = {};

		// Filter the tasks
		groupedTasksByDate &&
			Object.keys(groupedTasksByDate).forEach((dateKey) => {
				const tasksForDayArray = groupedTasksByDate[dateKey];

				filteredGroupedTasksByDate[dateKey] = tasksForDayArray.filter(filterTask);
			});

		// Filter the focus records (by the attached task - if there is any)
		showFocusRecords.isChecked &&
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

		if (filteredGroupedTasksByDate && (!showFocusRecords.isChecked || filteredFocusRecordsByDate)) {
			const newAllGroupedByDate = {};

			// Add the filtered tasks to the all grouped by date items object
			Object.keys(filteredGroupedTasksByDate).forEach((dateKey) => {
				const tasksForThisDay = filteredGroupedTasksByDate[dateKey];

				if (!newAllGroupedByDate[dateKey]) {
					newAllGroupedByDate[dateKey] = {};
				}

				newAllGroupedByDate[dateKey].tasks = tasksForThisDay;
			});

			// Add the filtered focus records to the all grouped by date items object
			showFocusRecords.isChecked &&
				Object.keys(filteredFocusRecordsByDate).forEach((dateKey) => {
					const focusRecordForThisDay = filteredFocusRecordsByDate[dateKey];

					if (!newAllGroupedByDate[dateKey]) {
						newAllGroupedByDate[dateKey] = {};
					}

					newAllGroupedByDate[dateKey].focusRecords = focusRecordForThisDay;
				});

			// Sort all the items by their date key (from oldest to most recent)
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
		selectedTasksToShow,
	]);

	const filterTask = (task) => {
		const viewOptionsShowsIt = filterByViewOptions(task);
		const filterSidebarShowsIt = viewOptionsShowsIt && filterTaskByFilterSidebar(task);
		return viewOptionsShowsIt && filterSidebarShowsIt;
	};

	const filterByViewOptions = (task) => {
		// showWeekends
		console.log(task);
		const doNotShowCompletedTasks = !showCompleted.isChecked;

		if (task && doNotShowCompletedTasks) {
			if (task.completedTime) {
				return false;
			}
		}

		return true;
	};

	const filterTaskByFilterSidebar = (task) => {
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

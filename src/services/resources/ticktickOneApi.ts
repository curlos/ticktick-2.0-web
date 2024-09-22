import {
	arrayToObjectByKey,
	getAllTasksAndItemsTickTickOne,
	getGroupedCompletedTasks,
} from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

/**
 * @description This is the API for getting focus records, tasks, project, etc. from TickTick 1.0 - the original TickTick and the one I currently use. This is only going to be used to gather data from TickTick 1.0 and display it in a nicer fashion while I finish TickTick 2.0 which could take a while.
 */
export const tickTickOneApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getPomoAndStopwatchFocusRecords: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/ticktick-1.0/focus-records?${queryString}` : '/ticktick-1.0/focus-records';
			},
			transformResponse: (response) => {
				const focusRecordsById = arrayToObjectByKey(response, 'id');

				return { focusRecords: response, focusRecordsById };
			},
		}),
		getAllTasks: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/ticktick-1.0/tasks?${queryString}` : '/ticktick-1.0/tasks';
			},
			transformResponse: (response) => {
				const tasks = response;
				const tasksById = arrayToObjectByKey(response, 'id');
				const allTasksAndItems = getAllTasksAndItemsTickTickOne(tasks);
				const { completedTasksGroupedByDate, completedTasksGroupedByProject, completedTasksGroupedByTag } =
					getGroupedCompletedTasks(tasks);

				// console.log(completedTasksGroupedByTag);

				let totalCompletedTasks = 0;

				Object.values(completedTasksGroupedByDate).forEach((arr) => {
					if (arr) {
						totalCompletedTasks += arr.length;
					}
				});

				return {
					tasks,
					tasksById,
					allTasksAndItems,
					completedTasksGroupedByDate,
					completedTasksGroupedByProject,
					completedTasksGroupedByTag,
					totalCompletedTasks,
				};
			},
		}),
		getAllProjects: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/ticktick-1.0/projects?${queryString}` : '/ticktick-1.0/projects';
			},
			transformResponse: (response) => {
				const projects = response;
				const projectsById = arrayToObjectByKey(response, 'id');

				return { projects, projectsById };
			},
		}),
		getAllTags: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/ticktick-1.0/tags?${queryString}` : '/ticktick-1.0/tags';
			},
			transformResponse: (response) => {
				const tags = response;
				// TickTick 1.0 Tags do not have an "id" property. Thie closest thing I see to a key is either "name" or "rawName".
				const tagsByRawName = arrayToObjectByKey(tags, 'rawName');

				return { tags, tagsByRawName };
			},
		}),
	}),
});

export const {
	useGetPomoAndStopwatchFocusRecordsQuery,
	useGetAllTasksQuery,
	useGetAllProjectsQuery,
	useGetAllTagsQuery,
} = tickTickOneApi;

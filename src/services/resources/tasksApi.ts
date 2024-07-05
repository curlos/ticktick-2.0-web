import { arrayToObjectByKey, getObjectOfEachItemsParent } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const usersApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getTasks: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/tasks?${queryString}` : '/tasks';
			},
			providesTags: ['Task'],
			transformResponse: (response) => {
				const tasks = response;
				const tasksById = arrayToObjectByKey(tasks, '_id');
				// Tells us the parent id of a task (if it has any)
				const parentOfTasks = getObjectOfEachItemsParent(response);
				const tasksWithoutDeletedOrWillNotDo = tasks.filter((task) => !task.isDeleted && !task.willNotDo);

				return { tasks, tasksById, parentOfTasks, tasksWithoutDeletedOrWillNotDo };
			},
		}),
		addTask: builder.mutation({
			query: ({ payload, parentId }) => {
				const url = parentId ? `/tasks/add?parentId=${parentId}` : '/tasks/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: ['Task'], // Invalidate the cache when a task is added
		}),
		editTask: builder.mutation({
			query: ({ taskId, payload }) => ({
				url: `/tasks/edit/${taskId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, taskId) => ['Task'],
		}),
		bulkEditTasks: builder.mutation({
			query: (newTaskList) => ({
				url: '/tasks/bulk-edit',
				method: 'PUT',
				body: newTaskList,
			}),
			invalidatesTags: ['Task'], // Invalidate the cache when a task is added
		}),
		flagTask: builder.mutation({
			query: ({ taskId, parentId, property, value }) => ({
				url: `/tasks/flag-task/${taskId}`,
				method: 'PATCH',
				body: {
					property: property, // This could be 'isDeleted' or any other property
					value: value, // This is typically true for isDeleted, but can be any value
					parentId: parentId, // Optional: Include parentId if needed to update the parent document
				},
			}),
			invalidatesTags: ['Task'],
		}),
		permanentlyDeleteTask: builder.mutation({
			query: ({ taskId, parentId }) => ({
				url: `/tasks/delete/${taskId}${parentId ? `?parentId=${parentId}` : ''}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Task'],
		}),
	}),
});

export const {
	useGetTasksQuery,
	useAddTaskMutation,
	useEditTaskMutation,
	useBulkEditTasksMutation,
	useFlagTaskMutation,
	usePermanentlyDeleteTaskMutation,
} = usersApi;

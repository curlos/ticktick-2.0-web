import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { arrayToObjectByKey, getObjectOfEachTasksParent } from '../utils/helpers.utils';

// Utility function to build query strings
const buildQueryString = (params) => {
	return params ? new URLSearchParams(params).toString() : '';
};

// Define the API with tasks endpoints
export const api = createApi({
	reducerPath: 'tasksApi', // Unique identifier for the reducer
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8888' }), // Base URL for API calls
	tagTypes: ['Task', 'Project', 'FocusRecord'], // Define tag type for cache invalidation
	endpoints: (builder) => ({
		// Tasks
		getTasks: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/tasks?${queryString}` : '/tasks'; // Use query string if provided
			},
			providesTags: ['Task'], // This endpoint provides the 'Task' tag
			transformResponse: (response) => {
				const tasksById = arrayToObjectByKey(response, '_id');
				// Tells us the parent id of a task (if it has any)
				const parentOfTasks = getObjectOfEachTasksParent(response);

				return { tasks: response, tasksById, parentOfTasks }; // Return as a combined object
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
			invalidatesTags: ['Task'], // Invalidate the cache when a task is updated
		}),
		// PERMANENTLY DELETE TASK FOREVER
		permanentlyDeleteTask: builder.mutation({
			query: ({ taskId, parentId }) => ({
				url: `/tasks/delete/${taskId}${parentId ? `?parentId=${parentId}` : ''}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Task'], // Invalidate the cache when a task is added
		}),

		// Projects/Folders
		getProjects: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/projects?${queryString}` : '/projects'; // Use query string if provided
			},
			providesTags: ['Project'], // This endpoint provides the 'Task' tag
			transformResponse: (response) => {
				const projectsById = arrayToObjectByKey(response, '_id');
				return { projects: response, projectsById }; // Return as a combined object
			},
		}),
		addProject: builder.mutation({
			query: (newProject) => ({
				url: '/projects/add',
				method: 'POST',
				body: newProject,
			}),
			invalidatesTags: ['Project'], // Invalidate the cache when a task is added
		}),
		editProject: builder.mutation({
			query: ({ projectId, payload }) => ({
				url: `/projects/edit/${projectId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, projectId) => ['Project'],
		}),
		permanentlyDeleteProject: builder.mutation({
			query: ({ projectId }) => ({
				url: `/projects/delete/${projectId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Project', 'Task'],
		}),

		// Focus Records
		getFocusRecords: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/focus-records?${queryString}` : '/focus-records'; // Use query string if provided
			},
			providesTags: ['FocusRecord'], // This endpoint provides the 'Task' tag
			transformResponse: (response) => {
				return { focusRecords: response }; // Return as a combined object
			},
		}),
	}),
});

// Export hooks to use in React components
export const {
	// Tasks
	useGetTasksQuery,
	useAddTaskMutation,
	useEditTaskMutation,
	useBulkEditTasksMutation,
	// TODO: Use this!
	useFlagTaskMutation,
	usePermanentlyDeleteTaskMutation,

	// Projects/Folders
	useGetProjectsQuery,
	useAddProjectMutation,
	useEditProjectMutation,
	usePermanentlyDeleteProjectMutation,

	// Focus Records
	useGetFocusRecordsQuery,
} = api;

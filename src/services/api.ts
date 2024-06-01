import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { arrayToObjectArrayByKey, arrayToObjectByKey, getObjectOfEachTasksParent } from '../utils/helpers.utils';
import { loginUserSuccess } from '../slices/userSlice';

// Utility function to build query strings
const buildQueryString = (params) => {
	return params ? new URLSearchParams(params).toString() : '';
};

// Define the API with tasks endpoints
export const api = createApi({
	reducerPath: 'api', // Unique identifier for the reducer
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:8888',
		prepareHeaders: (headers, { getState }) => {
			const token = getState().user.token; // Assuming you store your token in auth slice
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
			return headers;
		},
	}),
	tagTypes: ['Task', 'Project', 'FocusRecord'], // Define tag type for cache invalidation
	endpoints: (builder) => ({
		// Users
		getLoggedInUser: builder.query({
			query: () => '/users/logged-in/details',
		}),
		registerUser: builder.mutation({
			query: (userDetails) => ({
				url: '/users/register',
				method: 'POST',
				body: userDetails,
			}),
			transformResponse: (response, meta, arg) => {
				// Optionally, you can handle the response transformation here
				return response;
			},
			// Handle side effects or update the cache after successful registration
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled;
					// Example: Store the received token or user details after successful registration
					localStorage.setItem('token', data.token); // Assuming token is part of the response
					// You could dispatch other actions, e.g., for updating user state in Redux
				} catch (error) {
					console.error('Registration failed:', error);
				}
			},
		}),

		loginUser: builder.mutation({
			query: (credentials) => ({
				url: '/users/login',
				method: 'POST',
				body: credentials,
			}),
			transformResponse: (response, meta, arg) => {
				// Optionally, you can handle the response transformation here
				return response;
			},
			// Optional: You can use this to update the cache or invalidate tags if needed
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled;
					dispatch(loginUserSuccess(data)); // Update user slice state on successful login
				} catch (error) {
					console.error('Login failed:', error);
				}
			},
			invalidatesTags: (result, error) => (error ? [] : ['Task', 'Project', 'FocusRecord']),
		}),

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
				const focusRecords = response;
				const focusRecordsByTaskId = arrayToObjectArrayByKey(focusRecords, 'taskId');

				console.log(focusRecordsByTaskId);

				return { focusRecords, focusRecordsByTaskId }; // Return as a combined object
			},
		}),
		addFocusRecord: builder.mutation({
			query: (payload) => {
				const url = '/focus-records/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: ['FocusRecord'],
		}),
		editFocusRecord: builder.mutation({
			query: ({ focusRecordId, payload }) => ({
				url: `/focus-records/edit/${focusRecordId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, focusRecordId) => ['FocusRecord'],
		}),
		// PERMANENTLY DELETE FOCUS RECORD FOREVER
		permanentlyDeleteFocusRecord: builder.mutation({
			query: (focusRecordId) => ({
				url: `/focus-records/delete/${focusRecordId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['FocusRecord'], // Invalidate the cache when a task is added
		}),
	}),
});

// Export hooks to use in React components
export const {
	// Users
	useGetLoggedInUserQuery,
	useRegisterUserMutation,
	useLoginUserMutation,

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
	useAddFocusRecordMutation,
	useEditFocusRecordMutation,
	usePermanentlyDeleteFocusRecordMutation,
} = api;

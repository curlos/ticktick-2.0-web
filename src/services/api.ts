import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	arrayToObjectArrayByKey,
	arrayToObjectByKey,
	getObjectOfEachTasksParent,
	getObjectOfEachFocusRecordsParent,
} from '../utils/helpers.utils';
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
			const token = getState().user.token;
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
			return headers;
		},
	}),
	tagTypes: ['Task', 'Project', 'FocusRecord', 'User', 'Comment', 'Matrix'],
	endpoints: (builder) => ({
		// Users
		getUsers: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/users?${queryString}` : '/users';
			},
			providesTags: ['User'],
			transformResponse: (response) => {
				const usersById = arrayToObjectByKey(response, '_id');

				return { users: response, usersById };
			},
		}),
		getLoggedInUser: builder.query({
			query: () => '/users/logged-in',
		}),
		registerUser: builder.mutation({
			query: (userDetails) => ({
				url: '/users/register',
				method: 'POST',
				body: userDetails,
			}),
			transformResponse: (response, meta, arg) => {
				return response;
			},
			// Handle side effects or update the cache after successful registration
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled;
					localStorage.setItem('token', data.token);
				} catch (error) {
					console.error('Registration failed:', error);
				}
			},
			invalidatesTags: ['User'],
		}),

		loginUser: builder.mutation({
			query: (credentials) => ({
				url: '/users/login',
				method: 'POST',
				body: credentials,
			}),
			transformResponse: (response, meta, arg) => {
				return response;
			},
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
				return queryString ? `/tasks?${queryString}` : '/tasks';
			},
			providesTags: ['Task'],
			transformResponse: (response) => {
				const tasksById = arrayToObjectByKey(response, '_id');
				// Tells us the parent id of a task (if it has any)
				const parentOfTasks = getObjectOfEachTasksParent(response);

				return { tasks: response, tasksById, parentOfTasks };
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

		// Projects/Folders
		getProjects: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/projects?${queryString}` : '/projects';
			},
			providesTags: ['Project'],
			transformResponse: (response) => {
				const projectsById = arrayToObjectByKey(response, '_id');
				return { projects: response, projectsById };
			},
		}),
		addProject: builder.mutation({
			query: (newProject) => ({
				url: '/projects/add',
				method: 'POST',
				body: newProject,
			}),
			invalidatesTags: ['Project'],
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
				return queryString ? `/focus-records?${queryString}` : '/focus-records';
			},
			providesTags: ['FocusRecord'],
			transformResponse: (response) => {
				const focusRecords = response;
				const focusRecordsByTaskId = arrayToObjectArrayByKey(focusRecords, 'taskId');
				const focusRecordsById = arrayToObjectByKey(focusRecords, '_id');

				const parentOfFocusRecords = getObjectOfEachFocusRecordsParent(focusRecords);

				return { focusRecords, focusRecordsByTaskId, focusRecordsById, parentOfFocusRecords };
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
		permanentlyDeleteFocusRecord: builder.mutation({
			query: (focusRecordId) => ({
				url: `/focus-records/delete/${focusRecordId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['FocusRecord'],
		}),
		bulkAddFocusRecords: builder.mutation({
			query: (payload) => ({
				url: '/focus-records/bulk-add',
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: ['FocusRecord'],
		}),

		// Comments
		getComments: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/comments?${queryString}` : '/comments';
			},
			providesTags: ['Comment'],
			transformResponse: (response) => {
				const comments = response;
				const commentsByTaskId = arrayToObjectArrayByKey(comments, 'taskId');

				return { comments, commentsByTaskId };
			},
		}),
		addComment: builder.mutation({
			query: (payload) => {
				const url = '/comments/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: ['Comment'],
		}),
		editComment: builder.mutation({
			query: ({ commentId, payload }) => ({
				url: `/comments/edit/${commentId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, commentId) => ['Comment'],
		}),
		permanentlyDeleteComment: builder.mutation({
			query: (commentId) => ({
				url: `/comments/delete/${commentId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Comment'],
		}),

		// Matrices
		getMatrices: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/matrices?${queryString}` : '/matrices';
			},
			providesTags: ['Matrix'],
			transformResponse: (response) => {
				const matrices = response;

				return { matrices };
			},
		}),
		editMatrix: builder.mutation({
			query: ({ matrixId, payload }) => ({
				url: `/matrices/edit/${matrixId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, matrixId) => ['Matrix'],
		}),
	}),
});

// Export hooks to use in React components
export const {
	// Users
	useGetUsersQuery,
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
	useBulkAddFocusRecordsMutation,

	// Comments
	useGetCommentsQuery,
	useAddCommentMutation,
	useEditCommentMutation,
	usePermanentlyDeleteCommentMutation,

	// Matrices
	useGetMatricesQuery,
	useEditMatrixMutation,

	// TODO: Add tags
} = api;

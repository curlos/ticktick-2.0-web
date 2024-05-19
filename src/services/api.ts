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
    tagTypes: ['Task', 'Project'], // Define tag type for cache invalidation
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
                const parentsOfTasks = getObjectOfEachTasksParent(response);

                return { tasks: response, tasksById, parentsOfTasks }; // Return as a combined object
            }
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
        bulkEditTasks: builder.mutation({
            query: (newTaskList) => ({
                url: '/tasks/bulk-edit',
                method: 'PUT',
                body: newTaskList,
            }),
            invalidatesTags: ['Task'], // Invalidate the cache when a task is added
        }),
        deleteTask: builder.mutation({
            query: (taskId) => ({
                url: `/tasks/delete/${taskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, taskId) => ['Task'],
        }),

        // Projects/Folders
        getProjects: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString ? `/projects?${queryString}` : '/projects'; // Use query string if provided
            },
            providesTags: ['Project'], // This endpoint provides the 'Task' tag
        }),
        addProject: builder.mutation({
            query: (newProject) => ({
                url: '/projects/add',
                method: 'POST',
                body: newProject,
            }),
            invalidatesTags: ['Project'], // Invalidate the cache when a task is added
        }),
    }),
});

// Export hooks to use in React components
export const {
    // Tasks
    useGetTasksQuery,
    useAddTaskMutation,
    useBulkEditTasksMutation,
    useDeleteTaskMutation,

    // Projects/Folders
    useGetProjectsQuery,
    useAddProjectMutation,

} = api;
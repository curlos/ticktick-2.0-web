import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
        }),
        addTask: builder.mutation({
            query: (newTask) => ({
                url: '/tasks/add',
                method: 'POST',
                body: newTask,
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

    // Projects/Folders
    useGetProjectsQuery,
    useAddProjectMutation,

} = api;
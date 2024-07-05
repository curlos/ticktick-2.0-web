import { arrayToObjectByKey } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const projectsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getProjects: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/projects?${queryString}` : '/projects';
			},
			providesTags: ['Project'],
			transformResponse: (response) => {
				const projectsById = arrayToObjectByKey(response, '_id');
				const inboxProject = projectsById['665233f98d8317681ddb831a'];

				return { projects: response, projectsById, inboxProject };
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
	}),
});

export const {
	useGetProjectsQuery,
	useAddProjectMutation,
	useEditProjectMutation,
	usePermanentlyDeleteProjectMutation,
} = projectsApi;

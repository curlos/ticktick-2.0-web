import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	arrayToObjectArrayByKey,
	arrayToObjectByKey,
	getObjectOfEachItemsParent,
	getObjectOfEachFocusRecordsParent,
} from '../utils/helpers.utils';

// Utility function to build query strings
export const buildQueryString = (params) => {
	return params ? new URLSearchParams(params).toString() : '';
};

// Define the API with tasks endpoints
export const baseAPI = createApi({
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
	tagTypes: ['Task', 'Project', 'FocusRecord', 'User', 'Comment', 'Tag', 'Filter', 'Matrix'],
	endpoints: (builder) => ({
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

		// Tags
		getTags: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/tags?${queryString}` : '/tags';
			},
			providesTags: ['Tag'],
			transformResponse: (response) => {
				const tags = response;
				const tagsById = arrayToObjectByKey(tags, '_id');
				// Tells us the parent id of a task (if it has any)
				const parentOfTags = getObjectOfEachItemsParent(tags);
				const tagsWithNoParent = tags.filter((tag) => {
					const hasParentTag = parentOfTags[tag._id];
					return !hasParentTag;
				});

				return { tags, tagsById, tagsWithNoParent, parentOfTags };
			},
		}),
		addTag: builder.mutation({
			query: (payload) => {
				const url = '/tags/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: ['Tag'],
		}),
		editTag: builder.mutation({
			query: ({ tagId, payload }) => ({
				url: `/tags/edit/${tagId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, tagId) => ['Tag'],
		}),
		permanentlyDeleteTag: builder.mutation({
			query: ({ tagId }) => ({
				url: `/tags/delete/${tagId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Tag', 'Task'],
		}),

		// Filters
		getFilters: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/filters?${queryString}` : '/filters';
			},
			providesTags: ['Filter'],
			transformResponse: (response) => {
				const filters = response;
				const filtersById = arrayToObjectByKey(filters, '_id');

				return { filters, filtersById };
			},
		}),
		addFilter: builder.mutation({
			query: (payload) => {
				const url = '/filters/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: (result, error) => (error ? [] : ['Filter']),
		}),
		editFilter: builder.mutation({
			query: ({ filterId, payload }) => ({
				url: `/filters/edit/${filterId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error) => (error ? [] : ['Filter']),
		}),
		permanentlyDeleteFilter: builder.mutation({
			query: ({ filterId }) => ({
				url: `/filters/delete/${filterId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Filter'],
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
	// Comments
	useGetCommentsQuery,
	useAddCommentMutation,
	useEditCommentMutation,
	usePermanentlyDeleteCommentMutation,

	// Tags
	useGetTagsQuery,
	useAddTagMutation,
	useEditTagMutation,
	usePermanentlyDeleteTagMutation,

	// Filters
	useGetFiltersQuery,
	useAddFilterMutation,
	useEditFilterMutation,
	usePermanentlyDeleteFilterMutation,

	// Matrices
	useGetMatricesQuery,
	useEditMatrixMutation,

	// TODO: Add tags
} = baseAPI;

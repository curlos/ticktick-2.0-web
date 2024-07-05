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

import { arrayToObjectByKey } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const filtersApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
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
	}),
});

export const { useGetFiltersQuery, useAddFilterMutation, useEditFilterMutation, usePermanentlyDeleteFilterMutation } =
	filtersApi;

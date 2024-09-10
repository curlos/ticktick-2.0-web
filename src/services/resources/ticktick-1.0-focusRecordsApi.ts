import { arrayToObjectByKey } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const tickTickFocusRecordsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getTickTickFocusRecordsRealTime: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `//ticktick-1.0/focus-records?${queryString}` : '/ticktick-1.0/focus-records';
			},
			transformResponse: (response) => {
				const focusRecordsById = arrayToObjectByKey(response, '_id');

				return { focusRecords: response, focusRecordsById };
			},
		}),
	}),
});

export const { useGetTickTickFocusRecordsRealTimeQuery } = tickTickFocusRecordsApi;

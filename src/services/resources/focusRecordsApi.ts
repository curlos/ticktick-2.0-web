import { groupByEndTimeDay, sortArrayByEndTime } from '../../utils/date.utils';
import {
	arrayToObjectArrayByKey,
	arrayToObjectByKey,
	getObjectOfEachFocusRecordsParent,
} from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const focusRecordsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
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
				const focusRecordsWithNoParent = focusRecords.filter((record) => !parentOfFocusRecords[record._id]);

				const groupedFocusRecords = groupByEndTimeDay(focusRecordsWithNoParent);

				const sortedGroupedFocusRecordsAsc = {};

				Object.keys(groupedFocusRecords).map((day, index) => {
					const focusRecordsForTheDay = groupedFocusRecords[day];
					const sortedFocusRecordsForTheDay = sortArrayByEndTime(focusRecordsForTheDay, 'ascending');
					sortedGroupedFocusRecordsAsc[day] = sortedFocusRecordsForTheDay;
				});

				return {
					focusRecords,
					focusRecordsByTaskId,
					focusRecordsById,
					parentOfFocusRecords,
					groupedFocusRecords,
					sortedGroupedFocusRecordsAsc,
				};
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
	}),
});

export const {
	useGetFocusRecordsQuery,
	useAddFocusRecordMutation,
	useEditFocusRecordMutation,
	usePermanentlyDeleteFocusRecordMutation,
	useBulkAddFocusRecordsMutation,
} = focusRecordsApi;

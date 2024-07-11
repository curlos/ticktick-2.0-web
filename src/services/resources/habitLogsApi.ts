import { arrayToObjectByKey } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const habitLogsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getHabitLog: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/habit-logs?${queryString}` : '/habit-logs';
			},
			providesTags: ['HabitLog'],
			transformResponse: (response) => {
				const habitLogs = response;
				const habitLogsById = arrayToObjectByKey(habitLogs, '_id');

				return { habitLogs, habitLogsById };
			},
		}),
		addHabitLog: builder.mutation({
			query: ({ habitLogPayload, habitId, checkedInDayKey }) => {
				const url = '/habit-logs/add';
				return {
					url,
					method: 'POST',
					body: { habitLogPayload, habitId, checkedInDayKey },
				};
			},
			invalidatesTags: ['HabitLog', 'Habit'],
		}),
		editHabitLog: builder.mutation({
			query: ({ habitSectionId, payload }) => ({
				url: `/habit-logs/edit/${habitSectionId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, habitSectionId) => ['HabitLog', 'Habit'],
		}),
		permanentlyDeleteHabitLog: builder.mutation({
			query: ({ habitSectionId }) => ({
				url: `/habit-logs/delete/${habitSectionId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['HabitLog', 'Habit'],
		}),
	}),
});

export const {
	useGetHabitLogQuery,
	useAddHabitLogMutation,
	useEditHabitLogMutation,
	usePermanentlyDeleteHabitLogMutation,
} = habitLogsApi;

import { arrayToObjectByKey } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';
import { habitsApi } from './habitsApi';

export const habitLogsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getHabitLogs: builder.query({
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
			query: (payload) => {
				const url = '/habit-logs/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: ['HabitLog', 'Habit'],
		}),
		editHabitLog: builder.mutation({
			query: ({ habitLogId, habitLogPayload }) => ({
				url: `/habit-logs/edit/${habitLogId}`,
				method: 'PUT',
				body: { ...habitLogPayload },
			}),
			invalidatesTags: (result, error, habitLogId) => ['HabitLog', 'Habit'],
		}),
		permanentlyDeleteHabitLog: builder.mutation({
			query: (habitLogId) => ({
				url: `/habit-logs/delete/${habitLogId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['HabitLog', 'Habit'],
			onQueryStarted: async (habitLogId, { dispatch, queryFulfilled, getState }) => {
				const state = getState();
				const cachedGetHabitLogsData = habitLogsApi.endpoints.getHabitLogs.select()(state).data;
				const { habitLogsById } = cachedGetHabitLogsData;
				const habitLogToDelete = habitLogsById[habitLogId];

				const patchResultHabitLogs = dispatch(
					habitLogsApi.util.updateQueryData('getHabitLogs', undefined, (draft) => {
						// Remove the habit log from the list and map
						if (draft.habitLogsById[habitLogId]) {
							delete draft.habitLogsById[habitLogId];
							const index = draft.habitLogs.findIndex((hl) => hl._id === habitLogId);
							if (index !== -1) {
								draft.habitLogs.splice(index, 1);
							}
						}
					})
				);

				const patchResultHabits = dispatch(
					habitsApi.util.updateQueryData('getHabits', undefined, (draft) => {
						const { habitId, checkedInDayKey } = habitLogToDelete;
						const { habitsById } = draft;
						const habitToEdit = habitsById[habitId];

						if (habitToEdit.checkedInDays[checkedInDayKey]) {
							habitToEdit.checkedInDays[checkedInDayKey].habitLogId = null;
						}
					})
				);

				try {
					await queryFulfilled;
				} catch (error) {
					// If the deletion fails, rollback the optimistic update
					patchResultHabitLogs.undo();
					patchResultHabits.undo();
					console.error('Deletion failed:', error);
				}
			},
		}),
	}),
});

export const {
	useGetHabitLogsQuery,
	useAddHabitLogMutation,
	useEditHabitLogMutation,
	usePermanentlyDeleteHabitLogMutation,
} = habitLogsApi;

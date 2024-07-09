import { arrayToObjectByKey } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const habitsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getHabits: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/habits?${queryString}` : '/habits';
			},
			providesTags: ['Habit'],
			transformResponse: (response) => {
				const habits = response;
				const habitsById = arrayToObjectByKey(habits, '_id');

				return { habits, habitsById };
			},
		}),
		addHabit: builder.mutation({
			query: (payload) => {
				const url = '/habits/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: ['Habit', 'HabitSection'],
		}),
		editHabit: builder.mutation({
			query: ({ habitId, payload }) => ({
				url: `/habits/edit/${habitId}`,
				method: 'PUT',
				body: payload,
			}),
			// Adding optimistic update logic
			// Adding optimistic update logic
			onQueryStarted: async ({ habitId, payload }, { dispatch, queryFulfilled, getState }) => {
				// Optimistically update the cache
				const patchResult = dispatch(
					habitsApi.util.updateQueryData('getHabits', undefined, (draft) => {
						const habit = draft.habitsById[habitId];
						if (habit) {
							// Overwrite habit properties with those from payload
							// This will update habit with all the properties from payload
							// Existing properties in habit that are also in the payload will be overwritten
							Object.assign(habit, payload);
						}
					})
				);

				try {
					// Wait for the mutation to resolve
					await queryFulfilled;
				} catch {
					// If the mutation fails, undo the optimistic update
					patchResult.undo();
				}
			},
			invalidatesTags: (result, error, habitId) => ['Habit', 'HabitSection'],
		}),
		flagHabit: builder.mutation({
			query: ({ habitId, property, value }) => ({
				url: `/habits/flag/${habitId}`,
				method: 'PATCH',
				body: {
					property: property,
					value: value,
				},
			}),
			invalidatesTags: ['Habit', 'HabitSection'],
		}),
		permanentlyDeleteHabit: builder.mutation({
			query: ({ habitId }) => ({
				url: `/habits/delete/${habitId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Habit'],
		}),
	}),
});

export const {
	useGetHabitsQuery,
	useAddHabitMutation,
	useEditHabitMutation,
	useFlagHabitMutation,
	usePermanentlyDeleteHabitMutation,
} = habitsApi;

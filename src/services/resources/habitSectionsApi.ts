import { arrayToObjectByKey } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const habitsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getHabitSections: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/habit-sections?${queryString}` : '/habit-sections';
			},
			providesTags: ['HabitSection'],
			transformResponse: (response) => {
				const habitSections = response;
				const habitSectionsById = arrayToObjectByKey(habitSections, '_id');

				return { habitSections, habitSectionsById };
			},
		}),
		addHabitSection: builder.mutation({
			query: (payload) => {
				const url = '/habit-sections/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: ['HabitSection'],
		}),
		editHabitSection: builder.mutation({
			query: ({ habitSectionId, payload }) => ({
				url: `/habit-sections/edit/${habitSectionId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, habitSectionId) => ['HabitSection', 'Habit'],
		}),
		permanentlyDeleteHabitSection: builder.mutation({
			query: ({ habitSectionId }) => ({
				url: `/habit-sections/delete/${habitSectionId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['HabitSection', 'Habit'],
		}),
	}),
});

export const {
	useGetHabitSectionsQuery,
	useAddHabitSectionMutation,
	useEditHabitSectionMutation,
	usePermanentlyDeleteHabitSectionMutation,
} = habitsApi;

import { baseAPI } from '../api';

export const userSettingsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getUserSettings: builder.query({
			query: () => {
				return `/user-settings`;
			},
			providesTags: ['UserSettings'],
			transformResponse: (response) => {
				const userSettings = response;
				return { userSettings };
			},
		}),
		editUserSettings: builder.mutation({
			query: (payload) => ({
				url: `/user-settings/edit`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, userId) => ['UserSettings'],
		}),
	}),
});

export const { useGetUserSettingsQuery, useEditUserSettingsMutation } = userSettingsApi;

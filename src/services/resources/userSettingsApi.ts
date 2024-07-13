import { baseAPI } from '../api';

export const tagsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getUserSettings: builder.query({
			query: ({ userId }) => {
				return `/user-settings/${userId}`;
			},
			providesTags: ['UserSettings'],
			transformResponse: (response) => {
				const userSettings = response;
				return { userSettings };
			},
		}),
		editUserSettings: builder.mutation({
			query: ({ userId, payload }) => ({
				url: `/user-settings/edit/${userId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, userId) => ['UserSettings'],
		}),
	}),
});

export const { useGetUserSettingsQuery, useEditUserSettingsMutation } = tagsApi;

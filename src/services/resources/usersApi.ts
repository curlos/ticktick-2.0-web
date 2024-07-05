import { loginUserSuccess } from '../../slices/userSlice';
import { arrayToObjectByKey } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const usersApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		// Users
		getUsers: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/users?${queryString}` : '/users';
			},
			providesTags: ['User'],
			transformResponse: (response) => {
				const usersById = arrayToObjectByKey(response, '_id');

				return { users: response, usersById };
			},
		}),
		getLoggedInUser: builder.query({
			query: () => '/users/logged-in',
		}),
		registerUser: builder.mutation({
			query: (userDetails) => ({
				url: '/users/register',
				method: 'POST',
				body: userDetails,
			}),
			transformResponse: (response, meta, arg) => {
				return response;
			},
			// Handle side effects or update the cache after successful registration
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled;
					localStorage.setItem('token', data.token);
				} catch (error) {
					console.error('Registration failed:', error);
				}
			},
			invalidatesTags: ['User'],
		}),
		loginUser: builder.mutation({
			query: (credentials) => ({
				url: '/users/login',
				method: 'POST',
				body: credentials,
			}),
			transformResponse: (response, meta, arg) => {
				return response;
			},
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled;
					dispatch(loginUserSuccess(data)); // Update user slice state on successful login
				} catch (error) {
					console.error('Login failed:', error);
				}
			},
			invalidatesTags: (result, error) => (error ? [] : ['Task', 'Project', 'FocusRecord']),
		}),
	}),
});

export const { useGetUsersQuery, useGetLoggedInUserQuery, useRegisterUserMutation, useLoginUserMutation } = usersApi;

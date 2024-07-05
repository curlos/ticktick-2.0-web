import { arrayToObjectArrayByKey } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const commentsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getComments: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/comments?${queryString}` : '/comments';
			},
			providesTags: ['Comment'],
			transformResponse: (response) => {
				const comments = response;
				const commentsByTaskId = arrayToObjectArrayByKey(comments, 'taskId');

				return { comments, commentsByTaskId };
			},
		}),
		addComment: builder.mutation({
			query: (payload) => {
				const url = '/comments/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: ['Comment'],
		}),
		editComment: builder.mutation({
			query: ({ commentId, payload }) => ({
				url: `/comments/edit/${commentId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, commentId) => ['Comment'],
		}),
		permanentlyDeleteComment: builder.mutation({
			query: (commentId) => ({
				url: `/comments/delete/${commentId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Comment'],
		}),
	}),
});

export const {
	useGetCommentsQuery,
	useAddCommentMutation,
	useEditCommentMutation,
	usePermanentlyDeleteCommentMutation,
} = commentsApi;

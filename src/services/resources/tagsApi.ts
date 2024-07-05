import { arrayToObjectByKey, getObjectOfEachItemsParent } from '../../utils/helpers.utils';
import { baseAPI, buildQueryString } from '../api';

export const tagsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getTags: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/tags?${queryString}` : '/tags';
			},
			providesTags: ['Tag'],
			transformResponse: (response) => {
				const tags = response;
				const tagsById = arrayToObjectByKey(tags, '_id');
				// Tells us the parent id of a task (if it has any)
				const parentOfTags = getObjectOfEachItemsParent(tags);
				const tagsWithNoParent = tags.filter((tag) => {
					const hasParentTag = parentOfTags[tag._id];
					return !hasParentTag;
				});

				return { tags, tagsById, tagsWithNoParent, parentOfTags };
			},
		}),
		addTag: builder.mutation({
			query: (payload) => {
				const url = '/tags/add';
				return {
					url,
					method: 'POST',
					body: payload,
				};
			},
			invalidatesTags: ['Tag'],
		}),
		editTag: builder.mutation({
			query: ({ tagId, payload }) => ({
				url: `/tags/edit/${tagId}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: (result, error, tagId) => ['Tag'],
		}),
		permanentlyDeleteTag: builder.mutation({
			query: ({ tagId }) => ({
				url: `/tags/delete/${tagId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Tag', 'Task'],
		}),
	}),
});

export const { useGetTagsQuery, useAddTagMutation, useEditTagMutation, usePermanentlyDeleteTagMutation } = tagsApi;

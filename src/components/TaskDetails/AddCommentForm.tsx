import TextareaAutosize from 'react-textarea-autosize';
import { useGetLoggedInUserQuery } from '../../services/resources/usersApi';
import { useAddCommentMutation, useEditCommentMutation } from '../../services/resources/commentsApi';

const AddCommentForm = ({
	showAddCommentInput,
	setShowAddCommentInput,
	currentComment,
	setCurrentComment,
	taskId,
	commentToEdit,
	setCommentToEdit,
}) => {
	const {
		data: loggedInUser,
		error: errorLoggedInUser,
		isLoading: isLoadingLoggedInUser,
	} = useGetLoggedInUserQuery();

	const [addComment] = useAddCommentMutation();
	const [editComment] = useEditCommentMutation();

	return (
		showAddCommentInput && (
			<div className="p-4 border-t border-b border-color-gray-200">
				<TextareaAutosize
					className="placeholder-color-gray-100 bg-color-gray-300 p-[10px] rounded-md w-full outline-none border border-transparent focus:border-blue-500 resize-none max-h-[300px] gray-scrollbar overflow-auto"
					placeholder="Write a comment"
					value={currentComment}
					onChange={(e) => setCurrentComment(e.target.value)}
				></TextareaAutosize>

				<div className="flex justify-end items-center gap-2">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setShowAddCommentInput(false);
						}}
						className="border border-color-gray-200 px-4 py-1 mt-2 rounded hover:bg-color-gray-200 disabled:opacity-50 cursor-pointer"
					>
						Cancel
					</button>

					<button
						type="submit"
						disabled={!currentComment || !loggedInUser}
						onClick={() => {
							if (loggedInUser) {
								const payload = {
									taskId,
									authorId: loggedInUser._id,
									content: currentComment,
								};

								if (commentToEdit) {
									// Edit comment
									editComment({ commentId: commentToEdit._id, payload });
								} else {
									// Add comment
									addComment(payload);
								}

								setCurrentComment('');
								setCommentToEdit(null);
							}
						}}
						className="border border-transparent bg-blue-500 px-4 py-1 mt-2 rounded hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
					>
						{commentToEdit ? 'Edit' : 'Add'}
					</button>
				</div>
			</div>
		)
	);
};

export default AddCommentForm;

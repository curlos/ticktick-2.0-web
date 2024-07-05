import { usePermanentlyDeleteCommentMutation } from '../../services/api';
import { useGetUsersQuery } from '../../services/resources/usersApi';
import Icon from '../Icon';

const CommentList = ({ taskComments, setCommentToEdit, setShowAddCommentInput, setCurrentComment }) => {
	// Users
	const { data: fetchedUsers, isLoading: isLoadingGetUsers, error: errorGetUsers } = useGetUsersQuery();
	const { users, usersById } = fetchedUsers || {};
	const [permanentlyDeleteComment] = usePermanentlyDeleteCommentMutation();

	if (!usersById || !taskComments || taskComments.length === 0) {
		return null;
	}

	const Comment = ({ comment }) => {
		const author = usersById[comment.authorId];
		const options = {
			year: 'numeric', // Full year
			month: 'long', // Full month name
			day: 'numeric', // Day of the month
			hour: 'numeric', // Hour (in 12-hour AM/PM format)
			minute: '2-digit', // Minute with leading zeros
			hour12: true, // Use AM/PM
		};
		const timeUpdated = new Date(comment.updatedAt).toLocaleString('en-US', options);

		return (
			<div className="flex">
				<div>
					<div className="rounded-full bg-black p-1 mb-3">
						<img src="/prestige-9-bo2.png" alt="user-icon" className="w-[32px] h-[32px] max-w-[none]" />
					</div>
				</div>

				<div className="ml-2 flex-1">
					<div className="flex justify-between items-center w-full">
						<div className="flex items-center gap-4 text-color-gray-100">
							<div>{author.nickname}</div>
							<div>{timeUpdated}</div>
						</div>

						<div>
							<Icon
								name="edit"
								customClass={
									'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
								}
								fill={0}
								onClick={() => {
									setCommentToEdit(comment);
									setShowAddCommentInput(true);
									setCurrentComment(comment.content);
								}}
							/>
							<Icon
								name="delete"
								customClass={
									'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
								}
								fill={0}
								onClick={() => {
									setCommentToEdit(null);
									permanentlyDeleteComment(comment._id);
								}}
							/>
						</div>
					</div>

					<div className="mt-2">{comment.content}</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-col justify-end">
			<div className="p-4 border-t border-color-gray-200 text-[13px] max-h-[200px] overflow-auto gray-scrollbar">
				<div className="mb-4 flex items-center gap-2 text-[14px]">
					<span>Comments</span>
					<span>{taskComments.length}</span>
				</div>

				<div className="space-y-6">
					{taskComments.map((comment) => (
						<Comment key={comment._id} comment={comment} />
					))}
				</div>
			</div>
		</div>
	);
};

export default CommentList;

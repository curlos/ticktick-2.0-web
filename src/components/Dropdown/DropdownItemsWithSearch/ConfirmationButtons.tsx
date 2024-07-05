import { useAddTagMutation } from '../../../services/api';
import { useEditTaskMutation } from '../../../services/resources/tasksApi';

const ConfirmationButtons = ({
	type,
	setIsVisible,
	filteredItems,
	selectedItemList,
	searchText,
	setSearchText,
	task,
}) => {
	const [editTask] = useEditTaskMutation();
	const [addTag] = useAddTagMutation();

	const noTagResults = type === 'tags' && filteredItems.length === 0;

	return (
		type === 'tags' && (
			<div className="grid grid-cols-2 gap-2 p-2 pt-4">
				<button
					className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200"
					onClick={() => {
						setIsVisible(false);
					}}
				>
					Cancel
				</button>
				<button
					disabled={filteredItems.length === 0 && type !== 'tags'}
					className="bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600"
					onClick={async () => {
						setIsVisible(false);
						const selectedItemListIds = selectedItemList.map((item) => item._id);

						// If there's no results upon searching for a tag, optionally allow the user to create the tag on the spot and then add to that task immediately.
						// TODO: This does work but it's possible to show search results of related tags even if they don't have the exact name the user needs. So, this needs to be refactored to check if NONE of the search results have the same name as the typed in text, then show the create button
						if (noTagResults) {
							// Create the tag first
							let newTag = {
								name: searchText,
								parentId: null,
								color: null,
							};

							const result = await addTag(newTag);
							const {
								data: { _id: newlyCreatedTagId },
							} = result;

							selectedItemListIds.push(newlyCreatedTagId);
						}

						if (task) {
							await editTask({ taskId: task._id, payload: { tagIds: selectedItemListIds } });
						}

						setSearchText('');
					}}
				>
					{noTagResults ? 'Create Tag' : 'Ok'}
				</button>
			</div>
		)
	);
};

export default ConfirmationButtons;

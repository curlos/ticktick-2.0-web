import { useState } from 'react';
import useHandleError from '../../hooks/useHandleError';
import { useAddTaskMutation } from '../../services/resources/tasksApi';
import ContextMenuGeneric from '../ContextMenu/ContextMenuGeneric';
import DropdownTaskDetails from './DropdownTaskDetails';

const DropdownAddNewTaskDetails = ({ contextMenuObj, defaultDueDate }) => {
	const { contextMenu, isDropdownVisible, setIsDropdownVisible, dropdownRef, handleClose } = contextMenuObj;

	const handleError = useHandleError();
	// RTK Query - Tasks
	const [addTask, { isLoading, error }] = useAddTaskMutation();

	const defaultNewTask = {
		dueDate: defaultDueDate || new Date(),
	};

	const [newTask, setNewTask] = useState(defaultNewTask);

	const handleAddTask = async () => {
		const { title, description, priority, projectId, dueDate } = newTask;

		if (!title) {
			return null;
		}

		const payload = {
			title,
			description,
			priority,
			projectId,
			dueDate,
		};

		handleError(async () => {
			await addTask({ payload }).unwrap();
		});

		setNewTask(defaultNewTask);
	};

	if (!contextMenu) {
		return null;
	}

	return (
		<ContextMenuGeneric
			xPos={contextMenu.xPos}
			yPos={contextMenu.yPos}
			onClose={() => {
				// Check if there's at least a title on the task and if there is, then make an API call to add that task to the backend.
				handleAddTask();

				// Close the context menu
				handleClose();
			}}
			isDropdownVisible={isDropdownVisible}
			setIsDropdownVisible={setIsDropdownVisible}
		>
			<DropdownTaskDetails
				toggleRef={dropdownRef}
				isVisible={true}
				setIsVisible={setIsDropdownVisible}
				customClasses=" !ml-[0px] mt-[15px]"
				customStyling={{
					position: 'absolute',
					top: `${contextMenu.yPos}px`,
					left: `${contextMenu.xPos}px`,
				}}
				onCloseContextMenu={handleClose}
				task={defaultNewTask}
				newTask={newTask}
				setNewTask={setNewTask}
				isForAddingNewTask={true}
			/>
		</ContextMenuGeneric>
	);
};

export default DropdownAddNewTaskDetails;

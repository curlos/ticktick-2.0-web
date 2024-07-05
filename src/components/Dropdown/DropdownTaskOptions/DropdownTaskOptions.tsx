import { useRef, useState } from 'react';
import { setModalState } from '../../../slices/modalSlice';
import Icon from '../../Icon';
import Dropdown from '../Dropdown';
import DropdownStartFocus from './DropdownStartFocus';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { DropdownProps, TaskObj } from '../../../interfaces/interfaces';
import { setAlertState } from '../../../slices/alertSlice';
import { useFlagTaskMutation, useGetTasksQuery } from '../../../services/resources/tasksApi';

interface DropdownTaskOptionsProps extends DropdownProps {
	setIsModalTaskActivitiesOpen: React.Dispatch<React.SetStateAction<boolean>>;
	task: TaskObj;
}

const DropdownTaskOptions: React.FC<DropdownTaskOptionsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	setIsModalTaskActivitiesOpen,
	task,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { projectId } = useParams();
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { parentOfTasks } = fetchedTasks || {};
	const [flagTask] = useFlagTaskMutation();
	const [isDropdownStartFocusVisible, setIsDropdownStartFocusVisible] = useState(false);

	const dropdownStartFocusRef = useRef(null);

	const handleDelete = () => {
		// Delete the task and then the redirect to the list of tasks in the project as the current task has been delete and thus the page is not accessible anymore.
		try {
			const isDeletedTime = new Date().toISOString();
			const parentId = parentOfTasks && parentOfTasks[task._id];
			flagTask({ taskId: task._id, parentId, property: 'isDeleted', value: isDeletedTime });
			setIsVisible(false);

			// Only show the alert if the task is about to be deleted and we want to give the user the option to undo the deletion.
			if (!task.isDeleted) {
				dispatch(
					setAlertState({
						alertId: 'AlertFlagged',
						isOpen: true,
						props: {
							task: task,
							parentId: parentId,
							flaggedPropertyName: 'isDeleted',
						},
					})
				);
			}

			if (!parentId) {
				navigate(`/projects/${projectId}/tasks`);
			} else {
				navigate(`/projects/${projectId}/tasks/${parentId}`);
			}
		} catch (error) {
			throw new Error(error);
		}
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'shadow-2xl border border-color-gray-200 rounded !mt-[-175px] ml-[-180px]'}
		>
			<div className="w-[232px] p-1 rounded text-[13px]" onClick={(e) => e.stopPropagation()}>
				<div
					className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer"
					onClick={() => {
						dispatch(
							setModalState({ modalId: 'ModalAddTaskForm', isOpen: true, props: { parentId: task._id } })
						);
					}}
				>
					<Icon
						name="add_task"
						customClass={
							'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
						}
						fill={0}
					/>
					<div>Add Subtask</div>
				</div>

				<div
					ref={dropdownStartFocusRef}
					className="p-1 flex justify-between items-center hover:bg-color-gray-300 cursor-pointer"
					onClick={() => setIsDropdownStartFocusVisible(!isDropdownStartFocusVisible)}
				>
					<div className="flex items-center gap-[2px]">
						<Icon
							name="timer"
							customClass={
								'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
							}
							fill={0}
						/>
						<div>Start Focus</div>
					</div>

					<Icon
						name="chevron_right"
						customClass={
							'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
						}
						fill={0}
					/>
				</div>

				{/* Side Dropdown */}
				<DropdownStartFocus
					toggleRef={dropdownStartFocusRef}
					isVisible={isDropdownStartFocusVisible}
					setIsVisible={setIsDropdownStartFocusVisible}
				/>

				<div
					className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer"
					onClick={() => {
						setIsModalTaskActivitiesOpen(true);
						setIsVisible(false);
					}}
				>
					<Icon
						name="timeline"
						customClass={
							'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer mb-[-2px]'
						}
						fill={0}
					/>
					<div>Task Activities</div>
				</div>

				<div
					className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer"
					onClick={handleDelete}
				>
					<Icon
						name="delete"
						customClass={
							'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
						}
						fill={0}
					/>
					<div>Delete</div>
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownTaskOptions;

import Dropdown from '../Dropdown';
import { useEffect, useRef, useState } from 'react';
import Icon from '../../Icon';
import { DropdownProps, TaskObj } from '../../../interfaces/interfaces';
import { useGetTagsQuery } from '../../../services/api';
import { PRIORITIES } from '../../../utils/priorities.utils';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../../slices/modalSlice';
import { setAlertState } from '../../../slices/alertSlice';
import DropdownStartFocus from '../DropdownTaskOptions/DropdownStartFocus';
import DropdownItemsWithSearch from '../DropdownItemsWithSearch/DropdownItemsWithSearch';
import DateIconOptionList from './DateIconOptionList';
import TaskAction from './TaskAction';
import { useEditTaskMutation, useFlagTaskMutation, useGetTasksQuery } from '../../../services/resources/tasksApi';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';

interface DropdownTaskActionsProps extends DropdownProps {
	onCloseContextMenu: () => void;
}

const DropdownTaskActions: React.FC<DropdownTaskActionsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	customStyling,
	onCloseContextMenu,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { taskId, projectId } = useParams();

	// RTK Query - Tasks
	const { data: fetchedTasks, isLoading: isTasksLoading, error } = useGetTasksQuery();
	const { tasks, tasksById, parentOfTasks } = fetchedTasks || {};
	const [editTask] = useEditTaskMutation();
	const [flagTask] = useFlagTaskMutation();

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isProjectsLoading, error: errorProjects } = useGetProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tags, tagsById, tagsWithNoParent } = fetchedTags || {};

	// useState
	const [task, setTask] = useState<TaskObj>();
	const [parentTask, setParentTask] = useState<TaskObj>();
	const [currDueDate, setCurrDueDate] = useState(null);
	const [priority, setPriority] = useState(0);
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedTagList, setSelectedTagList] = useState([]);

	// Dropdowns
	const [isDropdownStartFocusVisible, setIsDropdownStartFocusVisible] = useState(false);
	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const [isDropdownItemsWithSearchTagVisible, setIsDropdownItemsWithSearchTagVisible] = useState(false);

	// Refs
	const dropdownStartFocusRef = useRef(null);
	const dropdownProjectsRef = useRef(null);
	const dropdownItemsWithSearchTagRef = useRef(null);

	useEffect(() => {
		if (isTasksLoading || isProjectsLoading || isLoadingGetTags) {
			return;
		}

		const currTask = taskId && tasksById && tasksById[taskId];
		setTask(currTask);

		if (currTask) {
			if (currTask.dueDate) {
				setCurrDueDate(new Date(currTask.dueDate));
			} else {
				setCurrDueDate(null);
			}

			setPriority(currTask.priority);

			if (projectsById && currTask.projectId) {
				setSelectedProject(projectsById[currTask.projectId]);
			}

			if (currTask.tagIds && currTask.tagIds.length > 0) {
				const newSelectedTagList = currTask.tagIds.map((tagId) => tagsById[tagId]);
				setSelectedTagList(newSelectedTagList);
			}

			const parentTaskId = parentOfTasks[currTask._id];
			const newParentTask = parentTaskId && tasksById[parentTaskId];

			if (newParentTask) {
				setParentTask(newParentTask);
			} else {
				setParentTask(null);
			}
		}
	}, [taskId, tasks, tasksById]);

	const handleEditDate = (newDueDate: Date | null) => {
		setCurrDueDate(newDueDate);
		editTask({ taskId: task._id, payload: { dueDate: newDueDate } });
		onCloseContextMenu();
	};

	if (!task) {
		return null;
	}

	function copyTextToClipboard(text) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				// console.log('Text copied to clipboard ' + text);
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
	}

	const PriorityFlag = ({ priorityName }) => {
		const priorityObj = PRIORITIES[priorityName];

		return (
			<span key={priorityObj.backendValue}>
				<Icon
					name="flag"
					customClass={classNames(
						'!text-[22px] cursor-pointer p-1 rounded',
						priorityObj.textFlagColor,
						priority === priorityObj.backendValue ? 'bg-gray-700' : ''
					)}
					onClick={() => {
						editTask({
							taskId: task._id,
							payload: { priority: priorityObj.backendValue },
						});
						onCloseContextMenu();
					}}
				/>
			</span>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl', customClasses)}
			customStyling={customStyling ? customStyling : null}
		>
			<div className="w-[200px]">
				<div className="p-4 pb-0">
					Date
					<DateIconOptionList
						dueDate={currDueDate}
						setDueDate={setCurrDueDate}
						handleEditDate={handleEditDate}
						task={task}
						onCloseContextMenu={onCloseContextMenu}
					/>
				</div>

				<div className="p-4 pt-0">
					Priority
					<div className="flex justify-between items-center gap-1 mt-2">
						<PriorityFlag priorityName="high" />
						<PriorityFlag priorityName="medium" />
						<PriorityFlag priorityName="low" />
						<PriorityFlag priorityName="none" />
					</div>
				</div>

				<hr className="border-color-gray-200" />

				<div className="p-1">
					<TaskAction
						iconName="add_task"
						title="Add Subtask"
						onClick={() => {
							dispatch(
								setModalState({
									modalId: 'ModalAddTaskForm',
									isOpen: true,
									props: {
										parentId: task._id,
									},
								})
							);
							// TODO: Don't close the context menu for now but may need to be investigated.
							onCloseContextMenu();
						}}
					/>

					<TaskAction
						iconName={task?.willNotDo ? 'undo' : 'disabled_by_default'}
						title={task?.willNotDo ? 'Reopen' : "Won't Do"}
						onClick={() => {
							const willNotDoTime = new Date().toISOString();

							const parentId = parentOfTasks && parentOfTasks[task._id];
							flagTask({
								taskId: task._id,
								parentId,
								property: 'willNotDo',
								value: !task.willNotDo ? willNotDoTime : null,
							});
							onCloseContextMenu();

							// Only show the alert if the task is about to be deleted and we want to give the user the option to undo the deletion.
							if (!task.willNotDo) {
								dispatch(
									setAlertState({
										alertId: 'AlertFlagged',
										isOpen: true,
										props: {
											task: task,
											parentId: parentId,
											flaggedPropertyName: 'willNotDo',
										},
									})
								);
							}

							if (!parentId) {
								navigate(`/projects/${projectId}/tasks`);
							} else {
								navigate(`/projects/${projectId}/tasks/${parentId}`);
							}

							if (!parentId) {
								navigate(`/projects/${projectId}/tasks`);
							} else {
								navigate(`/projects/${projectId}/tasks/${parentId}`);
							}
						}}
					/>

					<div className="relative">
						<TaskAction
							toggleRef={dropdownProjectsRef}
							iconName="move_to_inbox"
							title="Move to"
							onClick={() => setIsDropdownProjectsVisible(!isDropdownProjectsVisible)}
							hasSideDropdown={true}
						/>

						{/* Side Dropdown */}
						<DropdownItemsWithSearch
							toggleRef={dropdownProjectsRef}
							isVisible={isDropdownProjectsVisible}
							setIsVisible={setIsDropdownProjectsVisible}
							selectedItem={selectedProject}
							setSelectedItem={setSelectedProject}
							items={projects}
							task={task}
							type="project"
							customClasses="ml-[200px] mt-[-30px]"
							onCloseContextMenu={onCloseContextMenu}
						/>
					</div>
					<div className="relative">
						<TaskAction
							toggleRef={dropdownProjectsRef}
							iconName="sell"
							title="Tags"
							onClick={() => setIsDropdownItemsWithSearchTagVisible(!isDropdownItemsWithSearchTagVisible)}
							hasSideDropdown={true}
						/>

						{/* Side Dropdown */}
						<DropdownItemsWithSearch
							toggleRef={dropdownItemsWithSearchTagRef}
							isVisible={isDropdownItemsWithSearchTagVisible}
							setIsVisible={setIsDropdownItemsWithSearchTagVisible}
							selectedItemList={selectedTagList}
							setSelectedItemList={setSelectedTagList}
							items={tagsWithNoParent}
							task={task}
							multiSelect={true}
							type="tags"
							customClasses="ml-[200px] mt-[-30px]"
							onCloseContextMenu={onCloseContextMenu}
						/>
					</div>
				</div>

				<hr className="border-color-gray-200" />

				<div className="p-1">
					<TaskAction
						toggleRef={dropdownStartFocusRef}
						iconName="timer"
						title="Start Focus"
						onClick={() => setIsDropdownStartFocusVisible(!isDropdownStartFocusVisible)}
						hasSideDropdown={true}
					/>
				</div>

				{/* Side Dropdown */}
				<DropdownStartFocus
					toggleRef={dropdownStartFocusRef}
					isVisible={isDropdownStartFocusVisible}
					setIsVisible={setIsDropdownStartFocusVisible}
					customClasses="ml-[205px] mt-[-42px]"
					dropdownEstimationCustomClasses="ml-[0px]"
				/>

				<hr className="border-color-gray-200" />

				<div className="p-1">
					<TaskAction
						iconName="link"
						title="Copy Link"
						onClick={() => {
							copyTextToClipboard(window.location.href);
							onCloseContextMenu();
							dispatch(
								setAlertState({
									alertId: 'AlertGeneralMessage',
									isOpen: true,
									props: { message: 'Copied!' },
								})
							);
						}}
					/>
					<TaskAction
						iconName={task.isDeleted ? 'restore_from_trash' : 'delete'}
						title={task.isDeleted ? 'Restore' : 'Delete'}
						onClick={() => {
							const isDeletedTime = new Date().toISOString();
							const parentId = parentOfTasks && parentOfTasks[task._id];

							flagTask({
								taskId: task._id,
								parentId,
								property: 'isDeleted',
								value: task.isDeleted ? null : isDeletedTime,
							});
							onCloseContextMenu();

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
						}}
					/>
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownTaskActions;

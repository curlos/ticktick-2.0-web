import Dropdown from './Dropdown';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import { DropdownProps, TaskObj } from '../../interfaces/interfaces';
import { useEditTaskMutation, useGetProjectsQuery, useGetTasksQuery, useFlagTaskMutation } from '../../services/api';
import { PRIORITIES } from '../../utils/priorities.utils';
import classNames from 'classnames';
import { isInXDaysUTC, isTodayUTC, isTomorrowUTC } from '../../utils/date.utils';
import DropdownCalendar from './DropdownCalendar/DropdownCalendar';
import { useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import { setAlertState } from '../../slices/alertSlice';
import DropdownStartFocus from './DropdownTaskOptions/DropdownStartFocus';
import DropdownProjects from './DropdownProjects';

interface IDateIconOption {
	iconName: string;
	tooltipText: string;
	selected: boolean;
	onClick?: () => void;
	task: TaskObj;
	dueDate: Date | null;
	setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
	showDropdownCalendar?: boolean;
	onCloseContextMenu?: () => void;
}

const DateIconOption: React.FC<IDateIconOption> = ({
	iconName,
	tooltipText,
	selected,
	onClick,
	task,
	dueDate,
	setDueDate,
	showDropdownCalendar,
	onCloseContextMenu,
}) => {
	// useState
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);
	const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);

	// useRef
	const tooltipRef = useRef(null);
	const dropdownCalendarToggleRef = useRef(null);

	useEffect(() => {
		setIsDropdownCalendarVisible(false);
	}, [task]);

	const handleOnClick = () => {
		if (onClick && tooltipText !== 'Custom') {
			onClick();
		}

		// TODO: Add functionality for "Custom" icon.
		setIsDropdownCalendarVisible(!isDropdownCalendarVisible);
	};

	const mergeRefs = (...refs) => {
		const filteredRefs = refs.filter(Boolean);
		return (inst) => {
			for (const ref of filteredRefs) {
				if (typeof ref === 'function') {
					ref(inst);
				} else if (ref) {
					ref.current = inst;
				}
			}
		};
	};

	const combinedRef = useCallback(mergeRefs(tooltipRef, dropdownCalendarToggleRef), []);

	return (
		<div className={classNames('relative')}>
			<Icon
				toggleRef={combinedRef}
				name={iconName}
				fill={0}
				customClass={classNames(
					'text-color-gray-50 !text-[22px] hover:text-white hover:bg-color-gray-200 rounded cursor-pointer p-1',
					selected ? 'bg-gray-700' : ''
				)}
				onClick={handleOnClick}
				onMouseOver={() => setIsTooltipVisible(true)}
				onMouseLeave={() => setIsTooltipVisible(false)}
			/>
			<Dropdown
				toggleRef={tooltipRef}
				isVisible={isTooltipVisible}
				setIsVisible={setIsTooltipVisible}
				customClasses={'!bg-black'}
			>
				<div className="p-2 text-[12px] text-nowrap">{tooltipText}</div>
			</Dropdown>

			{showDropdownCalendar && (
				<DropdownCalendar
					toggleRef={dropdownCalendarToggleRef}
					isVisible={isDropdownCalendarVisible}
					setIsVisible={setIsDropdownCalendarVisible}
					task={task}
					currDueDate={dueDate}
					setCurrDueDate={setDueDate}
					customClasses=" !ml-[0px] mt-[15px]"
					showDateIcons={false}
					onCloseContextMenu={onCloseContextMenu}
				/>
			)}
		</div>
	);
};

interface IDateIconOptionList {
	dueDate: Date | null;
	setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
	handleEditDate: (dateToEdit: Date | null) => void;
	task: TaskObj;
	onCloseContextMenu?: () => void;
}

const DateIconOptionList: React.FC<IDateIconOptionList> = ({
	dueDate,
	setDueDate,
	handleEditDate,
	task,
	onCloseContextMenu,
}) => {
	const today = new Date();

	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const sevenDaysFromNow = new Date(today);
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

	const isDueDateToday = isTodayUTC(dueDate);
	const isDueDateTomorrow = isTomorrowUTC(dueDate);
	const isDueDateIn7Days = isInXDaysUTC(dueDate, 7);

	return (
		<div className="flex justify-between items-center gap-1 my-2">
			<DateIconOption
				iconName="sunny"
				tooltipText="Today"
				selected={isDueDateToday}
				onClick={() => handleEditDate(today)}
				task={task}
			/>
			<DateIconOption
				iconName="wb_twilight"
				tooltipText="Tomorrow"
				selected={isDueDateTomorrow}
				onClick={() => handleEditDate(tomorrow)}
				task={task}
			/>
			<DateIconOption
				iconName="event_upcoming"
				tooltipText="Next Week"
				selected={isDueDateIn7Days}
				onClick={() => handleEditDate(sevenDaysFromNow)}
				task={task}
			/>
			<DateIconOption
				iconName="calendar_month"
				tooltipText="Custom"
				task={task}
				dueDate={dueDate}
				setDueDate={setDueDate}
				showDropdownCalendar={true}
				onCloseContextMenu={onCloseContextMenu}
			/>
			{dueDate && (
				<DateIconOption
					iconName="event_busy"
					tooltipText="Clear"
					onClick={() => {
						handleEditDate(null);
					}}
					task={task}
				/>
			)}
		</div>
	);
};

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

	// useState
	const [task, setTask] = useState<TaskObj>();
	const [parentTask, setParentTask] = useState<TaskObj>();
	const [currDueDate, setCurrDueDate] = useState(null);
	const [priority, setPriority] = useState(0);
	const [selectedProject, setSelectedProject] = useState(null);

	// Dropdowns
	const [isDropdownStartFocusVisible, setIsDropdownStartFocusVisible] = useState(false);
	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);

	// Refs
	const dropdownStartFocusRef = useRef(null);
	const dropdownProjectsRef = useRef(null);

	useEffect(() => {
		if (isTasksLoading) {
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

	interface ITaskAction {
		toggleRef?: React.MutableRefObject<null>;
		iconName: string;
		title: string;
		onClick: () => void;
	}

	const TaskAction: React.FC<ITaskAction> = ({ toggleRef, iconName, title, onClick, hasSideDropdown }) => {
		return (
			<div
				ref={toggleRef ? toggleRef : null}
				className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer rounded text-[13px]"
				onClick={onClick}
			>
				<Icon
					name={iconName}
					customClass={'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'}
					fill={0}
				/>
				<div>{title}</div>

				{hasSideDropdown && (
					<div className="flex-1 flex justify-end items-center">
						<Icon
							name="chevron_right"
							customClass={
								'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
							}
							fill={0}
						/>
					</div>
				)}
			</div>
		);
	};

	if (!task) {
		return null;
	}

	function copyTextToClipboard(text) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log('Text copied to clipboard ' + text);
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
	}

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
						{Object.values(PRIORITIES).map((priorityObj) => {
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
						})}
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
						iconName="disabled_by_default"
						title={task?.willNotDo ? 'Reopen' : "Won't Do"}
						onClick={() => {
							const willNotDoTime = new Date().toISOString();

							const parentId = parentOfTasks && parentOfTasks[task._id];
							flagTask({ taskId: task._id, parentId, property: 'willNotDo', value: willNotDoTime });
							onCloseContextMenu();

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
						<DropdownProjects
							toggleRef={dropdownProjectsRef}
							isVisible={isDropdownProjectsVisible}
							setIsVisible={setIsDropdownProjectsVisible}
							selectedProject={selectedProject}
							setSelectedProject={setSelectedProject}
							projects={projects}
							task={task}
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
							dispatch(setAlertState({ alertId: 'AlertCopied', isOpen: true }));
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

				{/* <div className="grid grid-cols-2 gap-2 px-3 pb-4">
                    <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200" onClick={() => {
                        setCurrDueDate(null);
                        setIsVisible(false);

                        if (task) {
                            editTask({ taskId: task._id, payload: { dueDate: null } });
                        }

                    }}>Clear</button>
                    <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600" onClick={() => {
                        if (task) {
                            editTask({ taskId: task._id, payload: { dueDate: currDueDate } });
                        }

                        setIsVisible(false);
                    }}>Ok</button>
                </div> */}
			</div>
		</Dropdown>
	);
};

export default DropdownTaskActions;

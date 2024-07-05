import { useEffect, useState } from 'react';
import Icon from './Icon';
import { TaskObj } from '../interfaces/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProjectsQuery } from '../services/api';
import { PRIORITIES } from '../utils/priorities.utils';
import classNames from 'classnames';
import TaskDueDateText from './TaskDueDateText';
import ContextMenuTaskDetails from './ContextMenu/ContextMenuTaskDetails';
import { useGetTasksQuery } from '../services/resources/tasksApi';

interface TaskProps {
	taskId: string;
	fromTaskDetails?: boolean;
	selectedFocusRecordTask?: TaskObj;
	setSelectedFocusRecordTask?: React.Dispatch<React.SetStateAction<TaskObj>>;
	fromParent?: boolean;
	showSubtasks?: boolean;
	onCloseSearchTasks?: () => void;
	handleTaskClick?: () => void;
}

const Task: React.FC<TaskProps> = ({
	taskId,
	fromTaskDetails,
	selectedFocusRecordTask,
	setSelectedFocusRecordTask,
	fromParent,
	showSubtasks = true,
	onCloseSearchTasks,
	handleTaskClick,
}) => {
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasksById, parentOfTasks } = fetchedTasks || {};
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};
	const navigate = useNavigate();
	let { taskId: taskIdFromUrl } = useParams();
	const [project, setProject] = useState(null);
	const [taskContextMenu, setTaskContextMenu] = useState(null);

	const handleContextMenu = (event) => {
		event.preventDefault(); // Prevent the default context menu

		setTaskContextMenu({
			xPos: event.pageX, // X coordinate of the mouse pointer
			yPos: event.pageY, // Y coordinate of the mouse pointer
		});
	};

	const handleClose = () => {
		setTaskContextMenu(null);
	};

	let task = typeof taskId == 'string' ? tasksById[taskId] : taskId;

	useEffect(() => {
		if (projectsById && projectId) {
			setProject(projectsById[projectId]);
		}
	}, [task?.projectId, projectsById]);

	if (!task) {
		return null;
	}

	const { _id, projectId, title, children, priority, completedTime, willNotDo, dueDate } = task;

	const priorityData = PRIORITIES[priority];
	const hasParentTask = parentOfTasks[_id];

	return (
		<div
			className={`${!fromParent || fromTaskDetails ? 'ml-0' : 'ml-4'} relative`}
			onClick={(e) => {
				e.stopPropagation();
				if (handleTaskClick) {
					handleContextMenu(e);
				}
			}}
		>
			<div
				className={
					`flex py-1 hover:bg-color-gray-600 cursor-pointer rounded-lg` +
					(taskIdFromUrl == taskId ? ' bg-color-gray-300' : '')
				}
				onClick={(e) => {
					if (handleTaskClick) {
						// TODO: Investigate what props should be passed down.
						// handleTaskClick();
						handleContextMenu(e);
					} else {
						if (setSelectedFocusRecordTask) {
							setSelectedFocusRecordTask(task);
						} else {
							navigate(`/projects/${projectId}/tasks/${_id}`);

							if (onCloseSearchTasks) {
								onCloseSearchTasks();
							}
						}
					}
				}}
			>
				{/* {!fromTaskDetails && (
					<div
						className="flex mt-[2px] cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							setShowSubtasks(!showSubtasks);
						}}
					>
						{showSubtasks ? (
							<Icon name="expand_more" customClass={categoryIconClass} />
						) : (
							<Icon name="chevron_right" customClass={categoryIconClass} />
						)}
					</div>
				)} */}

				<div className="flex-1 flex gap-1 cursor-pointer">
					{!setSelectedFocusRecordTask ? (
						<span
							className={classNames(
								'h-[20px] flex items-center hover:text-white cursor-pointer',
								priorityData.textFlagColor
							)}
						>
							{willNotDo ? (
								<Icon name="disabled_by_default" fill={1} customClass={'!text-[20px] '} />
							) : !completedTime ? (
								children.length > 0 ? (
									<Icon name="list_alt" fill={0} customClass={'!text-[20px] '} />
								) : (
									<Icon name="check_box_outline_blank" customClass={'!text-[20px] '} />
								)
							) : (
								<Icon name="check_box" customClass={'!text-[20px] '} />
							)}
						</span>
					) : (
						<div className="h-[20px]">
							{selectedFocusRecordTask && selectedFocusRecordTask._id === _id ? (
								<Icon
									name="radio_button_checked"
									fill={0}
									customClass={classNames(
										'!text-[20px] hover:text-white cursor-pointer',
										priorityData.textFlagColor
									)}
								/>
							) : (
								<Icon
									name="radio_button_unchecked"
									fill={0}
									customClass={classNames(
										'!text-[18px] hover:text-white cursor-pointer',
										priorityData.textFlagColor
									)}
								/>
							)}
						</div>
					)}

					<div
						className={classNames(
							setSelectedFocusRecordTask
								? `${hasParentTask ? 'max-w-[150px]' : 'max-w-[180px]'} text-ellipsis text-nowrap overflow-hidden`
								: 'break-all max-w-[350px]',
							completedTime ? 'line-through text-color-gray-100' : ''
						)}
					>
						{title}
					</div>

					<div className="flex-1 flex justify-end items-center gap-1">
						{project && !setSelectedFocusRecordTask && (
							<div className="text-color-gray-100 mr-1">{project.name}</div>
						)}
						{dueDate && (
							<TaskDueDateText
								dueDate={dueDate}
								showShortVersion={setSelectedFocusRecordTask ? true : false}
							/>
						)}
					</div>
				</div>
			</div>

			{showSubtasks && !fromTaskDetails && (
				<div className="flex flex-col mt-1">
					{children &&
						children.map((subtaskId: string) => (
							<Task
								key={subtaskId}
								taskId={subtaskId}
								selectedFocusRecordTask={selectedFocusRecordTask}
								setSelectedFocusRecordTask={setSelectedFocusRecordTask}
								fromParent={true}
								handleTaskClick={handleTaskClick}
							/>
						))}
				</div>
			)}

			{taskContextMenu && (
				<ContextMenuTaskDetails
					taskContextMenu={taskContextMenu}
					xPos={taskContextMenu.xPos}
					yPos={taskContextMenu.yPos}
					onClose={handleClose}
					task={task}
				/>
			)}
		</div>
	);
};

export default Task;

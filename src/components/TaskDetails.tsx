import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { TaskObj } from '../interfaces/interfaces';
import DropdownCalendar from './Dropdown/DropdownCalendar/DropdownCalendar';
import AddTaskForm from './AddTaskForm';
import ModalTaskActivities from './Modal/ModalTaskActivities';
import { useGetTasksQuery, useGetProjectsQuery, useEditTaskMutation } from '../services/api';
import { getTasksWithFilledInChildren } from '../utils/helpers.utils';
import { SortableTree } from './SortableTest/SortableTree';
import useDebouncedEditTask from '../hooks/useDebouncedEditTask';
import classNames from 'classnames';
import { SMART_LISTS } from '../utils/smartLists.utils';
import { PRIORITIES } from '../utils/priorities.utils';
import TaskDueDateText from './TaskDueDateText';
import DropdownPriorities from './Dropdown/DropdownPriorities';
import DropdownProjects from './Dropdown/DropdownProjects';
import DropdownTaskOptions from './Dropdown/DropdownTaskOptions/DropdownTaskOptions';

const EmptyTask = () => (
	<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700 flex justify-center items-center text-[18px] text-color-gray-100">
		<div className="text-center space-y-5">
			<Icon
				name="ads_click"
				customClass={'text-color-gray-100 text-blue-500 !text-[50px] hover:text-white cursor-pointer'}
			/>
			<div>Click task title to view the details</div>
		</div>
	</div>
);

const TaskDetails = () => {
	// Tasks
	const { data: fetchedTasks, isLoading: isTasksLoading, error } = useGetTasksQuery();
	const { tasks, tasksById, parentOfTasks } = fetchedTasks || {};
	const { debouncedEditTaskApiCall } = useDebouncedEditTask();
	const [editTask] = useEditTaskMutation();

	// Projects
	const { data: fetchedProjects, isLoading: isProjectsLoading, error: errorProjects } = useGetProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	const [currTitle, setCurrTitle] = useState('');
	const [currDescription, setCurrDescription] = useState('');
	const [selectedPriority, setSelectedPriority] = useState(0);
	const [currCompletedTime, setCurrCompletedTime] = useState(null);
	const [task, setTask] = useState<TaskObj>();
	const [parentTask, setParentTask] = useState<TaskObj | null>();
	const [childTasks, setChildTasks] = useState([]);
	const [currDueDate, setCurrDueDate] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);

	// Dropdowns
	const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);
	const [isDropdownTaskOptionsVisible, setIsDropdownTaskOptionsVisible] = useState(false);
	const [isDropdownPrioritiesVisible, setIsDropdownPrioritiesVisible] = useState(false);
	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);

	// Modals
	const [isModalTaskActivitiesOpen, setIsModalTaskActivitiesOpen] = useState(false);

	const [showAddTaskForm, setShowAddTaskForm] = useState(false);
	const [showAddCommentInput, setShowAddCommentInput] = useState(false);
	const [currentComment, setCurrentComment] = useState('');
	const [comments, setComments] = useState([
		{
			id: 1,
			username: 'curlos',
			timePosted: 'just now',
			content: 'Lakers VS. Pelicans',
		},
		{
			id: 2,
			username: 'curlos',
			timePosted: 'just now',
			content: 'Lakers VS. Pelicans',
		},
		{
			id: 3,
			username: 'curlos',
			timePosted: 'just now',
			content: 'Lakers VS. Pelicans',
		},
		{
			id: 4,
			username: 'curlos',
			timePosted: 'just now',
			content: 'Lakers VS. Pelicans',
		},
		{
			id: 5,
			username: 'curlos',
			timePosted: 'just now',
			content: 'Lakers VS. Pelicans',
		},
	]);

	const dropdownCalendarToggleRef = useRef(null);
	const dropdownTaskOptionsRef = useRef(null);
	const dropdownPrioritiesRef = useRef(null);
	const dropdownProjectsRef = useRef(null);

	let { taskId, projectId: paramsProjectId } = useParams();
	const navigate = useNavigate();

	const inSmartListView = paramsProjectId && SMART_LISTS[paramsProjectId];

	useEffect(() => {
		if (isTasksLoading || isProjectsLoading) {
			return;
		}

		const currTask = taskId && tasksById && tasksById[taskId];
		setTask(currTask);

		if (currTask) {
			setCurrTitle(currTask.title);
			setCurrDescription(currTask.description);
			setCurrCompletedTime(currTask.completedTime);

			if (currTask.dueDate) {
				setCurrDueDate(new Date(currTask.dueDate));
			} else {
				setCurrDueDate(null);
			}

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

			// TODO: There is a problem caused by this. Sortable Tree not updating with latest tasks.
			const newChildTasks = getTasksWithFilledInChildren(currTask.children, tasksById, currTask.projectId);
			setChildTasks(newChildTasks);

			// TODO: Maybe think about what should happen when a project id changes. Should we redirect to the project id list too? Maybe, maybe not.
			// navigate(`/projects/${inSmartListView ? paramsProjectId : currTask.projectId}/tasks/${currTask._id}`);
		}
	}, [taskId, tasks, tasksById]);

	if (!task || isTasksLoading) {
		return <EmptyTask />;
	}

	const { _id, children, priority, completedPomodoros, timeTaken, estimatedDuration, deadline, willNotDo } = task;
	const priorityData = PRIORITIES[priority];

	return (
		<div className="flex flex-col w-full h-full max-h-screen bg-color-gray-700">
			<div className="flex justify-between items-center p-4 border-b border-color-gray-200">
				<div className="flex items-center gap-2">
					<span
						className={classNames(
							'flex items-center hover:text-white cursor-pointer',
							priorityData.textFlagColor
						)}
						onClick={(e) => {
							e.stopPropagation();
							const newCompletedTime = currCompletedTime ? null : new Date().toISOString();
							setCurrCompletedTime(newCompletedTime);
							// TODO: Play audio when task is completed
							editTask({ taskId: _id, payload: { completedTime: newCompletedTime } });
						}}
					>
						{willNotDo ? (
							<Icon name="disabled_by_default" fill={1} customClass={'!text-[20px] '} />
						) : !currCompletedTime ? (
							children.length > 0 ? (
								<Icon name="list_alt" fill={0} customClass={'!text-[20px] '} />
							) : (
								<Icon name="check_box_outline_blank" customClass={'!text-[20px] '} />
							)
						) : (
							<Icon name="check_box" customClass={'!text-[20px] '} />
						)}
					</span>

					<div className="flex items-center gap-1 border-l border-color-gray-200 text-color-gray-100 px-2 relative">
						<div
							ref={dropdownCalendarToggleRef}
							onClick={() => setIsDropdownCalendarVisible(!isDropdownCalendarVisible)}
						>
							<TaskDueDateText dueDate={currDueDate} showCalendarIcon={true} />
						</div>

						<DropdownCalendar
							toggleRef={dropdownCalendarToggleRef}
							isVisible={isDropdownCalendarVisible}
							setIsVisible={setIsDropdownCalendarVisible}
							task={task}
							currDueDate={currDueDate}
							setCurrDueDate={setCurrDueDate}
							customClasses=" !ml-[0px] mt-[15px]"
						/>
					</div>
				</div>

				<div className="relative">
					<div
						ref={dropdownPrioritiesRef}
						onClick={() => setIsDropdownPrioritiesVisible(!isDropdownPrioritiesVisible)}
					>
						<Icon
							name="flag"
							customClass={classNames(
								'!text-[22px] hover:text-white cursor-pointer',
								priorityData.textFlagColor
							)}
						/>
					</div>

					<DropdownPriorities
						toggleRef={dropdownPrioritiesRef}
						isVisible={isDropdownPrioritiesVisible}
						setIsVisible={setIsDropdownPrioritiesVisible}
						priority={selectedPriority}
						setPriority={setSelectedPriority}
						customClasses="!ml-[-180px]"
						task={task}
					/>
				</div>
			</div>

			<div className="flex-1 overflow-auto no-scrollbar">
				<div className="p-4 flex flex-col justify-between">
					{parentTask && (
						<div
							className="w-full flex justify-between items-center text-color-gray-100 cursor-pointer"
							onClick={() =>
								navigate(
									`/projects/${inSmartListView ? paramsProjectId : parentTask.projectId}/tasks/${parentTask._id}`
								)
							}
						>
							<div className="max-w-[368px]">
								<div className="truncate text-[12px]">{parentTask.title}</div>
							</div>
							<Icon
								name="chevron_right"
								customClass={'text-color-gray-100 !text-[16px] hover:text-white'}
							/>
						</div>
					)}

					<TextareaAutosize
						className="text-[16px] placeholder:text-[#7C7C7C] font-bold mb-0 bg-transparent w-full outline-none resize-none no-scrollbar"
						placeholder="What would you like to do?"
						value={currTitle}
						onChange={(e) => {
							setCurrTitle(e.target.value);
							debouncedEditTaskApiCall(_id, { title: e.target.value });
						}}
					></TextareaAutosize>

					<TextareaAutosize
						className="text-[14px] placeholder:text-[#7C7C7C] mt-2 mb-4 bg-transparent w-full outline-none resize-none"
						placeholder="Description"
						value={currDescription}
						onChange={(e) => {
							setCurrDescription(e.target.value);
							debouncedEditTaskApiCall(_id, { description: e.target.value });
						}}
					></TextareaAutosize>

					{/* {children.map((subtaskId: string) => (
                        <Task key={subtaskId} taskId={subtaskId} fromTaskDetails={true} />
                    ))} */}

					{/* TODO: There is a problem caused by this. Sortable Tree not updating with latest tasks. */}
					{childTasks && childTasks.length > 0 && (
						<SortableTree
							collapsible
							indicator
							removable
							defaultItems={childTasks}
							tasksToUse={task.children}
						/>
					)}

					{children && children.length > 0 && (
						<div>
							{!showAddTaskForm && (
								<button
									className="flex items-center gap-1 my-2"
									onClick={() => setShowAddTaskForm(true)}
								>
									<Icon name="add" customClass={'text-blue-500 !text-[20px]'} />
									<span className="text-blue-500">Add Subtask</span>
								</button>
							)}

							{showAddTaskForm && <AddTaskForm setShowAddTaskForm={setShowAddTaskForm} parentId={_id} />}
						</div>
					)}
				</div>

				<div className="flex-1 flex flex-col justify-end">
					{/* TODO: Bring comments back once I add the functionality and the routes on the backend. */}
					{!comments && comments.length > 0 && (
						<div className="p-4 border-t border-color-gray-200 text-[13px]">
							<div className="mb-4 flex items-center gap-2 text-[14px]">
								<span>Comments</span>
								<span>{comments.length}</span>
							</div>

							<div className="space-y-6">
								{comments.map((comment) => (
									<div key={comment.id} className="flex">
										<div className="rounded-full bg-black p-1 mb-3">
											<img
												src="/prestige-9-bo2.png"
												alt="user-icon"
												className="w-[32px] h-[32px]"
											/>
										</div>

										<div className="ml-2">
											<div className="flex items-center gap-4 text-color-gray-100">
												<div>{comment.username}</div>
												<div>{comment.timePosted}</div>
											</div>

											<div className="mt-2">{comment.content}</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			<div>
				{showAddCommentInput && (
					<div className="p-4 border-t border-b border-color-gray-200">
						<TextareaAutosize
							className="placeholder-color-gray-100 bg-color-gray-300 p-[10px] rounded-md w-full outline-none border border-transparent focus:border-blue-500 resize-none"
							placeholder="Write a comment"
							value={currentComment}
							onChange={(e) => setCurrentComment(e.target.value)}
						></TextareaAutosize>
					</div>
				)}

				<div className="px-4 py-3 flex justify-between items-center text-color-gray-100">
					{!isProjectsLoading && (
						<div className="relative">
							<div
								ref={dropdownProjectsRef}
								className="flex items-center gap-1 cursor-pointer"
								onClick={() => setIsDropdownProjectsVisible(!isDropdownProjectsVisible)}
							>
								<Icon
									name="drive_file_move"
									customClass={'text-color-gray-100 !text-[18px] hover:text-white cursor-pointer'}
								/>
								{selectedProject.name}
							</div>

							<DropdownProjects
								toggleRef={dropdownProjectsRef}
								isVisible={isDropdownProjectsVisible}
								setIsVisible={setIsDropdownProjectsVisible}
								selectedProject={selectedProject}
								setSelectedProject={setSelectedProject}
								projects={projects}
								task={task}
								customClasses="!mt-[-315px]"
							/>
						</div>
					)}

					<div className="flex items-center gap-2 relative">
						{/* <Icon name="edit_note" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} /> */}
						<Icon
							name="comment"
							customClass={
								'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
							}
							fill={0}
							onClick={() => setShowAddCommentInput(!showAddCommentInput)}
						/>
						<Icon
							toggleRef={dropdownTaskOptionsRef}
							name="more_horiz"
							customClass={
								'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
							}
							fill={0}
							onClick={() => setIsDropdownTaskOptionsVisible(!isDropdownTaskOptionsVisible)}
						/>

						<DropdownTaskOptions
							toggleRef={dropdownTaskOptionsRef}
							isVisible={isDropdownTaskOptionsVisible}
							setIsVisible={setIsDropdownTaskOptionsVisible}
							setIsModalTaskActivitiesOpen={setIsModalTaskActivitiesOpen}
							task={task}
						/>
					</div>
				</div>
			</div>

			<ModalTaskActivities
				isModalOpen={isModalTaskActivitiesOpen}
				setIsModalOpen={setIsModalTaskActivitiesOpen}
			/>
		</div>
	);
};

export default TaskDetails;

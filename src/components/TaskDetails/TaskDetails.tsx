import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import { useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { TaskObj } from '../../interfaces/interfaces';
import DropdownCalendar from '../Dropdown/DropdownCalendar/DropdownCalendar';
import AddTaskForm from '../AddTaskForm';
import ModalTaskActivities from '../Modal/ModalTaskActivities';
import { getFormattedDuration, getTasksWithFilledInChildren, hexToRGBA, sumProperty } from '../../utils/helpers.utils';
import { SortableTree } from '../SortableTest/SortableTree';
import useDebouncedEditTask from '../../hooks/useDebouncedEditTask';
import classNames from 'classnames';
import { SMART_LISTS } from '../../utils/smartLists.utils';
import { PRIORITIES } from '../../utils/priorities.utils';
import TaskDueDateText from '../TaskDueDateText';
import DropdownPriorities from '../Dropdown/DropdownPriorities';
import DropdownTaskOptions from '../Dropdown/DropdownTaskOptions/DropdownTaskOptions';
import useAudio from '../../hooks/useAudio';
import amongUsCompletionSoundMP3 from '/among_us_complete_task.mp3';
import CommentList from './CommentList';
import AddCommentForm from './AddCommentForm';
import DropdownItemsWithSearch from '../Dropdown/DropdownItemsWithSearch/DropdownItemsWithSearch';
import TagList from './TagList';
import { useEditTaskMutation, useGetTasksQuery } from '../../services/resources/tasksApi';
import { useGetProjectsQuery } from '../../services/resources/projectsApi';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { useGetCommentsQuery } from '../../services/resources/commentsApi';
import { useGetTagsQuery } from '../../services/resources/tagsApi';

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

const TaskDetails = ({
	taskToUse,
	isForAddingNewTask = false,
	setNewTask,
	fromDropdown = false,
	setIsDropdownTaskDetailsVisible,
}) => {
	// RTK Query - Tasks
	const { data: fetchedTasks, isLoading: isTasksLoading, error } = useGetTasksQuery();
	const { tasks, tasksById, parentOfTasks } = fetchedTasks || {};
	const { debouncedEditTaskApiCall } = useDebouncedEditTask();
	const [editTask] = useEditTaskMutation();

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isProjectsLoading, error: errorProjects } = useGetProjectsQuery();
	const { projects, projectsById, inboxProject } = fetchedProjects || {};

	// RTK Query - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { focusRecords, focusRecordsByTaskId } = fetchedFocusRecords || {};

	// RTK Query - Comments
	const { data: fetchedComments, isLoading: isLoadingGetComments, error: errorGetComments } = useGetCommentsQuery();
	const { commentsByTaskId } = fetchedComments || {};

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsById, tagsWithNoParent } = fetchedTags || {};

	const { play: playCompletionSound, stop: stopCompletionSound } = useAudio(amongUsCompletionSoundMP3);

	// useState
	const [currTitle, setCurrTitle] = useState('');
	const [currDescription, setCurrDescription] = useState('');
	const [selectedPriority, setSelectedPriority] = useState(0);
	const [currCompletedTime, setCurrCompletedTime] = useState(null);
	const [task, setTask] = useState<TaskObj>(taskToUse || null);
	const [parentTask, setParentTask] = useState<TaskObj | null>();
	const [childTasks, setChildTasks] = useState([]);
	const [currDueDate, setCurrDueDate] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedTagList, setSelectedTagList] = useState([]);
	const [pomos, setPomos] = useState(0);
	const [duration, setDuration] = useState(0);

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
	const [commentToEdit, setCommentToEdit] = useState(null);

	const dropdownCalendarToggleRef = useRef(null);
	const dropdownTaskOptionsRef = useRef(null);
	const dropdownPrioritiesRef = useRef(null);
	const dropdownProjectsRef = useRef(null);

	let { taskId: paramsTaskId, projectId: paramsProjectId } = useParams();
	const navigate = useNavigate();

	const inSmartListView = paramsProjectId && SMART_LISTS[paramsProjectId];

	useEffect(() => {
		if (isTasksLoading || isProjectsLoading || isLoadingFocusRecords) {
			return;
		}

		const currTask =
			!isForAddingNewTask && (taskToUse ? taskToUse : paramsTaskId && tasksById && tasksById[paramsTaskId]);

		if (!isForAddingNewTask && currTask) {
			setTask(currTask);
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
			} else {
				setSelectedProject(null);
			}

			if (currTask.tagIds && currTask.tagIds.length > 0) {
				const newSelectedTagList = currTask.tagIds.map((tagId) => tagsById[tagId]);
				setSelectedTagList(newSelectedTagList);
			} else {
				setSelectedTagList([]);
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

			const taskFocusRecords = focusRecordsByTaskId[currTask._id];

			if (taskFocusRecords) {
				setPomos(sumProperty(taskFocusRecords, 'pomos'));
				setDuration(sumProperty(taskFocusRecords, 'duration'));
			} else {
				setPomos(0);
				setDuration(0);
			}

			// TODO: Maybe think about what should happen when a project id changes. Should we redirect to the project id list too? Maybe, maybe not.
			// navigate(`/projects/${inSmartListView ? paramsProjectId : currTask.projectId}/tasks/${currTask._id}`);
		} else {
			// TODO: Reset all the state values to their defaults.
			resetStateValues();
		}
	}, [paramsTaskId, tasks, tasksById, isTasksLoading, isProjectsLoading, isLoadingFocusRecords]);

	const resetStateValues = () => {
		setTask(
			taskToUse?.dueDate
				? {
						dueDate: taskToUse.dueDate,
					}
				: null
		);
		setCurrTitle('');
		setCurrDescription('');
		setCurrCompletedTime(null);
		setCurrDueDate(taskToUse?.dueDate || null);
		setSelectedProject(inboxProject);
		setSelectedTagList([]);
		setParentTask(null);
		setChildTasks([]);
		setPomos(0);
		setDuration(0);
	};

	useEffect(() => {
		if (isForAddingNewTask) {
			setNewTask({
				title: currTitle,
				description: currDescription,
				priority: selectedPriority || 0,
				projectId: selectedProject?._id ?? null,
				dueDate: task?.dueDate ?? null,
			});
		}
	}, [currTitle, currDescription, selectedProject, selectedPriority, task]);

	if ((!task && !isForAddingNewTask) || isTasksLoading) {
		return <EmptyTask />;
	}

	const {
		_id,
		children,
		priority,
		completedPomodoros,
		timeTaken,
		estimatedDuration,
		deadline,
		willNotDo,
		dueDate,
		tagIds,
	} = task || {};

	const priorityData = !isForAddingNewTask ? PRIORITIES[priority] : PRIORITIES[selectedPriority];
	const taskComments = _id && commentsByTaskId && commentsByTaskId[_id] && Object.values(commentsByTaskId[_id]);

	const taskTags = tagIds?.map((tagId) => tagsById[tagId]);

	return (
		<div
			className="flex flex-col w-full h-full max-h-screen bg-color-gray-700"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="flex justify-between items-center p-4 border-b border-color-gray-200">
				<div className="flex items-center gap-2">
					{!isForAddingNewTask && (
						<span
							className={classNames(
								'flex items-center hover:text-white cursor-pointer',
								priorityData?.textFlagColor
							)}
							onClick={(e) => {
								e.stopPropagation();
								const newCompletedTime = currCompletedTime ? null : new Date().toISOString();
								setCurrCompletedTime(newCompletedTime);

								// Reset and play audio
								playCompletionSound();

								!isForAddingNewTask &&
									editTask({ taskId: _id, payload: { completedTime: newCompletedTime } });
							}}
						>
							{willNotDo ? (
								<Icon name="disabled_by_default" fill={1} customClass={'!text-[20px] '} />
							) : !currCompletedTime ? (
								children?.length > 0 ? (
									<Icon name="list_alt" fill={0} customClass={'!text-[20px] '} />
								) : (
									<Icon name="check_box_outline_blank" customClass={'!text-[20px] '} />
								)
							) : (
								<Icon name="check_box" customClass={'!text-[20px] '} />
							)}
						</span>
					)}

					<div
						className={classNames(
							'flex items-center gap-1 text-color-gray-100 relative',
							!isForAddingNewTask && 'border-l border-color-gray-200 px-2'
						)}
					>
						<div
							ref={dropdownCalendarToggleRef}
							onClick={() => setIsDropdownCalendarVisible(!isDropdownCalendarVisible)}
						>
							<TaskDueDateText dueDate={dueDate} showCalendarIcon={true} />
						</div>

						<DropdownCalendar
							toggleRef={dropdownCalendarToggleRef}
							isVisible={isDropdownCalendarVisible}
							setIsVisible={setIsDropdownCalendarVisible}
							task={task}
							setTask={setTask}
							isForAddingNewTask={isForAddingNewTask}
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
								priorityData?.textFlagColor
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
						isForAddingNewTask={isForAddingNewTask}
					/>
				</div>
			</div>

			<div className="flex-1 overflow-auto no-scrollbar flex flex-col">
				<div className="p-4 flex-1 flex flex-col min-h-[150px]">
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
					{/* TODO: Focused for... */}
					{(pomos > 0 || duration > 0) && (
						<div className="flex items-center gap-1 text-blue-500">
							<div className="text-color-gray-100">Focused for</div>

							{pomos > 0 && (
								<Icon
									name="nutrition"
									customClass={'!text-[20px] text-blue-500 cursor-pointer mt-[2px]'}
									fill={1}
								/>
							)}
							{pomos > 0 && pomos}

							{duration > 0 && (
								<Icon
									name="timer"
									customClass={'!text-[20px] text-blue-500 cursor-pointer mt-[2px]'}
									fill={1}
								/>
							)}
							{duration > 0 && getFormattedDuration(duration)}
						</div>
					)}
					<TextareaAutosize
						className="text-[16px] placeholder:text-[#7C7C7C] font-bold mb-0 bg-transparent w-full outline-none resize-none no-scrollbar"
						placeholder="What would you like to do?"
						value={currTitle}
						onChange={(e) => {
							setCurrTitle(e.target.value);
							!isForAddingNewTask && debouncedEditTaskApiCall(_id, { title: e.target.value });
						}}
					></TextareaAutosize>
					<TextareaAutosize
						className="text-[14px] placeholder:text-[#7C7C7C] mt-2 mb-4 bg-transparent w-full outline-none resize-none gray-scrollbar"
						placeholder="Description"
						value={currDescription}
						onChange={(e) => {
							setCurrDescription(e.target.value);
							!isForAddingNewTask && debouncedEditTaskApiCall(_id, { description: e.target.value });
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

					<TagList
						taskTags={taskTags}
						task={task}
						selectedTagList={selectedTagList}
						setSelectedTagList={setSelectedTagList}
					/>
				</div>

				<CommentList
					taskComments={taskComments}
					setCommentToEdit={setCommentToEdit}
					setShowAddCommentInput={setShowAddCommentInput}
					setCurrentComment={setCurrentComment}
				/>
			</div>

			<div>
				<AddCommentForm
					showAddCommentInput={showAddCommentInput}
					setShowAddCommentInput={setShowAddCommentInput}
					currentComment={currentComment}
					setCurrentComment={setCurrentComment}
					taskId={paramsTaskId}
					commentToEdit={commentToEdit}
					setCommentToEdit={setCommentToEdit}
				/>

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
								{selectedProject?.name}
							</div>

							<DropdownItemsWithSearch
								toggleRef={dropdownProjectsRef}
								isVisible={isDropdownProjectsVisible}
								setIsVisible={setIsDropdownProjectsVisible}
								selectedItem={selectedProject}
								setSelectedItem={setSelectedProject}
								items={projects}
								task={task}
								isForAddingNewTask={isForAddingNewTask}
								type="project"
								customClasses="!mt-[-315px]"
							/>
						</div>
					)}

					{!isForAddingNewTask && (
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
								fromDropdown={fromDropdown}
								setIsDropdownTaskDetailsVisible={setIsDropdownTaskDetailsVisible}
							/>
						</div>
					)}
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

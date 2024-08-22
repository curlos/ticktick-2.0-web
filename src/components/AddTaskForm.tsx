import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Icon from './Icon';
import DropdownCalendar from './Dropdown/DropdownCalendar/DropdownCalendar';
import TextareaAutosize from 'react-textarea-autosize';
import DropdownPriorities from './Dropdown/DropdownPriorities';
import { PRIORITIES } from '../utils/priorities.utils';
import { SMART_LISTS } from '../utils/smartLists.utils';
import { useNavigate, useParams } from 'react-router';
import classNames from 'classnames';
import TaskDueDateText from './TaskDueDateText';
import { setModalState } from '../slices/modalSlice';
import DropdownItemsWithSearch from './Dropdown/DropdownItemsWithSearch/DropdownItemsWithSearch';
import TagItemForTask from './TagItemForTask';
import { useAddTaskMutation } from '../services/resources/tasksApi';
import { useGetProjectsQuery } from '../services/resources/projectsApi';
import { useGetTagsQuery } from '../services/resources/tagsApi';

interface AddTaskFormProps {
	parentId: string;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
	setShowAddTaskForm,
	parentId,
	defaultPriority,
	setIsDropdownAddTaskFormVisible,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();
	const { projectId, tagId } = params;

	// RTK Query - Tasks
	const [addTask, { isLoading, error }] = useAddTaskMutation();

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects, inboxProject } = fetchedProjects || {};

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsById, tagsWithNoParent } = fetchedTags || {};

	// useState
	const [title, setTitle] = useState('');
	const [focused, setFocused] = useState(false);
	const [currDueDate, setCurrDueDate] = useState(null);
	const [tempSelectedPriority, setTempSelectedPriority] = useState(defaultPriority ? defaultPriority : 'none');
	const [selectedProject, setSelectedProject] = useState(null);
	const [description, setDescription] = useState('');
	const [selectedTagList, setSelectedTagList] = useState([]);

	// useState - Dropdowns
	const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);
	const [isDropdownPrioritiesVisible, setIsDropdownPrioritiesVisible] = useState(false);
	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const [isDropdownItemsWithSearchTagVisible, setIsDropdownItemsWithSearchTagVisible] = useState(false);

	// useRef
	const dropdownCalendarToggleRef = useRef(null);
	const dropdownPrioritiesRef = useRef(null);
	const dropdownProjectsRef = useRef(null);
	const dropdownItemsWithSearchTagRef = useRef(null);

	const priority = PRIORITIES[tempSelectedPriority];

	useEffect(() => {
		if (isLoadingProjects) {
			return;
		}

		const inSmartListView = SMART_LISTS[projectId];

		if (projectId) {
			// If in a project that is not a smart list, then the default selected project in the add task form should be the project we're currently in.
			if (!inSmartListView) {
				setSelectedProject(projects.find((project) => project._id === projectId));
			} else {
				setSelectedProject(projects[0]);
				setCurrDueDate(SMART_LISTS[projectId].getDefaultDueDate());
			}
		} else {
			// If not in a projectId route, the default project will be the inbox project.
			setSelectedProject(inboxProject);
		}

		if (tagId) {
			const defaultTag = tagsById[tagId];
			setSelectedTagList([defaultTag]);
		}
	}, [fetchedProjects, projectId, tagId]);

	const handleAddTask = async (e) => {
		e.preventDefault();

		if (!title) {
			return null;
		}

		const selectedTagListIds = selectedTagList.map((tag) => tag._id);

		const payload = {
			title,
			description,
			priority: priority && priority.backendValue,
			projectId: selectedProject._id,
			tagIds: selectedTagListIds,
			dueDate: currDueDate,
		};

		try {
			const newTask = await addTask({ payload, parentId }).unwrap();

			setTitle('');
			setDescription('');
			setCurrDueDate(null);
			setTempSelectedPriority(defaultPriority ? defaultPriority : 'none');
			dispatch(setModalState({ modalId: 'ModalAddTaskForm', isOpen: false }));

			handleTaskNavigation(newTask);
		} catch (error) {
			console.error(error);
		}
	};

	const handleTaskNavigation = (task) => {
		const fromDropdown = setIsDropdownAddTaskFormVisible;

		if (fromDropdown) {
			setIsDropdownAddTaskFormVisible(false);
		} else {
			if (tagId) {
				navigate(`/tags/${tagId}/tasks/${task._id}`);
			} else {
				navigate(`/projects/${task.projectId}/tasks/${task._id}`);
			}
		}
	};

	return (
		<>
			<form
				className={
					'gap-1 bg-color-gray-600 rounded-lg border' + (focused ? ' border-blue-500' : ' border-transparent')
				}
				onSubmit={handleAddTask}
			>
				<div className="p-3 pb-1">
					<TextareaAutosize
						className="text-[16px] placeholder:text-[#7C7C7C] font-bold mb-0 bg-transparent w-full outline-none resize-none"
						placeholder="Task name"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					></TextareaAutosize>
					<TextareaAutosize
						className="text-[14px] placeholder:text-[#7C7C7C] bg-transparent w-full outline-none resize-none"
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></TextareaAutosize>

					<div className="flex gap-1 mt-2">
						{selectedTagList.map((tag) => (
							<TagItemForTask
								key={tag._id}
								tag={tag}
								selectedTagList={selectedTagList}
								setSelectedTagList={setSelectedTagList}
							/>
						))}
					</div>

					<div className="flex gap-2 mt-3">
						<div className="text-[14px] flex items-center gap-1 text-color-gray-100 p-1 border border-color-gray-100 rounded-md relative">
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
								currDueDate={currDueDate}
								setCurrDueDate={setCurrDueDate}
							/>
						</div>

						<div className="text-[14px] text-color-gray-100 p-1 border border-color-gray-100 rounded-md relative">
							<div
								ref={dropdownPrioritiesRef}
								onClick={() => setIsDropdownPrioritiesVisible(!isDropdownPrioritiesVisible)}
								className="cursor-pointer"
							>
								{tempSelectedPriority === 0 ? (
									<div className="flex items-center gap-1">
										<Icon name="calendar_month" customClass={'!text-[16px] hover:text-white'} />
										Priority
									</div>
								) : (
									<div className={classNames('flex items-center gap-1', priority.textFlagColor)}>
										<Icon name="flag" customClass={'!text-[22px] cursor-pointer'} />
										{priority.name}
									</div>
								)}
							</div>

							<DropdownPriorities
								toggleRef={dropdownPrioritiesRef}
								isVisible={isDropdownPrioritiesVisible}
								setIsVisible={setIsDropdownPrioritiesVisible}
								priority={tempSelectedPriority}
								setPriority={setTempSelectedPriority}
							/>
						</div>
					</div>
				</div>

				<hr className="border-color-gray-200 my-1" />

				<div className="p-2 pt-1 flex justify-between items-center gap-2">
					{/* TODO: If there is a parentId, probably should not give the user the option to change the project here because the project MUST be the same as its parent. If it is a subtask of another task, it wouldn't make sense to have a different projectId. */}
					{/* TODO: For now, I won't take it out experiement with TickTick to see what it does about subtasks when you move it to a different project. One solution would be to change all the parentId's "projectId" in an upstream fashion. */}
					{!isLoadingProjects && (
						<div className="relative">
							<div
								ref={dropdownProjectsRef}
								className="flex items-center gap-1 font-bold text-[12px] cursor-pointer"
								onClick={() => setIsDropdownProjectsVisible(!isDropdownProjectsVisible)}
							>
								{selectedProject?.name}
								<Icon name="expand_more" customClass={'!text-[16px] hover:text-white'} />
							</div>

							<DropdownItemsWithSearch
								toggleRef={dropdownProjectsRef}
								isVisible={isDropdownProjectsVisible}
								setIsVisible={setIsDropdownProjectsVisible}
								selectedItem={selectedProject}
								setSelectedItem={setSelectedProject}
								items={projects}
								type="project"
							/>
						</div>
					)}

					{!isLoadingGetTags && (
						<div className="relative">
							<div
								ref={dropdownItemsWithSearchTagRef}
								className="flex items-center gap-1 font-bold text-[12px] cursor-pointer"
								onClick={() =>
									setIsDropdownItemsWithSearchTagVisible(!isDropdownItemsWithSearchTagVisible)
								}
							>
								Tags
								<Icon name="expand_more" customClass={'!text-[16px] hover:text-white'} />
							</div>

							<DropdownItemsWithSearch
								toggleRef={dropdownItemsWithSearchTagRef}
								isVisible={isDropdownItemsWithSearchTagVisible}
								setIsVisible={setIsDropdownItemsWithSearchTagVisible}
								selectedItemList={selectedTagList}
								setSelectedItemList={setSelectedTagList}
								items={tagsWithNoParent}
								multiSelect={true}
								type="tags"
							/>
						</div>
					)}

					<div className="flex-1 flex justify-end space-x-2">
						<button
							className="border border-color-gray-200 rounded-md py-1 cursor-pointer hover:bg-color-gray-200 p-3"
							onClick={() => {
								if (setShowAddTaskForm) {
									setShowAddTaskForm(false);
								} else {
									dispatch(setModalState({ modalId: 'ModalAddTaskForm', isOpen: false }));
								}
							}}
						>
							Cancel
						</button>
						<button
							disabled={!title}
							type="submit"
							className="bg-blue-500 rounded-md py-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-600 p-3"
						>
							Add Task
						</button>
					</div>
				</div>
			</form>
		</>
	);
};

export default AddTaskForm;

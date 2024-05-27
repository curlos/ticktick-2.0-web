import { useEffect, useRef, useState } from 'react';
import { DropdownProps } from '../../../interfaces/interfaces';
import { useGetProjectsQuery, useGetTasksQuery } from '../../../services/api';
import Icon from '../../Icon';
import TaskListByCategory from '../../TaskListByCategory';
import Dropdown from '../Dropdown';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import { useParams } from 'react-router';
import { debounce, getTasksWithNoParent } from '../../../utils/helpers.utils';
import DropdownProjects from '../DropdownProjects';
import Fuse from 'fuse.js';
import Task from '../../Task';

interface DropdownSetTaskProps extends DropdownProps {
	selectedTask: Object | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<Object | null>>;
}

const DropdownSetTask: React.FC<DropdownSetTaskProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedTask,
	setSelectedTask,
}) => {
	// Tasks
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	// Projects
	const { data: fetchedProjects, isLoading: isProjectsLoading, error: errorProjects } = useGetProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	// const { projectId } = useParams();

	const defaultTodayProject = SMART_LISTS['today'];

	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const [selectedProject, setSelectedProject] = useState(defaultTodayProject);
	const [tasksWithNoParent, setTasksWithNoParent] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [filteredTasks, setFilteredTasks] = useState([]);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	// const [selectedButton, setSelectedButton] = useState('Recent');

	const dropdownProjectsRef = useRef(null);

	const fuse = new Fuse(tasks, {
		includeScore: true,
		keys: ['title'],
	});

	const sharedButtonStyle = `text-[12px] py-1 px-3 rounded-3xl cursor-pointer`;
	// const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
	// const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666] bg-color-gray-300`;

	useEffect(() => {
		if (!tasks) {
			return;
		}

		const smartList = SMART_LISTS[selectedProject.urlName];
		let projectId = smartList ? selectedProject.urlName : selectedProject._id;

		const newTasksWithNoParent = getTasksWithNoParent(tasks, tasksById, projectId, smartList);
		setTasksWithNoParent(newTasksWithNoParent);
	}, [fetchedTasks, selectedProject]);

	useEffect(() => {
		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [searchText]);

	const handleDebouncedSearch = debounce(() => {
		if (!tasks) {
			return null;
		}

		let searchedTasks;

		if (searchText.trim() === '') {
			// If searchText is empty, consider all projects as the searched result.
			searchedTasks = [];
		} else {
			// When searchText is not empty, perform the search using Fuse.js
			searchedTasks = fuse.search(searchText);
		}

		setFilteredTasks(searchedTasks.map((result) => result.item));
	}, 1000);

	const ProjectSelector = () => {
		if (!selectedProject) {
			return null;
		}

		const smartList = SMART_LISTS[selectedProject.urlName];
		let iconName = selectedProject.isFolder
			? 'folder'
			: smartList
				? smartList.iconName
				: selectedProject.isInbox
					? 'inbox'
					: 'menu';

		return (
			<div className="relative">
				<div
					ref={dropdownProjectsRef}
					onClick={() => setIsDropdownProjectsVisible(!isDropdownProjectsVisible)}
					className="flex items-center gap-[2px] mt-4 mb-3 cursor-pointer"
				>
					<Icon name={iconName} customClass={'!text-[20px] text-color-gray-100 hover:text-white'} />
					<div>{selectedProject.name}</div>
					<Icon name="chevron_right" customClass={'!text-[20px] text-color-gray-100'} />
				</div>

				<DropdownProjects
					toggleRef={dropdownProjectsRef}
					isVisible={isDropdownProjectsVisible}
					setIsVisible={setIsDropdownProjectsVisible}
					selectedProject={selectedProject}
					setSelectedProject={setSelectedProject}
					projects={projects}
					showSmartLists={true}
				/>
			</div>
		);
	};

	console.log(searchText);
	console.log(filteredTasks);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={
				' w-[300px] mb-[-155px] ml-[-10px] p-1 shadow-2xl border border-color-gray-200 rounded-lg p-3'
			}
		>
			{/* TODO: Maybe bring back later. I don't know what qualifies as "Recent". I might have to keep track of the user's interactions with the task somewhere I suppose. */}
			{/* <div className="flex justify-center gap-1">
				<div
					className={selectedButton === 'Recent' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setSelectedButton('Recent')}
				>
					Recent
				</div>
				<div
					className={selectedButton === 'Task' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setSelectedButton('Task')}
				>
					Task
				</div>
			</div> */}

			<div className="bg-color-gray-200 rounded flex items-center gap-2 p-[6px] mb-2">
				<Icon name="search" customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'} />

				<input
					placeholder="Search"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					onFocus={() => setIsSearchFocused(true)}
					onBlur={() => setIsSearchFocused(false)}
					className="bg-transparent outline-none flex-1"
				/>

				{searchText && (
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={() => setSearchText('')}
					/>
				)}
			</div>

			{!isSearchFocused && !searchText && <ProjectSelector />}

			<div className="space-y-2 h-[300px] gray-scrollbar overflow-auto">
				{!isSearchFocused && !searchText ? (
					<TaskListByCategory
						tasks={tasksWithNoParent.filter((task) => {
							if (task.isDeleted) {
								return false;
							}

							if (task.willNotDo) {
								return false;
							}

							return true;
						})}
						selectedFocusRecordTask={selectedTask}
						setSelectedFocusRecordTask={setSelectedTask}
					/>
				) : (
					// TODO: FINISH THIS!!!!
					<div>
						{filteredTasks?.map((task) => (
							<Task
								key={task._id}
								taskId={task._id}
								selectedFocusRecordTask={selectedTask}
								setSelectedFocusRecordTask={setSelectedTask}
								showSubtasks={false}
							/>
						))}
					</div>
				)}
			</div>
		</Dropdown>
	);
};

export default DropdownSetTask;

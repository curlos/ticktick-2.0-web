import { useEffect, useRef, useState } from 'react';
import { DropdownProps } from '../../../interfaces/interfaces';
import { useGetProjectsQuery, useGetTasksQuery } from '../../../services/api';
import Icon from '../../Icon';
import Dropdown from '../Dropdown';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import { debounce, getTasksWithNoParent } from '../../../utils/helpers.utils';
import Fuse from 'fuse.js';
import Task from '../../Task';
import classNames from 'classnames';
import TaskListByGroup from '../../TaskListByGroup';
import DropdownItemsWithSearch from '../DropdownItemsWithSearch/DropdownItemsWithSearch';

interface DropdownSetTaskProps extends DropdownProps {
	selectedTask: Object | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<Object | null>>;
	dropdownProjectsState?: {
		isDropdownVisible: boolean;
		setIsDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
	};
}

const DropdownSetTask: React.FC<DropdownSetTaskProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedTask,
	setSelectedTask,
	dropdownProjectsState,
	customClasses,
}) => {
	// Tasks
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	// Projects
	const { data: fetchedProjects, isLoading: isProjectsLoading, error: errorProjects } = useGetProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	const defaultTodayProject = SMART_LISTS['today'];

	// TODO: Use the top level component above this for timer only otherwise use this one.
	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const [selectedProject, setSelectedProject] = useState(defaultTodayProject);
	const [tasksWithNoParent, setTasksWithNoParent] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [filteredTasks, setFilteredTasks] = useState([]);
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	const dropdownProjectsRef = useRef(null);

	const fuse = new Fuse(tasks, {
		includeScore: true,
		keys: ['title'],
	});

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
					onClick={() => {
						if (dropdownProjectsState) {
							dropdownProjectsState.setIsDropdownVisible(!dropdownProjectsState.isDropdownVisible);
						} else {
							setIsDropdownProjectsVisible(!isDropdownProjectsVisible);
						}
					}}
					className="flex items-center gap-[2px] mt-4 mb-3 cursor-pointer"
				>
					<Icon name={iconName} customClass={'!text-[20px] text-color-gray-100 hover:text-white'} />
					<div>{selectedProject.name}</div>
					<Icon name="chevron_right" customClass={'!text-[20px] text-color-gray-100'} />
				</div>

				<DropdownItemsWithSearch
					toggleRef={dropdownProjectsRef}
					isVisible={
						dropdownProjectsState ? dropdownProjectsState.isDropdownVisible : isDropdownProjectsVisible
					}
					setIsVisible={
						dropdownProjectsState
							? dropdownProjectsState.setIsDropdownVisible
							: setIsDropdownProjectsVisible
					}
					selectedItem={selectedProject}
					setSelectedItem={setSelectedProject}
					items={projects}
					showSmartLists={true}
					type="project"
				/>
			</div>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames(
				'w-[300px] mb-[-155px] p-1 shadow-2xl border border-color-gray-200 rounded-lg p-3',
				customClasses ? customClasses : ''
			)}
		>
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
					<TaskListByGroup
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

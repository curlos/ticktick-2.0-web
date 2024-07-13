import { useEffect, useState } from 'react';
import { DropdownProps } from '../../../interfaces/interfaces';
import Icon from '../../Icon';
import Dropdown from '../Dropdown';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import { debounce, getTasksWithNoParent } from '../../../utils/helpers.utils';
import Fuse from 'fuse.js';
import Task from '../../Task';
import classNames from 'classnames';
import TaskListByGroup from '../../TaskListByGroup';
import { useGetTasksQuery } from '../../../services/resources/tasksApi';
import { useGetHabitsQuery } from '../../../services/resources/habitsApi';
import ProjectSelector from './ProjectSelector';

interface DropdownSetTaskOrHabitProps extends DropdownProps {
	selectedTask: Object | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<Object | null>>;
	dropdownProjectsState?: {
		isDropdownVisible: boolean;
		setIsDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
	};
}

const DropdownSetTaskOrHabit: React.FC<DropdownSetTaskOrHabitProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedTask,
	setSelectedTask,
	dropdownProjectsState,
	customClasses,
}) => {
	// RTK Query - Tasks
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits, error: errorGetHabits } = useGetHabitsQuery();
	const { habits, habitsById } = fetchedHabits || {};

	const defaultTodayProject = SMART_LISTS['today'];

	const [selectedProject, setSelectedProject] = useState(defaultTodayProject);
	const [tasksWithNoParent, setTasksWithNoParent] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [filteredTasks, setFilteredTasks] = useState([]);
	const [isSearchFocused, setIsSearchFocused] = useState(false);

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

	const sharedButtonStyle = `py-1 px-4 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
	const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666]`;
	const [selectedButton, setSelectedButton] = useState('task');

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
			<div className="flex justify-center items-center gap-1 mb-3">
				<div
					className={selectedButton === 'task' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setSelectedButton('task')}
				>
					Task
				</div>
				<div
					className={selectedButton === 'habit' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setSelectedButton('habit')}
				>
					Habit
				</div>
			</div>
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

			{!isSearchFocused && !searchText && (
				<ProjectSelector
					selectedProject={selectedProject}
					setSelectedProject={setSelectedProject}
					dropdownProjectsState={dropdownProjectsState}
				/>
			)}

			<div className="space-y-2 h-[300px] gray-scrollbar overflow-auto">
				{!isSearchFocused && !searchText ? (
					selectedButton === 'task' ? (
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
						<div></div>
					)
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

export default DropdownSetTaskOrHabit;

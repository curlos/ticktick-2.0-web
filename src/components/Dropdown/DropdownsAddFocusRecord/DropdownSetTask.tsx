import { useEffect, useRef, useState } from 'react';
import { DropdownProps } from '../../../interfaces/interfaces';
import { useGetProjectsQuery, useGetTasksQuery } from '../../../services/api';
import Icon from '../../Icon';
import TaskListByCategory from '../../TaskListByCategory';
import Dropdown from '../Dropdown';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import { useParams } from 'react-router';
import { getTasksWithNoParent } from '../../../utils/helpers.utils';
import DropdownProjects from '../DropdownProjects';

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

	const { projectId } = useParams();
	const [tasksWithNoParent, setTasksWithNoParent] = useState([]);
	// const [selectedButton, setSelectedButton] = useState('Recent');

	const sharedButtonStyle = `text-[12px] py-1 px-3 rounded-3xl cursor-pointer`;
	// const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
	// const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666] bg-color-gray-300`;

	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	// TODO: Make today the default project.
	const defaultTodayProject = SMART_LISTS['today'];
	const [selectedProject, setSelectedProject] = useState(defaultTodayProject);
	const dropdownProjectsRef = useRef(null);

	useEffect(() => {
		if (!tasks) {
			return;
		}

		const newTasksWithNoParent = getTasksWithNoParent(tasks, tasksById, 'all', true);
		setTasksWithNoParent(newTasksWithNoParent);
	}, [fetchedTasks]);

	console.log(tasksWithNoParent);

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

				<input placeholder="Search" className="bg-transparent outline-none" />
			</div>

			<ProjectSelector />

			<div className="space-y-2 h-[300px] gray-scrollbar overflow-auto">
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
			</div>
		</Dropdown>
	);
};

export default DropdownSetTask;

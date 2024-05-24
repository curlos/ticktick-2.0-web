import Fuse from 'fuse.js';
import { debounce } from '../../utils/helpers.utils';
import Dropdown from './Dropdown';
import Icon from '../Icon';
import { DropdownProps, IProject, TaskObj } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useEditTaskMutation } from '../../services/api';

interface DropdownProjectsProps extends DropdownProps {
	selectedProject: string;
	setSelectedProject: React.Dispatch<React.SetStateAction<string>>;
	projects: Array<IProject>;
	task: TaskObj;
	onCloseContextMenu: () => void;
}

const DropdownProjects: React.FC<DropdownProjectsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedProject,
	setSelectedProject,
	projects,
	customClasses,
	task,
	onCloseContextMenu,
}) => {
	const [editTask] = useEditTaskMutation();
	const [filteredProjects, setFilteredProjects] = useState(projects);
	const [searchText, setSearchText] = useState('');
	const fuse = new Fuse(projects, {
		includeScore: true,
		keys: ['name'],
	});

	useEffect(() => {
		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [searchText, projects]);

	const handleDebouncedSearch = debounce(() => {
		let searchedProjects;

		if (searchText.trim() === '') {
			// If searchText is empty, consider all projects as the searched result.
			searchedProjects = projects.map((project) => ({ item: project }));
		} else {
			// When searchText is not empty, perform the search using Fuse.js
			searchedProjects = fuse.search(searchText);
		}

		setFilteredProjects(searchedProjects.map((result) => result.item));
	}, 1000);

	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, [filteredProjects]); // Triggered when 'filteredProjects' changes
	interface ProjectOptionProps {
		project: IProject;
	}

	const ProjectOption: React.FC<ProjectOptionProps> = ({ project }) => {
		const { name } = project;

		return (
			<div
				className="flex items-center justify-between cursor-pointer hover:bg-color-gray-300 p-2 rounded-lg"
				onClick={() => {
					setSelectedProject(project);
					setIsVisible(false);

					if (task) {
						// TODO: Edit task's project from here
						editTask({ taskId: task._id, payload: { projectId: project._id } });
					}

					if (onCloseContextMenu) {
						onCloseContextMenu();
					}
				}}
			>
				<div className="flex items-center gap-1">
					<Icon name="menu" customClass={`!text-[22px] hover:text-white cursor-p`} />
					{name}
				</div>
				{selectedProject.name === name && (
					<Icon
						name="check"
						fill={0}
						customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
					/>
				)}
			</div>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames(
				'ml-[-13px] mt-2 mb-2 shadow-2xl border border-color-gray-200 rounded-lg max-h-[300px]',
				customClasses
			)}
		>
			<div className="w-[200px]">
				<div className="flex items-center gap-1 p-1 px-2">
					<Icon
						name="search"
						fill={0}
						customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
					/>
					<input
						placeholder="Search"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="text-[13px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
					/>
				</div>

				<div
					ref={scrollRef}
					className="p-1 h-[250px] overflow-auto gray-scrollbar border-t border-color-gray-200"
				>
					{filteredProjects.map((project) => (
						<ProjectOption key={project.name} project={project} />
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownProjects;

import Fuse from 'fuse.js';
import { debounce } from '../../utils/helpers.utils';
import Dropdown from './Dropdown';
import Icon from '../Icon';
import { DropdownProps, IProject, TaskObj } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useEditTaskMutation } from '../../services/api';
import { SMART_LISTS } from '../../utils/smartLists.utils';

interface DropdownProjectsProps extends DropdownProps {
	selectedProject: string;
	setSelectedProject: React.Dispatch<React.SetStateAction<string>>;
	projects: Array<IProject>;
	task: TaskObj;
	onCloseContextMenu: () => void;
	showSmartLists: boolean;
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
	showSmartLists = false,
}) => {
	const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
	const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);

	const defaultProjects = [...projects, ...topListProjects];

	console.log(defaultProjects);

	const [editTask] = useEditTaskMutation();
	const [filteredProjects, setFilteredProjects] = useState(defaultProjects);
	const [searchText, setSearchText] = useState('');
	const fuse = new Fuse(defaultProjects, {
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
		const { name, _id, isFolder } = project;
		const smartList = SMART_LISTS[project.urlName];

		let iconName = isFolder ? 'folder' : smartList ? smartList.iconName : project.isInbox ? 'inbox' : 'menu';
		let isProjectSelected = smartList ? selectedProject.urlName === project.urlName : selectedProject._id === _id;

		return (
			<div
				className="flex items-center justify-between cursor-pointer hover:bg-color-gray-300 px-2 py-[6px] rounded-lg"
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
				<div className={classNames('flex items-center gap-1', isProjectSelected ? 'text-blue-500' : '')}>
					<Icon
						name={iconName}
						customClass={classNames(
							`!text-[22px] hover:text-white cursor-p`,
							isProjectSelected ? 'text-blue-500' : 'text-color-gray-100'
						)}
					/>
					{name}
				</div>
				{isProjectSelected && (
					<Icon
						name="check"
						fill={0}
						customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
					/>
				)}
			</div>
		);
	};

	const inboxProject = filteredProjects.find((project) => project.isInbox);
	const { nonSmartListProjects, smartListProjects } = filteredProjects.reduce(
		(acc, project) => {
			if (!project.isInbox && !SMART_LISTS[project.urlName]) {
				acc.nonSmartListProjects.push(project);
			} else {
				acc.smartListProjects.push(project);
			}
			return acc;
		},
		{ nonSmartListProjects: [], smartListProjects: [] }
	);

	// console.log(inboxProject);
	console.log(smartListProjects);
	console.log(nonSmartListProjects);

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
					{showSmartLists ? (
						<div>
							{topListProjects.map((project) => (
								<ProjectOption key={project.name} project={project} />
							))}
							{inboxProject && <ProjectOption key={inboxProject.name} project={inboxProject} />}
						</div>
					) : (
						inboxProject && <ProjectOption key={inboxProject.name} project={inboxProject} />
					)}

					{showSmartLists && <div className="px-2 mt-2 text-color-gray-100">Lists</div>}

					{nonSmartListProjects.map((project) => (
						<ProjectOption key={project.name} project={project} />
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownProjects;

import Fuse from 'fuse.js';
import { debounce } from '../../utils/helpers.utils';
import Dropdown from './Dropdown';
import Icon from '../Icon';
import { DropdownProps, IProject, TaskObj } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { memo, useEffect, useRef, useState } from 'react';
import { useEditTaskMutation } from '../../services/api';
import { SMART_LISTS } from '../../utils/smartLists.utils';

interface DropdownTagsProps extends DropdownProps {
	selectedItem?: Object;
	setSelectedItem?: React.Dispatch<React.SetStateAction<Object>>;
	selectedItemList: Array<Object>;
	setSelectedItemList?: React.Dispatch<React.SetStateAction<Array<Object>>>;
	items: Array<IProject>;
	task: TaskObj;
	onCloseContextMenu: () => void;
	showSmartLists: boolean;
	multiSelect: boolean;
}

const DropdownTags: React.FC<DropdownTagsProps> = memo(
	({
		toggleRef,
		isVisible,
		setIsVisible,
		selectedItem,
		setSelectedItem,
		selectedItemList,
		setSelectedItemList,
		items,
		customClasses,
		task,
		onCloseContextMenu,
		showSmartLists = false,
		multiSelect = false,
		type,
	}) => {
		const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
		const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);
		const defaultItems = type === 'project' ? [...items, ...topListProjects] : [items];

		const [editTask] = useEditTaskMutation();
		const [filteredItems, setFilteredItems] = useState(defaultItems);
		const [searchText, setSearchText] = useState('');
		const fuse = new Fuse(defaultItems, {
			includeScore: true,
			keys: ['name'],
		});

		useEffect(() => {
			handleDebouncedSearch();

			return () => {
				handleDebouncedSearch.cancel();
			};
		}, [searchText, items]);

		const handleDebouncedSearch = debounce(() => {
			let searchedItems;

			if (searchText.trim() === '') {
				// If searchText is empty, consider all projects as the searched result.
				searchedItems = defaultItems.map((item) => ({ item }));
			} else {
				// When searchText is not empty, perform the search using Fuse.js
				searchedItems = fuse.search(searchText);
			}

			setFilteredItems(searchedItems.map((result) => result.item));
		}, 1000);

		const scrollRef = useRef(null);

		useEffect(() => {
			if (scrollRef.current) {
				scrollRef.current.scrollTop = 0;
			}
		}, [filteredItems]); // Triggered when 'filteredProjects' changes

		const inboxProject = filteredItems.find((project) => project.isInbox);
		const allProject = filteredItems.find((project) => project.urlName === 'all');

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

		interface ProjectOptionProps {
			project: IProject;
		}

		const ProjectOption: React.FC<ProjectOptionProps> = ({ item }) => {
			const { name, _id, isFolder } = item;
			const smartList = type === 'project' && SMART_LISTS[item.urlName];

			const iconName =
				type === 'project'
					? isFolder
						? 'folder'
						: smartList
							? smartList.iconName
							: item.isInbox
								? 'inbox'
								: 'menu'
					: 'sell';

			const checkIfProjectSelected = () => {
				if (multiSelect) {
					return selectedItemList.find((itemInList) => itemInList._id === itemInList._id);
				} else {
					if (type === 'project' && smartList) {
						return selectedItem.urlName === item.urlName;
					} else {
						return selectedItem._id === _id;
					}
				}
			};

			const isItemSelected = checkIfItemSelected();

			return (
				<div
					className="flex items-center justify-between cursor-pointer hover:bg-color-gray-300 px-2 py-[6px] rounded-lg"
					onClick={() => {
						if (multiSelect) {
							const isAllProject = type === 'project' && item.urlName && item.urlName === 'all';
							let newSelectedItemList = [...selectedItemList];

							// If the item is already selected, then remove it.
							if (isItemSelected) {
								if ((type === 'project' && !isAllProject) || type !== 'project') {
									newSelectedItemList = newSelectedItemList.filter(
										(itemInList) => itemInList._id !== item._id
									);
								} else {
									// If the project being selected is the "All" project, then every other selected project should be removed.
									if (isAllProject) {
										newSelectedItemList = [item];
									} else {
										// If a normal project is selected, remove "all" as a specific project has been chosen.
										newSelectedItemList = newSelectedItemList.filter(
											(itemInList) => itemInList && itemInList.urlName !== 'all'
										);
										newSelectedItemList.push(item);
									}
								}
							}

							if (type === 'project') {
								if (newSelectedItemList.length === 0) {
									const allProject = filteredItems.find((item) => item.urlName === 'all');
									newSelectedItemList = [allProject];
								} else {
									const allMultiSelectProjects = [inboxProject, ...nonSmartListProjects];

									if (allMultiSelectProjects.length === newSelectedProjectsList.length) {
										newSelectedProjectsList = [allProject];
									}
								}
							}

							setSelectedItemList(newSelectedItemList);
						} else {
							setSelectedItem(item);
							setIsVisible(false);
						}

						if (task) {
							// TODO: Edit task's project from here
							editTask({ taskId: task._id, payload: { projectId: project._id } });
						}

						if (onCloseContextMenu) {
							onCloseContextMenu();
						}
					}}
				>
					<div className={classNames('flex items-center gap-1', isItemSelected ? 'text-blue-500' : '')}>
						<Icon
							name={iconName}
							customClass={classNames(
								`!text-[22px] hover:text-white cursor-p`,
								isItemSelected ? 'text-blue-500' : 'text-color-gray-100'
							)}
						/>
						{name}
					</div>
					{isItemSelected && (
						<Icon
							name="check"
							fill={0}
							customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
						/>
					)}
				</div>
			);
		};

		// TODO: Refactor all of this to NOT be specific to projects and instead be for projects or tags. I don't want to copy and paste all of this for tags as that seems inefficient.
		return (
			<Dropdown
				toggleRef={toggleRef}
				isVisible={isVisible}
				setIsVisible={setIsVisible}
				customClasses={classNames(
					'ml-[-13px] mt-2 mb-2 shadow-2xl border border-color-gray-200 rounded-lg max-h-[300px] w-[200px]',
					customClasses
				)}
			>
				<div>
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
								{smartListProjects
									.filter((project) => !project.isInbox)
									.map((project) => (
										<ProjectOption key={project.name} project={project} />
									))}
								{inboxProject && <ProjectOption key={inboxProject.name} project={inboxProject} />}
							</div>
						) : (
							<div>
								{multiSelect && allProject && (
									<ProjectOption key={allProject.name} project={allProject} />
								)}
								{inboxProject && <ProjectOption key={inboxProject.name} project={inboxProject} />}
							</div>
						)}

						{showSmartLists && nonSmartListProjects.length > 0 && (
							<div className="px-2 mt-2 text-color-gray-100 text-left">Lists</div>
						)}

						{nonSmartListProjects.map((project) => (
							<ProjectOption key={project.name} project={project} />
						))}
					</div>
				</div>
			</Dropdown>
		);
	}
);

export default DropdownTags;

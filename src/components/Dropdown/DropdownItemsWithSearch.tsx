import Fuse from 'fuse.js';
import { debounce } from '../../utils/helpers.utils';
import Dropdown from './Dropdown';
import Icon from '../Icon';
import { DropdownProps, IProject, TaskObj } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { memo, useEffect, useRef, useState } from 'react';
import { useAddTagMutation, useEditTaskMutation, useGetTagsQuery } from '../../services/api';
import { SMART_LISTS } from '../../utils/smartLists.utils';
import React from 'react';

interface DropdownItemsWithSearchProps extends DropdownProps {
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

const DropdownItemsWithSearch: React.FC<DropdownItemsWithSearchProps> = memo(
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
		// RTK Query - Tags
		const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
		const { tagsById } = fetchedTags || {};

		const [addTag] = useAddTagMutation();

		const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
		const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);
		const defaultItems = type === 'project' ? [...items, ...topListProjects] : items;

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

		const { nonSmartListProjects, smartListProjects } =
			type === 'project' &&
			filteredItems.reduce(
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

		interface ItemOptionProps {
			item: IProject;
		}

		const ItemOption: React.FC<ItemOptionProps> = ({ item, iconFill = 1 }) => {
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

			const checkIfItemSelected = () => {
				if (multiSelect) {
					return selectedItemList.find((itemInList) => itemInList._id === item._id);
				} else {
					if (type === 'project' && smartList) {
						return selectedItem.urlName === item.urlName;
					} else {
						return selectedItem._id === _id;
					}
				}
			};

			const isItemSelected = checkIfItemSelected();

			const handleClickProject = () => {
				if (multiSelect) {
					const isAllProject = item.urlName && item.urlName === 'all';
					let newSelectedProjectsList = [...selectedItemList];

					// If the project is already selected, then remove it.
					if (isItemSelected && !isAllProject) {
						newSelectedProjectsList = newSelectedProjectsList.filter(
							(projectInList) => projectInList._id !== project._id
						);
					} else {
						// If the project being selected is the "All" project, then every other selected project should be removed.
						if (isAllProject) {
							newSelectedProjectsList = [item];
						} else {
							// If a normal project is selected, remove "all" as a specific project has been chosen.
							newSelectedProjectsList = newSelectedProjectsList.filter(
								(projectInList) => projectInList && projectInList.urlName !== 'all'
							);
							newSelectedProjectsList.push(item);
						}
					}

					if (newSelectedProjectsList.length === 0) {
						const allProject = filteredItems.find((project) => project.urlName === 'all');
						newSelectedProjectsList = [allProject];
					} else {
						const allMultiSelectProjects = [inboxProject, ...nonSmartListProjects];

						if (allMultiSelectProjects.length === newSelectedProjectsList.length) {
							newSelectedProjectsList = [allProject];
						}
					}

					setSelectedItemList(newSelectedProjectsList);
				} else {
					setSelectedItem(item);
					setIsVisible(false);
				}

				if (task) {
					editTask({ taskId: task._id, payload: { projectId: item._id } });
				}

				if (onCloseContextMenu) {
					onCloseContextMenu();
				}
			};

			const handleClickTag = (e) => {
				e.stopPropagation();

				if (multiSelect) {
					let newSelectedItemList = [...selectedItemList];

					// If the item is already selected, then remove it.
					if (isItemSelected) {
						newSelectedItemList = newSelectedItemList.filter((itemInList) => itemInList._id !== item._id);
					} else {
						newSelectedItemList.push(item);
					}

					setSelectedItemList(newSelectedItemList);
				} else {
					setSelectedItem(item);
					setIsVisible(false);
				}

				if (onCloseContextMenu && !multiSelect) {
					onCloseContextMenu();
				}
			};

			return (
				<div>
					<div
						className="flex items-center justify-between cursor-pointer hover:bg-color-gray-300 px-2 py-[6px] rounded-lg"
						onClick={type === 'project' ? handleClickProject : handleClickTag}
					>
						<div className={classNames('flex items-center gap-1', isItemSelected ? 'text-blue-500' : '')}>
							<Icon
								name={iconName}
								customClass={classNames(
									`!text-[22px] hover:text-white cursor-p`,
									isItemSelected ? 'text-blue-500' : 'text-color-gray-100'
								)}
								fill={iconFill}
							/>
							<span className="overflow-hidden text-nowrap text-ellipsis max-w-[120px]">{name}</span>
						</div>
						{isItemSelected && (
							<Icon
								name="check"
								fill={0}
								customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
							/>
						)}
					</div>

					{type === 'tags' &&
						item?.children?.length > 0 &&
						item.children.map((childTagId) => {
							const childTag = tagsById[childTagId];

							return (
								<div key={childTagId} className="ml-6">
									<ItemOption item={childTag} iconFill={0} />
								</div>
							);
						})}
				</div>
			);
		};

		const ItemOptionList = () => {
			switch (type) {
				case 'project':
					return (
						<React.Fragment>
							{showSmartLists ? (
								<div>
									{smartListProjects
										.filter((project) => !project.isInbox)
										.map((project) => (
											<ItemOption key={project.name} item={project} />
										))}
									{inboxProject && <ItemOption key={inboxProject.name} item={inboxProject} />}
								</div>
							) : (
								<div>
									{multiSelect && allProject && (
										<ItemOption key={allProject.name} item={allProject} />
									)}
									{inboxProject && <ItemOption key={inboxProject.name} item={inboxProject} />}
								</div>
							)}

							{showSmartLists && nonSmartListProjects.length > 0 && (
								<div className="px-2 mt-2 text-color-gray-100 text-left">Lists</div>
							)}

							{nonSmartListProjects.map((project) => (
								<ItemOption key={project.name} item={project} />
							))}
						</React.Fragment>
					);
				case 'tags':
					return (
						<React.Fragment>
							{filteredItems.map((item) => {
								return <ItemOption key={item.name} item={item} iconFill={0} />;
							})}
						</React.Fragment>
					);
				default:
					return null;
			}
		};

		const noTagResults = type === 'tags' && filteredItems.length === 0;

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
							placeholder={type === 'tags' ? 'Type in a tag' : 'Search'}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							className="text-[13px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
						/>
					</div>

					<div
						ref={scrollRef}
						className="p-1 h-[200px] overflow-auto gray-scrollbar border-t border-color-gray-200"
					>
						<ItemOptionList />
					</div>

					{type === 'tags' && (
						<div className="grid grid-cols-2 gap-2 p-2 pt-4">
							<button
								className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200"
								onClick={() => {
									setIsVisible(false);
								}}
							>
								Cancel
							</button>
							<button
								disabled={filteredItems.length === 0 && type !== 'tags'}
								className="bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600"
								onClick={async () => {
									setIsVisible(false);
									const selectedItemListIds = selectedItemList.map((item) => item._id);

									// If there's no results upon searching for a tag, optionally allow the user to create the tag on the spot and then add to that task immediately.
									// TODO: This does work but it's possible to show search results of related tags even if they don't have the exact name the user needs. So, this needs to be refactored to check if NONE of the search results have the same name as the typed in text, then show the create button
									if (noTagResults) {
										// Create the tag first
										let newTag = {
											name: searchText,
											parentId: null,
											color: null,
										};

										const result = await addTag(newTag);
										const {
											data: { _id: newlyCreatedTagId },
										} = result;

										selectedItemListIds.push(newlyCreatedTagId);
									}

									await editTask({ taskId: task._id, payload: { tagIds: selectedItemListIds } });
									setSearchText('');
								}}
							>
								{noTagResults ? 'Create Tag' : 'Ok'}
							</button>
						</div>
					)}
				</div>
			</Dropdown>
		);
	}
);

export default DropdownItemsWithSearch;
import Fuse from 'fuse.js';
import { debounce } from '../../../utils/helpers.utils';
import Dropdown from '../Dropdown';
import Icon from '../../Icon';
import { DropdownProps, IProject, TaskObj } from '../../../interfaces/interfaces';
import classNames from 'classnames';
import { memo, useEffect, useRef, useState } from 'react';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import React from 'react';
import ItemOptionList from './ItemOptionList';
import ConfirmationButtons from './ConfirmationButtons';

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
		const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
		const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);
		const defaultItems = type === 'project' ? [...items, ...topListProjects] : items;

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
						<ItemOptionList
							type={type}
							showSmartLists={showSmartLists}
							smartListProjects={smartListProjects}
							inboxProject={inboxProject}
							multiSelect={multiSelect}
							allProject={allProject}
							nonSmartListProjects={nonSmartListProjects}
							filteredItems={filteredItems}
							selectedItem={selectedItem}
							setSelectedItem={setSelectedItem}
							selectedItemList={selectedItemList}
							setSelectedItemList={setSelectedItemList}
							setIsVisible={setIsVisible}
							task={task}
							onCloseContextMenu={onCloseContextMenu}
						/>
					</div>

					<ConfirmationButtons
						type={type}
						setIsVisible={setIsVisible}
						filteredItems={filteredItems}
						selectedItemList={selectedItemList}
						searchText={searchText}
						setSearchText={setSearchText}
						task={task}
					/>
				</div>
			</Dropdown>
		);
	}
);

export default DropdownItemsWithSearch;

import { useEffect, useRef, useState } from 'react';
import useResizeObserver from '../../../hooks/useResizeObserver';
import DropdownGeneralSelect from '../../StatsPage/DropdownGeneralSelect';
import Icon from '../../../components/Icon';
import Pagination from '../../../components/Pagination';
import Fuse from 'fuse.js';
import { debounce } from '../../../utils/helpers.utils';

const TopHeader = ({
	topHeaderRef,
	setHeaderHeight,
	groupedBy,
	setGroupedBy,
	sortedBy,
	setSortedBy,
	currentPage,
	setCurrentPage,
	totalPages,
	defaultFocusRecords,
	filteredFocusRecords,
	setFilteredFocusRecords,
	focusRecordListRef,
}) => {
	const [searchText, setSearchText] = useState('');
	const fuse = new Fuse(defaultFocusRecords, {
		includeScore: true,
		keys: [
			{ name: 'tasks.title', weight: 1 },
			{ name: 'note', weight: 1 },
			{ name: 'tasks.projectName', weight: 0.5 },
		],
	});

	useEffect(() => {
		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [searchText, defaultFocusRecords]);

	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [filteredFocusRecords]);

	const handleDebouncedSearch = debounce(() => {
		let searchedItems;

		if (searchText.trim() === '') {
			// If searchText is empty, consider all focus records as the searched result.
			searchedItems = defaultFocusRecords.map((focusRecord) => ({ item: focusRecord }));
		} else {
			// When searchText is not empty, perform the search using Fuse.js
			searchedItems = fuse.search(searchText);
		}

		setFilteredFocusRecords(searchedItems.map((result) => result.item));
	}, 1000);

	const dropdownGroupedByRef = useRef(null);
	const dropdownSortedByRef = useRef(null);
	const [isDropdownGroupedByVisible, setIsDropdownGroupedByVisible] = useState(false);
	const [isDropdownSortedByVisible, setIsDropdownSortedByVisible] = useState(false);

	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');

	console.log(filteredFocusRecords);

	return (
		<div ref={topHeaderRef}>
			<div className="flex justify-between items-center py-5 px-[50px]">
				<h2 className="font-bold text-[24px]">Focus Records</h2>

				<div className="flex items-center gap-2">
					<div className="relative">
						<div
							className="flex gap-[2px] bg-color-gray-600 py-2 px-4 rounded-md cursor-pointer"
							onClick={() => setIsDropdownGroupedByVisible(!isDropdownGroupedByVisible)}
						>
							<div>
								<span className="text-color-gray-50">Group By: </span>
								{groupedBy}
							</div>
							<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
						</div>

						<DropdownGeneralSelect
							toggleRef={dropdownGroupedByRef}
							isVisible={isDropdownGroupedByVisible}
							setIsVisible={setIsDropdownGroupedByVisible}
							selected={groupedBy}
							setSelected={setGroupedBy}
							selectedOptions={['Date', 'Task', 'Project', 'No Group']}
						/>
					</div>

					<div className="relative">
						<div
							className="flex gap-[2px] bg-color-gray-600 py-2 px-4 rounded-md cursor-pointer"
							onClick={() => setIsDropdownSortedByVisible(!isDropdownGroupedByVisible)}
						>
							<div>
								<span className="text-color-gray-50">Sort By: </span>
								{sortedBy}
							</div>
							<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
						</div>

						<DropdownGeneralSelect
							toggleRef={dropdownSortedByRef}
							isVisible={isDropdownSortedByVisible}
							setIsVisible={setIsDropdownSortedByVisible}
							selected={sortedBy}
							setSelected={setSortedBy}
							selectedOptions={['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most']}
						/>
					</div>

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
				</div>
			</div>

			{/* TODO: Move to the bottom of the focus records when done testing the Pagination and it works. */}
			{totalPages && (
				<div className="flex justify-center">
					<Pagination
						total={totalPages}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
					/>
				</div>
			)}
		</div>
	);
};

export default TopHeader;

import { useRef, useState, useEffect } from 'react';
import DropdownItemsWithSearch from '../../../components/Dropdown/DropdownItemsWithSearch/DropdownItemsWithSearch';
import Icon from '../../../components/Icon';
import { useCalendarContext } from '../../../contexts/useCalendarContext';

const TopHeader = ({
	selectedView,
	setHeaderHeight,
	selectedProjectsList,
	selectedTagList,
	setSelectedProjectsList,
	setSelectedTagList,
	setSelectedView,
	tagsWithNoParent,
	projects,
	isLoadingGetProjects,
	isLoadingGetTags,
}) => {
	const allViews = [
		{
			name: 'Projects',
			groupBy: 'project',
		},
		{
			name: 'Tags',
			groupBy: 'tag',
		},
		{
			name: 'Priority',
			groupBy: 'priority',
		},
	];
	const containerRef = useRef(null); // Ref for the container to allow relative positioning
	const topHeaderRef = useRef(null);

	const dropdownItemsWithSearchRef = useRef(null);
	const [isDropdownItemsWithSearchVisible, setIsDropdownItemsWithSearchVisible] = useState(false);

	const { setShowArrangeTasksSidebar } = useCalendarContext();
	const iconClassName = 'text-color-gray-50 !text-[18px] cursor-pointer p-1 hover:bg-color-gray-300 rounded';

	useEffect(() => {
		if (topHeaderRef.current && document.readyState === 'complete') {
			setHeaderHeight(topHeaderRef.current.getBoundingClientRect().height);
		}
	}, [topHeaderRef, setHeaderHeight, selectedView]);

	return (
		<div ref={topHeaderRef} className="px-3 pt-5 pb-3">
			<div className="flex items-center justify-between">
				<div>Arrange Tasks</div>
				<div className="flex items-center">
					<Icon
						name="filter_alt"
						fill={0}
						customClass={iconClassName}
						onClick={() => {
							setShowArrangeTasksSidebar(false);
						}}
					/>

					<Icon
						name="close"
						fill={0}
						customClass={iconClassName}
						onClick={() => {
							setShowArrangeTasksSidebar(false);
						}}
					/>
				</div>
			</div>
			<div
				ref={containerRef}
				className="relative grid grid-cols-3 gap-1 items-center border border-color-gray-300 p-1 rounded-md mt-3"
				style={{ position: 'relative' }}
			>
				{allViews.map((view, index) => (
					<div
						key={view.name}
						className={
							'rounded-md text-center p-[2px] cursor-pointer transition-all duration-300 ease-in-out text-white'
						}
						onClick={() => setSelectedView(view)}
						style={{
							position: 'relative',
							zIndex: 2,
						}}
					>
						{view.name}
					</div>
				))}

				{/* Background div that moves across the different views to smoothly animate the background color being changed when a new view is selected. */}
				<div
					className="bg-color-gray-300 absolute left-0 top-0 bottom-0 transition-all duration-300 ease-in-out"
					style={{
						width: `${100 / allViews.length}%`,
						//
						transform: `translateX(${allViews.findIndex((view) => view.name === selectedView.name) * 100}%)`,
					}}
				/>
			</div>
			{selectedView.name !== 'Priority' && (
				<div className="relative">
					<div
						ref={dropdownItemsWithSearchRef}
						className="flex items-center mt-4 cursor-pointer"
						onClick={() => setIsDropdownItemsWithSearchVisible(!isDropdownItemsWithSearchVisible)}
					>
						<div className="text-blue-500">All {selectedView.name}</div>
						<Icon
							name="chevron_right"
							fill={0}
							customClass="text-color-gray-50 !text-[18px] cursor-pointer p-1 mb-[-2.5px]"
						/>
					</div>

					{!isLoadingGetProjects && selectedView.name === 'Projects' && (
						<DropdownItemsWithSearch
							toggleRef={dropdownItemsWithSearchRef}
							isVisible={isDropdownItemsWithSearchVisible}
							setIsVisible={setIsDropdownItemsWithSearchVisible}
							selectedItemList={selectedProjectsList}
							setSelectedItemList={setSelectedProjectsList}
							items={projects}
							multiSelect={true}
							type="project"
						/>
					)}

					{!isLoadingGetTags && selectedView.name === 'Tags' && (
						<DropdownItemsWithSearch
							toggleRef={dropdownItemsWithSearchRef}
							isVisible={isDropdownItemsWithSearchVisible}
							setIsVisible={setIsDropdownItemsWithSearchVisible}
							selectedItemList={selectedTagList}
							setSelectedItemList={setSelectedTagList}
							items={tagsWithNoParent}
							multiSelect={true}
							type="tags"
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default TopHeader;

import { useRef, useState } from 'react';
import useResizeObserver from '../../../hooks/useResizeObserver';
import DropdownGeneralSelect from '../../StatsPage/DropdownGeneralSelect';
import Icon from '../../../components/Icon';

const TopHeader = ({ topHeaderRef, setHeaderHeight, groupedBy, setGroupedBy, sortedBy, setSortedBy }) => {
	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');

	const dropdownGroupedByRef = useRef(null);
	const dropdownSortedByRef = useRef(null);
	const [isDropdownGroupedByVisible, setIsDropdownGroupedByVisible] = useState(false);
	const [isDropdownSortedByVisible, setIsDropdownSortedByVisible] = useState(false);

	return (
		<div ref={topHeaderRef} className="flex justify-between items-center py-5 px-[50px]">
			<h2 className="font-bold text-[24px]">Focus Records Page</h2>

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
						selectedOptions={['Date', 'Task', 'Project']}
					/>
				</div>

				<div className="relative">
					<div
						className="flex gap-[2px] bg-color-gray-600 py-2 px-4 rounded-md cursor-pointer"
						onClick={() => setIsDropdownSortedByVisible(!isDropdownGroupedByVisible)}
					>
						<div>
							<span className="text-color-gray-50">Sort By: </span>
							{groupedBy}
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
			</div>
		</div>
	);
};

export default TopHeader;

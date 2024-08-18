import { useEffect, useRef, useState } from 'react';
import Icon from '../../components/Icon';
import DropdownIntervalSelect from './DropdownIntervalSelect';
import useContextMenu from '../../hooks/useContextMenu';
import DropdownAddNewTaskDetails from './DropdownAddNewTaskDetails';

const TopHeader = ({
	topHeaderRef,
	setHeaderHeight,
	showFilterSidebar,
	setShowFilterSidebar,
	currentDate,
	setCurrentDate,
	selectedInterval,
	setSelectedInterval,
	connectedCurrentDate,
	setConnectedCurrentDate,
}) => {
	useEffect(() => {
		if (topHeaderRef.current && document.readyState === 'complete') {
			setHeaderHeight(topHeaderRef.current.getBoundingClientRect().height);
		}
	}, [topHeaderRef, setHeaderHeight]);

	useEffect(() => {
		if (connectedCurrentDate) {
			setCurrentDate(connectedCurrentDate);
		}
	}, [connectedCurrentDate]);

	const dropdownIntervalSelectRef = useRef(null);
	const [isDropdownIntervalSelectVisible, setIsDropdownIntervalSelectVisible] = useState(false);

	const getName = () => {
		// TODO: For now, assume the interval is always monthly. This logic has to be reworked once other intervals come into play.
		if (selectedInterval === 'Month') {
			const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
			return `${currentMonth}`;
		}
	};

	const goToPreviousMonth = () => {
		const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
		setCurrentDate(prevMonth);
		setConnectedCurrentDate(prevMonth);
	};

	const goToNextMonth = () => {
		const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
		setCurrentDate(nextMonth);
		setConnectedCurrentDate(nextMonth);
	};

	const contextMenuObj = useContextMenu();
	const { handleContextMenu } = contextMenuObj;

	return (
		<div ref={topHeaderRef} className="p-3 pt-5 flex justify-between items-center">
			<div className="flex items-center gap-2">
				<Icon
					name="left_panel_open"
					fill={0}
					customClass="text-color-gray-100 cursor-pointer"
					onClick={() => setShowFilterSidebar(!showFilterSidebar)}
				/>
				<div className="text-[18px] font-bold">{getName()}</div>
			</div>

			<div className="flex items-center gap-3">
				<Icon
					name="add"
					customClass="text-color-gray-100 !text-[18px] p-1 border border-color-gray-150 rounded cursor-pointer hover:text-blue-500"
					onClick={(e) => {
						e.stopPropagation();
						handleContextMenu(e);
					}}
				/>

				<div className="relative">
					<div
						ref={dropdownIntervalSelectRef}
						onClick={() => setIsDropdownIntervalSelectVisible(!isDropdownIntervalSelectVisible)}
						className="border border-color-gray-150 py-1 pl-3 pr-2 rounded hover:text-blue-500 flex items-center gap-[2px] cursor-pointer"
					>
						<span>{selectedInterval}</span>
						<Icon name="keyboard_arrow_down" customClass="text-color-gray-100 !text-[18px]" />
					</div>

					<DropdownIntervalSelect
						toggleRef={dropdownIntervalSelectRef}
						isVisible={isDropdownIntervalSelectVisible}
						setIsVisible={setIsDropdownIntervalSelectVisible}
						selected={selectedInterval}
						setSelected={setSelectedInterval}
					/>
				</div>

				<div>
					<div className="border border-color-gray-150 py-1 px-2 rounded flex items-center cursor-pointer justify-between gap-3">
						<Icon
							name="keyboard_arrow_left"
							customClass="text-color-gray-100 !text-[18px] hover:text-blue-500"
							onClick={goToPreviousMonth}
						/>
						<span className="hover:text-blue-500">{getName()}</span>
						<Icon
							name="keyboard_arrow_right"
							customClass="text-color-gray-100 !text-[18px] hover:text-blue-500"
							onClick={goToNextMonth}
						/>
					</div>
				</div>

				<Icon
					name="more_horiz"
					customClass="text-color-gray-100 !text-[20px] cursor-pointer hover:text-blue-500 p-1 rounded hover:bg-color-gray-300"
				/>
			</div>

			<DropdownAddNewTaskDetails contextMenuObj={contextMenuObj} />
		</div>
	);
};

export default TopHeader;

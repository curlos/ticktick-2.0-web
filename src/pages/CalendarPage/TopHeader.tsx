import { useEffect, useRef, useState } from 'react';
import Icon from '../../components/Icon';
import useContextMenu from '../../hooks/useContextMenu';
import DropdownTopHeaderMoreOptions from './Dropdown/DropdownTopHeaderMoreOptions';
import DropdownIntervalSelect from './Dropdown/DropdownIntervalSelect';
import ModalViewOptions from './ModalViewOptions';
import { useCalendarContext } from '../../contexts/useCalendarContext';
import DropdownAddNewTaskDetails from '../../components/Dropdown/DropdownAddNewTaskDetails';
import useResizeObserver from '../../hooks/useResizeObserver';
import { formatCheckedInDayDate, getAllDaysInWeekFromDate, getAllMultiDaysFromDate } from '../../utils/date.utils';

const TopHeader = () => {
	const {
		connectedCurrentDate,
		setConnectedCurrentDate,
		topHeaderRef,
		setHeaderHeight,
		showFilterSidebar,
		setShowFilterSidebar,
		currentDate,
		setCurrentDate,
		currDueDate,
		setCurrDueDate,
		selectedInterval,
		setSelectedInterval,
		multiDays,
	} = useCalendarContext();

	const [isModalViewOptionsOpen, setIsModalViewOptionsOpen] = useState(false);

	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');

	useEffect(() => {
		if (connectedCurrentDate) {
			setCurrentDate(connectedCurrentDate);
		}
	}, [connectedCurrentDate]);

	// Dropdown Refs and States
	const dropdownIntervalSelectRef = useRef(null);
	const [isDropdownIntervalSelectVisible, setIsDropdownIntervalSelectVisible] = useState(false);

	const dropdownTopHeaderMoreOptions = useRef(null);
	const [isDropdownTopHeaderMoreOptionsVisible, setIsDropdownTopHeaderMoreOptionsVisible] = useState(false);

	const allDaysInWeekFromDate = getAllDaysInWeekFromDate(currentDate);
	const allMultiDaysFromDate = getAllMultiDaysFromDate(currentDate, multiDays);

	console.log(allMultiDaysFromDate);

	const getName = () => {
		switch (selectedInterval) {
			case 'Day': {
				const currentDay = currDueDate?.toLocaleString('default', {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				});
				return currentDay;
			}
			case 'Week': {
				const firstDay = formatCheckedInDayDate(allDaysInWeekFromDate[0]);
				const lastDay = formatCheckedInDayDate(allDaysInWeekFromDate[allDaysInWeekFromDate.length - 1]);
				return `${firstDay} - ${lastDay}`;
			}
			case 'Month': {
				const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
				return currentMonth;
			}
		}
	};

	const goToPrevious = () => {
		switch (selectedInterval) {
			case 'Day':
				goToPreviousDay();
				break;
			case 'Week':
				goToPreviousWeek();
				break;
			case 'Month':
				goToPreviousMonth();
				break;
			default:
				return;
		}
	};

	const goToNext = () => {
		switch (selectedInterval) {
			case 'Day':
				goToNextDay();
				break;
			case 'Week':
				goToNextWeek();
				break;
			case 'Month':
				goToNextMonth();
				break;
			default:
				return;
		}
	};

	const goToPreviousDay = () => {
		const prevDay = new Date(currDueDate);
		prevDay.setDate(currDueDate.getDate() - 1);
		setCurrDueDate(prevDay);
	};

	const goToNextDay = () => {
		const nextDay = new Date(currDueDate);
		nextDay.setDate(currDueDate.getDate() + 1);
		setCurrDueDate(nextDay);
	};

	const goToPreviousWeek = () => {
		const prevWeek = new Date(currentDate);
		prevWeek.setDate(currentDate.getDate() - 7);
		setCurrentDate(prevWeek);
		setConnectedCurrentDate(prevWeek);
	};

	const goToNextWeek = () => {
		const nextWeek = new Date(currentDate);
		nextWeek.setDate(currentDate.getDate() + 7);
		setCurrentDate(nextWeek);
		setConnectedCurrentDate(nextWeek);
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
		<div ref={topHeaderRef}>
			<div className="p-3 pt-5 flex justify-between items-center">
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

					{/* TODO: Make this work for the "Day View" as well. */}
					<div>
						<div className="border border-color-gray-150 py-1 px-2 rounded flex items-center cursor-pointer justify-between gap-3">
							<Icon
								name="keyboard_arrow_left"
								customClass="text-color-gray-100 !text-[18px] hover:text-blue-500"
								onClick={goToPrevious}
							/>
							<span className="hover:text-blue-500">{getName()}</span>
							<Icon
								name="keyboard_arrow_right"
								customClass="text-color-gray-100 !text-[18px] hover:text-blue-500"
								onClick={goToNext}
							/>
						</div>
					</div>

					<div className="relative">
						<Icon
							name="more_horiz"
							customClass="text-color-gray-100 !text-[20px] cursor-pointer hover:text-blue-500 p-1 rounded hover:bg-color-gray-300"
							onClick={() =>
								setIsDropdownTopHeaderMoreOptionsVisible(!isDropdownTopHeaderMoreOptionsVisible)
							}
						/>

						<DropdownTopHeaderMoreOptions
							toggleRef={dropdownTopHeaderMoreOptions}
							isVisible={isDropdownTopHeaderMoreOptionsVisible}
							setIsVisible={setIsDropdownTopHeaderMoreOptionsVisible}
							{...{
								isModalViewOptionsOpen,
								setIsModalViewOptionsOpen,
							}}
						/>
					</div>
				</div>

				<DropdownAddNewTaskDetails contextMenuObj={contextMenuObj} />

				<ModalViewOptions isOpen={isModalViewOptionsOpen} setIsOpen={setIsModalViewOptionsOpen} />
			</div>

			{/* TODO: Should use the current day's date instead of a random "Tue". For later. */}
			{selectedInterval === 'Day' && (
				<div className="text-center text-color-gray-100 border-b border-color-gray-200 pb-2">Tue</div>
			)}

			{selectedInterval === 'Week' && (
				<div className="text-center text-color-gray-100 border-b border-color-gray-200 pb-2 flex mt-2">
					<div className="w-[90px]"></div>

					<div className="grid grid-cols-7 flex-1">
						{allDaysInWeekFromDate.map((day) => (
							<div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
						))}
					</div>
				</div>
			)}

			{selectedInterval === 'Multi-Day' && (
				<div className="text-center text-color-gray-100 border-b border-color-gray-200 pb-2 flex mt-2">
					<div className="w-[90px]"></div>

					<div className="flex flex-1">
						{allMultiDaysFromDate.map((day) => (
							<div className="flex-1">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default TopHeader;

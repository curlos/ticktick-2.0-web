import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../components/Icon';
import { setModalState } from '../../slices/modalSlice';
import DropdownIntervalSelect from './DropdownIntervalSelect';
import { formatCheckedInDayDate, getCalendarMonth } from '../../utils/date.utils';

const TopHeader = ({ showFilterSidebar, setShowFilterSidebar, calendarDateRange, setCalendarDateRange }) => {
	const dispatch = useDispatch();

	const dropdownIntervalSelectRef = useRef(null);
	const [isDropdownIntervalSelectVisible, setIsDropdownIntervalSelectVisible] = useState(false);
	const [selectedInterval, setSelectedInterval] = useState('Month');

	const getName = () => {
		// TODO: For now, assume the interval is always monthly. This logic has to be reworked once other intervals come into play.
		const isMonthly = true;

		if (isMonthly) {
			const firstDay = calendarDateRange[0][0];

			const lastRow = calendarDateRange[calendarDateRange.length - 1];
			const lastDay = lastRow[lastRow.length - 1];

			return `${formatCheckedInDayDate(firstDay)} - ${formatCheckedInDayDate(lastDay)}`;
		}
	};

	const handleGoBack = () => {
		const middleNum = Math.round(calendarDateRange.length / 2);
		const middleRow = calendarDateRange[middleNum];
		const firstDateMiddleRow = middleRow[0];
		setCalendarDateRange(getCalendarMonth(firstDateMiddleRow.getFullYear(), firstDateMiddleRow.getMonth() - 1, 5));
	};

	const handleGoForward = () => {
		const middleNum = Math.round(calendarDateRange.length / 2);
		const middleRow = calendarDateRange[middleNum];
		const firstDateMiddleRow = middleRow[0];
		const newCalendarDateRange = getCalendarMonth(
			firstDateMiddleRow.getFullYear(),
			firstDateMiddleRow.getMonth() + 1,
			5
		);

		setCalendarDateRange(newCalendarDateRange);
	};

	return (
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
					onClick={() => dispatch(setModalState({ modalId: 'ModalAddTaskForm', isOpen: true }))}
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
							onClick={handleGoBack}
						/>
						<span className="hover:text-blue-500">{getName()}</span>
						<Icon
							name="keyboard_arrow_right"
							customClass="text-color-gray-100 !text-[18px] hover:text-blue-500"
							onClick={handleGoForward}
						/>
					</div>
				</div>

				<Icon
					name="more_horiz"
					customClass="text-color-gray-100 !text-[20px] cursor-pointer hover:text-blue-500 p-1 rounded hover:bg-color-gray-300"
				/>
			</div>
		</div>
	);
};

export default TopHeader;

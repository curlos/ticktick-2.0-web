import { useEffect } from 'react';
import Icon from '../../../components/Icon';
import {
	getAllDaysInWeekFromDate,
	getAllDaysInMonthFromDate,
	formatCheckedInDayDate,
	getAllDaysInYearFromDate,
} from '../../../utils/date.utils';

const DateRangePicker = ({ selectedDates, setSelectedDates, selectedInterval, startDate, endDate }) => {
	useEffect(() => {
		switch (selectedInterval) {
			case 'Day':
				setSelectedDates([selectedDates[0]]);
				break;
			case 'Week':
				setSelectedDates(getAllDaysInWeekFromDate(selectedDates[0]));
				break;
			case 'Month':
				setSelectedDates(getAllDaysInMonthFromDate(selectedDates[0]));
				break;
			case 'Year':
				setSelectedDates(getAllDaysInYearFromDate(selectedDates[0]));
				break;
				break;
		}
	}, [selectedInterval]);

	const handleArrowClick = (arrowType) => {
		const date = new Date(selectedDates[0]);
		switch (selectedInterval) {
			case 'Day':
				date.setDate(date.getDate() + (arrowType === 'left' ? -1 : 1));
				setSelectedDates([date]);
				break;
			case 'Week':
				date.setDate(date.getDate() + (arrowType === 'left' ? -7 : 7));
				setSelectedDates(getAllDaysInWeekFromDate(date));
				break;
			case 'Month':
				date.setMonth(date.getMonth() + (arrowType === 'left' ? -1 : 1));
				setSelectedDates(getAllDaysInMonthFromDate(date));
				break;
			case 'Year':
				date.setFullYear(date.getFullYear() + (arrowType === 'left' ? -1 : 1));

				setSelectedDates(getAllDaysInYearFromDate(date)); // Depending on your app's need, adjust this line
				break;
			default:
				break;
		}
	};

	const getFormattedSelectedDates = () => {
		switch (selectedInterval) {
			case 'Day':
				return formatCheckedInDayDate(selectedDates[0]);
			case 'Week':
				return `${formatCheckedInDayDate(selectedDates[0])} - ${formatCheckedInDayDate(selectedDates[selectedDates.length - 1])}`;
			case 'Month':
				return selectedDates[0].toLocaleString('default', { month: 'long', year: 'numeric' });
			case 'Year':
				return selectedDates[0].toLocaleString('default', { year: 'numeric' });
			case 'Custom':
				return `${formatCheckedInDayDate(startDate)} - ${formatCheckedInDayDate(endDate)}`;
		}
	};

	return (
		<div className="flex justify-between items-center gap-3 bg-color-gray-600 py-2 rounded-md">
			<Icon
				name="keyboard_arrow_left"
				customClass="!text-[20px] mt-[2px] cursor-pointer text-color-gray-100"
				onClick={() => {
					handleArrowClick('left');
				}}
			/>
			<div>{getFormattedSelectedDates()}</div>
			<Icon
				name="keyboard_arrow_right"
				customClass="!text-[20px] mt-[2px] cursor-pointer text-color-gray-100"
				onClick={() => {
					handleArrowClick('right');
				}}
			/>
		</div>
	);
};

export default DateRangePicker;

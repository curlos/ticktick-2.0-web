import { useRef, useState, useEffect } from 'react';
import Icon from '../../../components/Icon';
import { getAllDaysInWeekFromDate, getAllDaysInMonthFromDate, formatCheckedInDayDate } from '../../../utils/date.utils';
import DropdownGeneralSelect from '../DropdownGeneralSelect';
import ClassifiedCompletionStatisticsCard from './ClassifiedCompletionStatisticsCard';
import CompletionDistributionCard from './CompletionDistributionCard';
import CompletionRateDistributionCard from './CompletionRateDistributionCard';
import OverviewCard from './OverviewCard';

const TaskSection = () => {
	const dropdownRef = useRef(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [selectedTimeInterval, setSelectedTimeInterval] = useState('Daily');
	const selectedTimeIntervalOptions = ['Daily', 'Weekly', 'Monthly'];
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	useEffect(() => {
		switch (selectedTimeInterval) {
			case 'Daily':
				setSelectedDates([selectedDates[0]]);
				break;
			case 'Weekly':
				setSelectedDates(getAllDaysInWeekFromDate(selectedDates[0]));
				break;
			case 'Monthly':
				setSelectedDates(getAllDaysInMonthFromDate(selectedDates[0]));
				break;
		}
	}, [selectedTimeInterval]);

	const getFormattedSelectedDates = () => {
		switch (selectedTimeInterval) {
			case 'Daily':
				return formatCheckedInDayDate(selectedDates[0]);
			case 'Weekly':
				return `${formatCheckedInDayDate(selectedDates[0])} - ${formatCheckedInDayDate(selectedDates[selectedDates.length - 1])}`;
			case 'Monthly':
				return selectedDates[0].toLocaleString('default', { month: 'long', year: 'numeric' });
		}
	};

	const handleArrowClick = (arrowType) => {
		const date = new Date(selectedDates[0]);
		switch (selectedTimeInterval) {
			case 'Daily':
				date.setDate(date.getDate() + (arrowType === 'left' ? -1 : 1));
				setSelectedDates([date]);
				break;
			case 'Weekly':
				date.setDate(date.getDate() + (arrowType === 'left' ? -7 : 7));
				setSelectedDates(getAllDaysInWeekFromDate(date));
				break;
			case 'Monthly':
				date.setMonth(date.getMonth() + (arrowType === 'left' ? -1 : 1));
				setSelectedDates(getAllDaysInMonthFromDate(date));
				break;
			default:
				break;
		}
	};

	return (
		<div>
			<div className="flex gap-4">
				<div className="relative">
					<div
						className="flex gap-[2px] bg-color-gray-600 py-2 px-4 rounded-md cursor-pointer"
						onClick={() => setIsDropdownVisible(!isDropdownVisible)}
					>
						<div>{selectedTimeInterval}</div>
						<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
					</div>

					<DropdownGeneralSelect
						toggleRef={dropdownRef}
						isVisible={isDropdownVisible}
						setIsVisible={setIsDropdownVisible}
						selected={selectedTimeInterval}
						setSelected={setSelectedTimeInterval}
						selectedOptions={selectedTimeIntervalOptions}
					/>
				</div>

				{/* TODO: In the future, it might be a good idea to use the DropdownCalendar to select a range of dates from the calendar in a more custom manner. I think the IOS app lets you do it so should do it that way. */}
				<div className="flex justify-between gap-3 bg-color-gray-600 py-2 px-2 rounded-md">
					<Icon
						name="keyboard_arrow_left"
						customClass="!text-[18px] mt-[2px] cursor-pointer"
						onClick={() => handleArrowClick('left')}
					/>
					<div>{getFormattedSelectedDates()}</div>
					<Icon
						name="keyboard_arrow_right"
						customClass="!text-[18px] mt-[2px] cursor-pointer"
						onClick={() => handleArrowClick('right')}
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-5 mt-3">
				<OverviewCard {...{ selectedTimeInterval, selectedDates }} />
				<CompletionDistributionCard {...{ selectedTimeInterval }} />
				{/* <CompletionRateDistributionCard /> */}
				<ClassifiedCompletionStatisticsCard {...{ selectedTimeInterval }} />
			</div>
		</div>
	);
};

export default TaskSection;

import classNames from 'classnames';
import { useState, useRef } from 'react';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { getAllDatesInYear, getFormattedLongDay } from '../../../utils/date.utils';
import { useStatsContext } from '../../../contexts/useStatsContext';
import {
	getFocusDurationFromArray,
	getFormattedDuration,
	secondsToHoursAndMinutes,
} from '../../../utils/helpers.utils';

interface CalendarHeatmapProps {
	data: number[]; // Array of numbers (0-4)
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ selectedDates }) => {
	const { focusRecordsGroupedByDate } = useStatsContext();

	const allDatesInYear = getAllDatesInYear(selectedDates[0].getFullYear());

	const durations = [
		{
			value: '0m',
			bgColor: 'bg-color-gray-600',
		},
		{
			value: '0-59m',
			bgColor: 'bg-blue-200',
		},
		{
			value: '1h+',
			bgColor: 'bg-blue-300',
		},
		{
			value: '2h+',
			bgColor: 'bg-blue-400',
		},
		{
			value: '3h+',
			bgColor: 'bg-blue-500',
		},
		{
			value: '4h+',
			bgColor: 'bg-blue-600',
		},
		{
			value: '5h+',
			bgColor: 'bg-blue-800',
		},
		{
			value: '6h+',
			bgColor: 'bg-blue-900',
		},
	];

	const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return (
		<div className="flex gap-2 justify-between items-end">
			<div>
				<div className="flex justify-between text-color-gray-100">
					{monthsShort.map((month) => (
						<div key={month}>{month}</div>
					))}
				</div>
				<div className="flex flex-col flex-wrap max-h-[210px]">
					{allDatesInYear.map((date) => (
						<CalendarDay
							key={date.toLocaleDateString()}
							date={date}
							focusRecordsGroupedByDate={focusRecordsGroupedByDate}
						/>
					))}
				</div>
			</div>

			<div className="space-y-1">
				{durations.map((duration) => (
					<div key={duration.value} className="flex items-center text-color-gray-100 gap-1">
						<div
							className={classNames(`h-[13px] w-[13px] border border-color-gray-100`, duration.bgColor)}
						></div>
						{duration.value}
					</div>
				))}
			</div>
		</div>
	);
};

const CalendarDay = ({ date, focusRecordsGroupedByDate }) => {
	const [isHovering, setIsHovering] = useState(false);
	const dropdownRef = useRef(null);

	const dateKey = getFormattedLongDay(date);
	const focusRecordsFromDate = (focusRecordsGroupedByDate && focusRecordsGroupedByDate[dateKey]) || [];
	const focusDurationForDay = getFocusDurationFromArray(focusRecordsFromDate);
	const { hours, minutes } = secondsToHoursAndMinutes(focusDurationForDay);
	const rangeClass = getRangeClass(hours, minutes);

	const formattedDurationForTheDay = getFormattedDuration(focusDurationForDay, false);

	return (
		<div className="relative">
			<div
				key={date.toLocaleDateString()}
				className={classNames(
					`h-[15px] w-[15px] cursor-pointer border-[1.25px] border-color-gray-600 hover:border-[2px] hover:border-sky-400`,
					rangeClass
				)}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			></div>

			<Dropdown
				toggleRef={dropdownRef}
				isVisible={isHovering}
				setIsVisible={setIsHovering}
				customClasses={'!bg-black'}
			>
				<div className="p-2 text-[12px] text-blue-500 bg-black text-nowrap rounded">
					{dateKey} - {formattedDurationForTheDay}
				</div>
			</Dropdown>
		</div>
	);
};

const getRangeClass = (hours, minutes): string => {
	if (hours === 6) {
		return 'bg-blue-900';
	}

	if (hours === 5) {
		return 'bg-blue-700';
	}

	if (hours === 4) {
		return 'bg-blue-600';
	}

	if (hours === 3) {
		return 'bg-blue-500';
	}

	if (hours === 2) {
		return 'bg-blue-400';
	}

	if (hours === 1) {
		return 'bg-blue-300';
	}

	if (minutes > 0) {
		return 'bg-blue-100';
	}

	if (hours === 0 && minutes === 0) {
		return 'bg-color-gray-700';
	}
};

export default CalendarHeatmap;

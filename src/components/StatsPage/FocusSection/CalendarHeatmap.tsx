import React, { useRef, useState } from 'react';
import { getAllDatesInYear } from '../../../utils/date.utils';
import classNames from 'classnames';
import Dropdown from '../../Dropdown/Dropdown';

interface CalendarHeatmapProps {
	data: number[]; // Array of numbers (0-4)
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ data = [1] }) => {
	const allDatesInYear = getAllDatesInYear(2024);

	const durations = [
		{
			value: '0m',
			bgColor: 'bg-transparent',
		},
		{
			value: '0-1h',
			bgColor: 'bg-gray-300',
		},
		{
			value: '1h-3h',
			bgColor: 'bg-blue-300',
		},
		{
			value: '3h-5h',
			bgColor: 'bg-blue-500',
		},
		{
			value: '>5h',
			bgColor: 'bg-blue-800',
		},
	];

	return (
		<div className="flex gap-2 justify-between items-end">
			<div className="flex flex-col flex-wrap w-[80%] max-h-[200px]">
				{allDatesInYear.map((date) => (
					<CalendarDay date={date} />
				))}
			</div>

			<div className="space-y-1">
				{durations.map((duration) => (
					<div className="flex items-center text-color-gray-100 gap-1">
						<div
							key={duration.value}
							className={classNames(`h-[13px] w-[13px] border border-color-gray-100`, duration.bgColor)}
						></div>
						{duration.value}
					</div>
				))}
			</div>
		</div>
	);
};

const CalendarDay = ({ date }) => {
	const [isHovering, setIsHovering] = useState(false);
	const dropdownRef = useRef(null);
	const rangeClass = getRangeClass(Math.floor(Math.random() * 5));

	return (
		<div className="relative">
			<div
				key={date.toLocaleDateString()}
				className={classNames(
					`h-[15px] w-[15px] cursor-pointer border border-[1.5px] border-black hover:border-[2px] hover:border-sky-400`,
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
					{date.toLocaleDateString()}
				</div>
			</Dropdown>
		</div>
	);
};

const getRangeClass = (value: number): string => {
	switch (value) {
		case 0:
			return 'bg-gray-300';
		case 1:
			return 'bg-blue-300';
		case 2:
			return 'bg-blue-500';
		case 3:
			return 'bg-blue-600';
		case 4:
			return 'bg-blue-800';
		default:
			return 'bg-gray-100';
	}
};

export default CalendarHeatmap;

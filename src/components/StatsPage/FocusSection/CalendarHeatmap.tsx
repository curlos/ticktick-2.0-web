import React, { useRef, useState } from 'react';
import { getAllDatesInYear } from '../../../utils/date.utils';
import classNames from 'classnames';
import Dropdown from '../../Dropdown/Dropdown';

interface CalendarHeatmapProps {
	data: number[]; // Array of numbers (0-4)
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ data = [1] }) => {
	const allDatesInYear = getAllDatesInYear(2024);

	return (
		<div className="flex flex-wrap rever w-[85%]">
			{allDatesInYear.map((date) => (
				<CalendarDay date={date} />
			))}
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

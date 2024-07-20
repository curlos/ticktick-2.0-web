import React from 'react';
import { getAllDatesInYear } from '../../../utils/date.utils';
import classNames from 'classnames';

interface CalendarHeatmapProps {
	data: number[]; // Array of numbers (0-4)
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ data = [1] }) => {
	// Helper to get range class based on data value
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

	const allDatesInYear = getAllDatesInYear(2024);

	return (
		<div className="flex flex-wrap gap-[2px] w-[85%]">
			{allDatesInYear.map((date) => {
				const rangeClass = getRangeClass(Math.floor(Math.random() * 5));

				return (
					<div key={date.toLocaleDateString()} className={classNames(`h-[13px] w-[13px]`, rangeClass)}></div>
				);
			})}
		</div>
	);
};

export default CalendarHeatmap;

import { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import CalendarHeatmap from './CalendarHeatmap';

const data = [
	{
		name: 'July 8',
		seconds: 15060,
	},
	{
		name: 'July 9',
		seconds: 19140,
	},
	{
		name: 'July 10',
		seconds: 20040,
	},
	{
		name: 'July 11',
		seconds: 20940,
	},
	{
		name: 'July 12',
		seconds: 18180,
	},
	{
		name: 'July 13',
		seconds: 21600,
	},
	{
		name: 'July 14',
		seconds: 10800,
	},
];

const YearGridsCard = () => {
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-6">
				<h3 className="font-bold text-[16px]">Year Grids</h3>

				<DateRangePicker
					selectedDates={selectedDates}
					setSelectedDates={setSelectedDates}
					selectedInterval={'Year'}
				/>
			</div>

			<CalendarHeatmap />
		</div>
	);
};

export default YearGridsCard;

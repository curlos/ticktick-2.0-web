import { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import CalendarHeatmap from './CalendarHeatmap';

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

			<CalendarHeatmap selectedDates={selectedDates} />
		</div>
	);
};

export default YearGridsCard;

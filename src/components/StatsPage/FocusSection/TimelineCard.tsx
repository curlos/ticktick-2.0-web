import { useState } from 'react';
import TimelineChart from './TimelineChart';
import DateRangePicker from './DateRangePicker';

const TimelineCard = () => {
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center">
				<h3 className="font-bold text-[16px]">Timeline</h3>

				<DateRangePicker
					selectedDates={selectedDates}
					setSelectedDates={setSelectedDates}
					selectedInterval={'Week'}
				/>
			</div>

			<div className="mt-[-10px]">
				<TimelineChart />
			</div>
		</div>
	);
};

export default TimelineCard;

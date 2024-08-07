import DayView from './DayView';
import MonthView from './MonthView';

const Calendar = () => {
	return (
		<div className="flex flex-col flex-1 h-full">
			{/* <DayView /> */}
			<MonthView />
		</div>
	);
};

export default Calendar;

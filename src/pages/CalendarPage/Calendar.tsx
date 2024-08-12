import DayView from './DayView';
import MonthView from './MonthView';

const Calendar = ({ calendarDateRange }) => {
	return (
		<div className="flex flex-col flex-1 max-h-screen">
			{/* <DayView /> */}
			<MonthView calendarDateRange={calendarDateRange} />
		</div>
	);
};

export default Calendar;

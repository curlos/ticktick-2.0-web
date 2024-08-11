import DayView from './DayView';
import MonthView from './MonthView';

const Calendar = () => {
	return (
		<div className="flex flex-col flex-1 max-h-screen">
			{/* <DayView /> */}
			<MonthView />
		</div>
	);
};

export default Calendar;

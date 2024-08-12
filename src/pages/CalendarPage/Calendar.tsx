import DayView from './DayView';
import MonthView from './MonthView';

const Calendar = ({ currentDate }) => {
	return (
		<div className="flex flex-col flex-1 max-h-screen">
			{/* <DayView /> */}
			<MonthView currentDate={currentDate} />
		</div>
	);
};

export default Calendar;

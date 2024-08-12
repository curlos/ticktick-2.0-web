import AgendaView from './AgendaView';
import DayView from './DayView';
import MonthView from './MonthView';

const Calendar = ({ currentDate, selectedInterval }) => {
	return (
		<div className="flex flex-col flex-1 max-h-screen">
			{selectedInterval === 'Day' && <DayView currentDate={currentDate} />}
			{selectedInterval === 'Month' && <MonthView currentDate={currentDate} />}
			{selectedInterval === 'Agenda' && <AgendaView currentDate={currentDate} />}
		</div>
	);
};

export default Calendar;

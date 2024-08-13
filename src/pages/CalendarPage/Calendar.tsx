import useMaxHeight from '../../hooks/useMaxHeight';
import AgendaView from './AgendaView';
import DayView from './DayView';
import MonthView from './MonthView';

const Calendar = ({ currentDate, selectedInterval, headerHeight }) => {
	console.log(headerHeight);
	const maxHeight = useMaxHeight(headerHeight);

	return (
		<div className="flex flex-col flex-1" style={{ maxHeight }}>
			{selectedInterval === 'Day' && <DayView currentDate={currentDate} />}
			{selectedInterval === 'Month' && <MonthView currentDate={currentDate} />}
			{selectedInterval === 'Agenda' && <AgendaView currentDate={currentDate} />}
		</div>
	);
};

export default Calendar;

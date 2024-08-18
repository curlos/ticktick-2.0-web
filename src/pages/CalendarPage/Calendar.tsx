import useGroupedItemsByDate from '../../hooks/useGroupedItemsByDate';
import useMaxHeight from '../../hooks/useMaxHeight';
import AgendaView from './AgendaView';
import DayView from './DayView';
import MonthView from './MonthView';

const Calendar = ({
	currentDate,
	selectedInterval,
	headerHeight,
	allValue,
	selectedValuesById,
	selectedCollapsibleValues,
}) => {
	const maxHeight = useMaxHeight(headerHeight);
	const groupedItemsByDateObj = useGroupedItemsByDate({
		allValue,
		selectedValuesById,
		selectedCollapsibleValues,
	});

	return (
		<div className="flex flex-col flex-1" style={{ maxHeight }}>
			{selectedInterval === 'Day' && (
				<DayView currentDate={currentDate} groupedItemsByDateObj={groupedItemsByDateObj} />
			)}
			{selectedInterval === 'Month' && (
				<MonthView currentDate={currentDate} groupedItemsByDateObj={groupedItemsByDateObj} />
			)}
			{selectedInterval === 'Agenda' && (
				<AgendaView currentDate={currentDate} groupedItemsByDateObj={groupedItemsByDateObj} />
			)}
		</div>
	);
};

export default Calendar;

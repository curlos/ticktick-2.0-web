import { useCalendarContext } from '../../contexts/useCalendarContext';
import useGroupedItemsByDate from '../../hooks/useGroupedItemsByDate';
import useMaxHeight from '../../hooks/useMaxHeight';
import AgendaView from './AgendaView';
import DayView from './DayView';
import MonthView from './MonthView';

const Calendar = () => {
	const {
		currDueDate,
		currentDate,
		selectedInterval,
		headerHeight,
		allValue,
		selectedValuesById,
		selectedCollapsibleValues,
	} = useCalendarContext();

	const filters = {
		allValue,
		selectedValuesById,
		selectedCollapsibleValues,
	};
	const maxHeight = useMaxHeight(headerHeight);
	const groupedItemsByDateObj = useGroupedItemsByDate(filters);

	return (
		<div className="flex flex-col flex-1" style={{ maxHeight }}>
			{selectedInterval === 'Day' && (
				<DayView currentDate={currentDate} groupedItemsByDateObj={groupedItemsByDateObj} />
			)}
			{selectedInterval === 'Month' && (
				<MonthView
					currentDate={currentDate}
					groupedItemsByDateObj={groupedItemsByDateObj}
					currDueDate={currDueDate}
				/>
			)}
			{selectedInterval === 'Agenda' && (
				<AgendaView currentDate={currentDate} groupedItemsByDateObj={groupedItemsByDateObj} />
			)}
		</div>
	);
};

export default Calendar;

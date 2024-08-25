import { useCalendarContext } from '../../contexts/useCalendarContext';
import useGroupedItemsByDate from '../../hooks/useGroupedItemsByDate';
import useMaxHeight from '../../hooks/useMaxHeight';
import AgendaView from './AgendaView';
import DayView from './DayView/DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';

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

	const sharedProps = {
		currentDate,
		currDueDate,
		groupedItemsByDateObj,
	};

	return (
		<div className="flex flex-col flex-1" style={{ maxHeight }}>
			{selectedInterval === 'Day' && <DayView {...sharedProps} />}
			{selectedInterval === 'Week' && <WeekView {...sharedProps} />}
			{selectedInterval === 'Month' && <MonthView {...sharedProps} />}
			{selectedInterval === 'Agenda' && <AgendaView {...sharedProps} />}
		</div>
	);
};

export default Calendar;

import { TaskObj } from '../../../interfaces/interfaces';
import { isTodayUTC, isTomorrowUTC, isInXDaysUTC } from '../../../utils/date.utils';
import DateIconOption from './DateIconOption';

interface IDateIconOptionList {
	dueDate: Date | null;
	setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
	handleEditDate: (dateToEdit: Date | null) => void;
	task: TaskObj;
	onCloseContextMenu?: () => void;
}

const DateIconOptionList: React.FC<IDateIconOptionList> = ({
	dueDate,
	setDueDate,
	handleEditDate,
	task,
	onCloseContextMenu,
}) => {
	const today = new Date();

	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const sevenDaysFromNow = new Date(today);
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

	const isDueDateToday = isTodayUTC(dueDate);
	const isDueDateTomorrow = isTomorrowUTC(dueDate);
	const isDueDateIn7Days = isInXDaysUTC(dueDate, 7);

	return (
		<div className="flex justify-between items-center gap-1 my-2">
			<DateIconOption
				iconName="sunny"
				tooltipText="Today"
				selected={isDueDateToday}
				onClick={() => handleEditDate(today)}
				task={task}
			/>
			<DateIconOption
				iconName="wb_twilight"
				tooltipText="Tomorrow"
				selected={isDueDateTomorrow}
				onClick={() => handleEditDate(tomorrow)}
				task={task}
			/>
			<DateIconOption
				iconName="event_upcoming"
				tooltipText="Next Week"
				selected={isDueDateIn7Days}
				onClick={() => handleEditDate(sevenDaysFromNow)}
				task={task}
			/>
			<DateIconOption
				iconName="calendar_month"
				tooltipText="Custom"
				task={task}
				dueDate={dueDate}
				setDueDate={setDueDate}
				showDropdownCalendar={true}
				onCloseContextMenu={onCloseContextMenu}
			/>
			{dueDate && (
				<DateIconOption
					iconName="event_busy"
					tooltipText="Clear"
					onClick={() => {
						handleEditDate(null);
					}}
					task={task}
				/>
			)}
		</div>
	);
};

export default DateIconOptionList;

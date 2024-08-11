import classNames from 'classnames';
import { useRef, useState } from 'react';
import { formatDateTime } from '../../utils/date.utils';
import DropdownDayFocusRecords from './DropdownDayFocusRecords';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../services/resources/tasksApi';

const MiniFocusRecord = ({
	focusRecord,
	index,
	maxFocusRecords,
	focusRecordsForTheDay,
	shownFocusRecords,
	customStartTimeClasses,
}) => {
	// RTK Query - Tasks
	const { data: fetchedTasks } = useGetTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits } = useGetHabitsQuery();
	const { habitsById } = fetchedHabits || {};

	const { taskId, habitId, startTime } = focusRecord;
	const task = tasksById && tasksById[taskId];
	const habit = habitsById && habitsById[habitId];
	const name = task?.title || habit?.name;
	const isLastFocusRecord = shownFocusRecords.length - 1 === index;
	const thereAreLeftoverFocusRecords = maxFocusRecords && focusRecordsForTheDay?.length > maxFocusRecords;
	const leftOverFocusRecordsCount = thereAreLeftoverFocusRecords && focusRecordsForTheDay?.length - maxFocusRecords;

	const dropdownDayFocusRecords = useRef(null);
	const [isDropdownDayFocusRecordsVisible, setIsDropdownDayFocusRecordsVisible] = useState(false);

	return (
		<div className="flex items-center gap-1 w-full">
			<div
				className={classNames(
					'bg-emerald-600 rounded p-1 py-[2px] h-[20px] flex justify-between flex-1 cursor-pointer opacity-70',
					// Necessary for the focus records with "+X" at the end.
					'w-[88%]'
				)}
			>
				<span className="truncate">{name}</span>
				<span className={classNames('text-gray-200 min-w-[55px] text-right', customStartTimeClasses)}>
					{formatDateTime(startTime).time}
				</span>
			</div>

			{isLastFocusRecord && thereAreLeftoverFocusRecords && (
				<div className="relative">
					<div
						ref={dropdownDayFocusRecords}
						onClick={() => setIsDropdownDayFocusRecordsVisible(!isDropdownDayFocusRecordsVisible)}
						className="bg-gray-400/70 p-[2px] rounded cursor-pointer"
					>
						+{leftOverFocusRecordsCount}
					</div>

					<DropdownDayFocusRecords
						toggleRef={dropdownDayFocusRecords}
						isVisible={isDropdownDayFocusRecordsVisible}
						setIsVisible={setIsDropdownDayFocusRecordsVisible}
						focusRecordsForTheDay={focusRecordsForTheDay}
						shownFocusRecords={focusRecordsForTheDay}
					/>
				</div>
			)}
		</div>
	);
};

export default MiniFocusRecord;

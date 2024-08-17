import classNames from 'classnames';
import { useRef, useState } from 'react';
import { formatDateTime } from '../../utils/date.utils';
import DropdownDayFocusRecords from './DropdownDayFocusRecords';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../services/resources/tasksApi';

const MiniActionItem = ({
	index,
	task,
	focusRecord,
	maxActionItems,
	flattenedActionItems,
	shownActionItems,
	customStartTimeClasses,
}) => {
	const isForTask = task && Object.keys(task).length > 0;
	const isForFocusRecord = focusRecord && Object.keys(focusRecord).length > 0;

	// RTK Query - Tasks
	const { data: fetchedTasks } = useGetTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits } = useGetHabitsQuery();
	const { habitsById } = fetchedHabits || {};

	const { taskId, habitId, startTime } = focusRecord || {};
	const focusRecordTask = isForFocusRecord && tasksById && tasksById[taskId];
	const habit = isForFocusRecord && habitsById && habitsById[habitId];
	const name = isForFocusRecord ? focusRecordTask?.title || habit?.name : task.title;

	const isLastActionItem = shownActionItems.length - 1 === index;
	const thereAreLeftoverActionItems = maxActionItems && flattenedActionItems?.length > maxActionItems;
	const leftoverActionItemsCount = thereAreLeftoverActionItems && flattenedActionItems?.length - maxActionItems;

	const dropdownDayFocusRecords = useRef(null);
	const [isDropdownDayFocusRecordsVisible, setIsDropdownDayFocusRecordsVisible] = useState(false);

	if (index >= maxActionItems) {
		return null;
	}

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
				{isForFocusRecord && (
					<span className={classNames('text-gray-200 min-w-[55px] text-right', customStartTimeClasses)}>
						{formatDateTime(startTime).time}
					</span>
				)}
			</div>

			{isLastActionItem && thereAreLeftoverActionItems && (
				<div className="relative">
					<div
						ref={dropdownDayFocusRecords}
						onClick={() => setIsDropdownDayFocusRecordsVisible(!isDropdownDayFocusRecordsVisible)}
						className="bg-gray-400/70 p-[2px] rounded cursor-pointer"
					>
						+{leftoverActionItemsCount}
					</div>

					{/* TODO: Bring back in a moment and refactor to include BOTH Tasks and Focus Records. */}
					{/* <DropdownDayFocusRecords
						toggleRef={dropdownDayFocusRecords}
						isVisible={isDropdownDayFocusRecordsVisible}
						setIsVisible={setIsDropdownDayFocusRecordsVisible}
						focusRecordsForTheDay={focusRecordsForTheDay}
						shownFocusRecords={focusRecordsForTheDay}
					/> */}
				</div>
			)}
		</div>
	);
};

export default MiniActionItem;

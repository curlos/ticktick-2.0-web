import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { areDatesEqual, formatDateTime, getAssociatedTimeForTask } from '../../utils/date.utils';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../services/resources/tasksApi';
import useContextMenu from '../../hooks/useContextMenu';
import ContextMenuGeneric from '../../components/ContextMenu/ContextMenuGeneric';
import DrodpownAddFocusRecord from '../../components/Dropdown/DropdownAddFocusRecord';
import DropdownTaskDetails from '../../components/Dropdown/DropdownTaskDetails';
import DropdownAllActionItemsForDay from './Dropdown/DropdownAllActionItemsForDay';

const MiniActionItem = ({
	index,
	task,
	focusRecord,
	actionItems,
	flattenedActionItems,
	shownActionItems,
	customStartTimeClasses,
	formattedDay,
	innerClickElemRefs,
	setInnerClickElemRefs,
}) => {
	const maxActionItems = shownActionItems.length;
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

	const { contextMenu, isDropdownVisible, setIsDropdownVisible, dropdownRef, handleContextMenu, handleClose } =
		useContextMenu();

	const contextMenuRef = useRef(null);

	useEffect(() => {
		if (setInnerClickElemRefs) {
			setInnerClickElemRefs([contextMenuRef]);
		}
	}, [contextMenu]);

	if (index >= maxActionItems) {
		return null;
	}

	const formattedDayDate = new Date(formattedDay);
	const today = new Date();
	const isToday = areDatesEqual(today, formattedDayDate);
	const associatedTimeForTask = isForTask && getAssociatedTimeForTask(task);
	const isDateBasedOnDueDate = associatedTimeForTask?.key === 'dueDate';

	const showFullOpacity = isToday || isDateBasedOnDueDate;

	return (
		<div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 w-full">
			<div
				className={classNames(
					'bg-emerald-600 rounded p-1 py-[2px] h-[20px] flex justify-between flex-1 cursor-pointer',
					// Necessary for the focus records with "+X" at the end.
					'w-[88%]',
					showFullOpacity ? 'opacity-100' : 'opacity-70'
				)}
				onClick={(e) => {
					handleContextMenu(e);
				}}
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
						onClick={() => {
							setIsDropdownDayFocusRecordsVisible(!isDropdownDayFocusRecordsVisible);
						}}
						className="bg-gray-400/70 p-[2px] rounded cursor-pointer"
					>
						+{leftoverActionItemsCount}
					</div>

					<DropdownAllActionItemsForDay
						toggleRef={dropdownDayFocusRecords}
						isVisible={isDropdownDayFocusRecordsVisible}
						setIsVisible={setIsDropdownDayFocusRecordsVisible}
						actionItems={actionItems}
						flattenedActionItems={flattenedActionItems}
						customStartTimeClasses={'min-w-[65px]'}
						formattedDay={formattedDay}
						innerClickElemRefs={innerClickElemRefs}
						contextMenu={contextMenu}
					/>
				</div>
			)}

			{contextMenu && (
				<ContextMenuGeneric
					toggleRef={contextMenuRef}
					xPos={contextMenu.xPos}
					yPos={contextMenu.yPos}
					onClose={handleClose}
					isDropdownVisible={isDropdownVisible}
					setIsDropdownVisible={setIsDropdownVisible}
				>
					{isForTask ? (
						<DropdownTaskDetails
							toggleRef={dropdownRef}
							isVisible={true}
							setIsVisible={setIsDropdownVisible}
							customClasses=" !ml-[0px] mt-[15px]"
							customStyling={{
								position: 'absolute',
								top: `${contextMenu.yPos}px`,
								left: `${contextMenu.xPos}px`,
							}}
							onCloseContextMenu={handleClose}
							task={task}
						/>
					) : (
						<DrodpownAddFocusRecord
							toggleRef={dropdownRef}
							isVisible={true}
							setIsVisible={setIsDropdownVisible}
							customClasses=" !ml-[0px] mt-[15px]"
							customStyling={{
								position: 'absolute',
								top: `${contextMenu.yPos}px`,
								left: `${contextMenu.xPos}px`,
							}}
							onCloseContextMenu={handleClose}
							focusRecord={focusRecord}
							showTitle={false}
						/>
					)}
				</ContextMenuGeneric>
			)}
		</div>
	);
};

export default MiniActionItem;

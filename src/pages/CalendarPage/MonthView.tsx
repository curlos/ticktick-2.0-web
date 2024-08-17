import classNames from 'classnames';
import { areDatesEqual, formatCheckedInDayDate, getCalendarMonth } from '../../utils/date.utils';
import { useEffect, useState } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import useGroupedItemsByDate from '../../hooks/useGroupedItemsByDate';
import ActionItemList from './ActionItemList';
import ContextMenuGeneric from '../../components/ContextMenu/ContextMenuGeneric';
import DropdownTaskDetails from '../../components/Dropdown/DropdownTaskDetails';
import useContextMenu from '../../hooks/useContextMenu';
import { useAddTaskMutation } from '../../services/resources/tasksApi';
import useHandleError from '../../hooks/useHandleError';

const MonthView = ({ currentDate }) => {
	const { allItemsGroupedByDate } = useGroupedItemsByDate();
	const calendarDateRange = getCalendarMonth(currentDate.getFullYear(), currentDate.getMonth(), 5);
	const shownWeeks = calendarDateRange;

	const [maxActionItems, setMaxActionItems] = useState(4);

	const { height } = useWindowSize();

	useEffect(() => {
		const newMaxActionItems = getMaxActionItemsFor6Weeks();
		setMaxActionItems(newMaxActionItems);
	}, [height]);

	// TODO: This works only for 6 weeks and has been tested on desktop only. For Mobile, this will of course be completely different and if there's less than 6 weeks (1 through 5 weeks), then we can show more of course. Needs to be added later.
	const getMaxActionItemsFor6Weeks = () => {
		if (height) {
			if (height >= 850) return 5;
			if (height >= 770) return 4;
			if (height >= 670) return 3;
			if (height >= 530) return 2;
		}

		return 1;
	};

	return (
		<div className="h-full max-h-screen flex-1 flex flex-col">
			<div className="grid grid-cols-7 mb-1">
				{calendarDateRange[0].map((day) => (
					<div key={day.toLocaleDateString()} className="text-center text-color-gray-100">
						{day.toLocaleString('en-us', { weekday: 'short' })}
					</div>
				))}
			</div>
			<div className="flex-1 flex flex-col">
				{shownWeeks.map((week, index) => (
					<div
						key={`week-${index}`}
						className={classNames(
							'grid grid-cols-7 flex-1 border-color-gray-200',
							index === 0 ? 'border-t' : '',
							index !== shownWeeks.length - 1 ? 'border-b' : ''
						)}
					>
						{week.map((day, index) => (
							<DaySquare
								key={`day-${index}`}
								day={day}
								index={index}
								currentDate={currentDate}
								maxActionItems={maxActionItems}
								allItemsGroupedByDate={allItemsGroupedByDate}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

const DaySquare = ({ day, index, currentDate, maxActionItems, allItemsGroupedByDate }) => {
	const handleError = useHandleError();
	// RTK Query - Tasks
	const [addTask, { isLoading, error }] = useAddTaskMutation();

	const { contextMenu, isDropdownVisible, setIsDropdownVisible, dropdownRef, handleContextMenu, handleClose } =
		useContextMenu();

	const isCurrentMonth = day.getMonth() === currentDate.getMonth();
	const isDayToday = areDatesEqual(new Date(), day);
	const appliedStyles = [];
	const backgroundColor =
		contextMenu && isDropdownVisible ? 'bg-color-gray-300' : 'bg-transparent hover:bg-color-gray-20';

	if (isCurrentMonth) {
		if (isDayToday) {
			appliedStyles.push('text-blue-500', backgroundColor);
		} else {
			appliedStyles.push('text-white', backgroundColor);
		}
	} else {
		appliedStyles.push('text-color-gray-100', backgroundColor);
	}

	const formattedDay = formatCheckedInDayDate(day);

	const actionItems = allItemsGroupedByDate[formattedDay] || {};
	const { tasks, focusRecords } = actionItems;
	const safeTasks = tasks ? tasks : [];
	const safeFocusRecords = focusRecords ? focusRecords : [];

	const flattenedActionItems = [...safeTasks, ...safeFocusRecords];

	const remainingRowsToBeFilled = flattenedActionItems
		? flattenedActionItems.slice(0, maxActionItems).length - maxActionItems
		: maxActionItems;
	const allRowsFilled = remainingRowsToBeFilled <= 0;
	const emptyRows =
		(!allRowsFilled && Array.from({ length: remainingRowsToBeFilled }, (_, index) => index + 1)) || [];

	const dayNum = day.getDate();
	const dayMonthName = dayNum === 1 ? day.toLocaleString('default', { month: 'short' }) : '';
	const formattedDayText = `${dayMonthName} ${dayNum}`;

	const defaultNewTask = {
		dueDate: day,
	};

	const [newTask, setNewTask] = useState(defaultNewTask);

	const handleAddTask = async () => {
		const { title, description, priority, projectId, dueDate } = newTask;

		if (!title) {
			return null;
		}

		const payload = {
			title,
			description,
			priority,
			projectId,
			dueDate,
		};

		const addedTask = handleError(async () => {
			await addTask({ payload }).unwrap();
		});

		console.log(addedTask);
	};

	return (
		<div
			className={classNames(`p-[1px] w-full`, appliedStyles, index !== 0 ? 'border-l border-color-gray-200' : '')}
			onClick={(e) => {
				e.stopPropagation();
				handleContextMenu(e);
			}}
		>
			<span className="pl-1">{formattedDayText}</span>

			<div className="space-y-1 text-white text-[11px] mt-1 px-[2px] w-full">
				<ActionItemList actionItems={actionItems} maxActionItems={maxActionItems} formattedDay={formattedDay} />

				{emptyRows.map((row) => (
					<div key={row} className="bg-transparent rounded p-1 py-[2px] truncate h-[20px]"></div>
				))}
			</div>

			{contextMenu && (
				<ContextMenuGeneric
					xPos={contextMenu.xPos}
					yPos={contextMenu.yPos}
					onClose={() => {
						// Check if there's at least a title on the task and if there is, then make an API call to add that task to the backend.
						handleAddTask();

						// Close the context menu
						handleClose();
					}}
					isDropdownVisible={isDropdownVisible}
					setIsDropdownVisible={setIsDropdownVisible}
				>
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
						task={defaultNewTask}
						newTask={newTask}
						setNewTask={setNewTask}
						isForAddingNewTask={true}
					/>
				</ContextMenuGeneric>
			)}
		</div>
	);
};

export default MonthView;

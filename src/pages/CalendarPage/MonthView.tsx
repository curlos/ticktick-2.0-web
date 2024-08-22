import classNames from 'classnames';
import { areDatesEqual, formatCheckedInDayDate, getCalendarMonth, isWeekendDay } from '../../utils/date.utils';
import { useEffect, useState } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import ActionItemList from './ActionItemList';
import useContextMenu from '../../hooks/useContextMenu';
import { useCalendarContext } from '../../contexts/useCalendarContext';
import DropdownAddNewTaskDetails from '../../components/Dropdown/DropdownAddNewTaskDetails';

const MonthView = ({ groupedItemsByDateObj, currentDate, currDueDate }) => {
	const { shownTasksFilters } = useCalendarContext();
	const { showWeekends } = shownTasksFilters;
	const doNotShowWeekendDays = !showWeekends.isChecked;

	const { allItemsGroupedByDate } = groupedItemsByDateObj;
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
			<div className={classNames('grid mb-1', doNotShowWeekendDays ? 'grid-cols-5' : 'grid-cols-7')}>
				{calendarDateRange[0].map((day) => {
					if (doNotShowWeekendDays && isWeekendDay(day)) {
						return null;
					}

					return (
						<div key={day.toLocaleDateString()} className="text-center text-color-gray-100">
							{day.toLocaleString('en-us', { weekday: 'short' })}
						</div>
					);
				})}
			</div>
			<div className="flex-1 flex flex-col">
				{shownWeeks.map((week, index) => (
					<div
						key={`week-${index}`}
						className={classNames(
							'grid flex-1 border-color-gray-200',
							index === 0 ? 'border-t' : '',
							index !== shownWeeks.length - 1 ? 'border-b' : '',
							doNotShowWeekendDays ? 'grid-cols-5' : 'grid-cols-7'
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
								currDueDate={currDueDate}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

const DaySquare = ({ day, index, currentDate, maxActionItems, allItemsGroupedByDate, currDueDate }) => {
	const { shownTasksFilters } = useCalendarContext();
	const { showWeekends } = shownTasksFilters;
	const doNotShowWeekendDays = !showWeekends.isChecked;

	if (doNotShowWeekendDays && isWeekendDay(day)) {
		return null;
	}

	const contextMenuObj = useContextMenu();

	const { contextMenu, isDropdownVisible, handleContextMenu } = contextMenuObj;

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

	const [highlight, setHighlight] = useState(false);

	useEffect(() => {
		if (currDueDate && areDatesEqual(currDueDate, day)) {
			// Light up the background with a light gray color for one second and then go back to normal.
			setHighlight(true);
			setTimeout(() => {
				setHighlight(false);
			}, 1000);
		}
	}, [currDueDate]);

	return (
		<div
			className={classNames(
				`p-[1px] w-full transition-all`,
				appliedStyles,
				index !== 0 ? 'border-l border-color-gray-200' : '',
				highlight ? '!bg-color-gray-200' : ''
			)}
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

			<DropdownAddNewTaskDetails contextMenuObj={contextMenuObj} defaultDueDate={day} />
		</div>
	);
};

export default MonthView;

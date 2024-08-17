import classNames from 'classnames';
import { areDatesEqual, formatCheckedInDayDate, getCalendarMonth } from '../../utils/date.utils';
import { useEffect, useState } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import useGroupedItemsByDate from '../../hooks/useGroupedItemsByDate';
import ActionItemList from './ActionItemList';

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
						{week.map((day, index) => {
							const isCurrentMonth = day.getMonth() === currentDate.getMonth();
							const isDayToday = areDatesEqual(new Date(), day);
							const appliedStyles = [];

							if (isCurrentMonth) {
								if (isDayToday) {
									appliedStyles.push('text-blue-500');
								} else {
									appliedStyles.push('text-white bg-transparent hover:bg-color-gray-20');
								}
							} else {
								appliedStyles.push('text-color-gray-100 bg-transparent hover:bg-color-gray-20');
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
								(!allRowsFilled &&
									Array.from({ length: remainingRowsToBeFilled }, (_, index) => index + 1)) ||
								[];

							return (
								<div
									key={`day-${index}`}
									className={classNames(
										`p-[1px] w-full`,
										appliedStyles,
										index !== 0 ? 'border-l border-color-gray-200' : ''
									)}
								>
									<span className="pl-1">{day.getDate()}</span>

									<div className="space-y-1 text-white text-[11px] mt-1 px-[2px] w-full">
										<ActionItemList actionItems={actionItems} maxActionItems={maxActionItems} />

										{emptyRows.map((row) => (
											<div
												key={row}
												className="bg-transparent rounded p-1 py-[2px] truncate h-[20px]"
											></div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};

export default MonthView;

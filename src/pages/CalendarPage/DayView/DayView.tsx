import { useEffect, useState } from 'react';
import { areDatesEqual, formatCheckedInDayDate, getAllHours, isTimeWithin25Minutes } from '../../../utils/date.utils';
import classNames from 'classnames';
import useMaxHeight from '../../../hooks/useMaxHeight';
import { useCalendarContext } from '../../../contexts/useCalendarContext';
import AbsolutePosFocusRecords from './AbsolutePosFocusRecords';
import { getTopPositioningFromTime } from './getHeightAndPositioning.utils';
import QuarterHourBlockList from './QuarterHourBlockList';
import StickyHeader from './StickyHeader';
import TodayCurrentTimeLine from './TodayCurrentTimeLine';

const DayView = ({ groupedItemsByDateObj, currDueDate }) => {
	const { allItemsGroupedByDate } = groupedItemsByDateObj;

	const [formattedDayWidth, setFormattedDayWidth] = useState(0);

	const [miniTopHeaderHeight, setMiniTopHeaderHeight] = useState(0);

	const { headerHeight } = useCalendarContext();
	const maxHeight = useMaxHeight(headerHeight + miniTopHeaderHeight);

	const allHours = getAllHours();

	const formattedDay = formatCheckedInDayDate(currDueDate);
	const actionItems = allItemsGroupedByDate[formattedDay] || {};
	const { tasks, focusRecords } = actionItems;
	const safeTasks = tasks ? tasks : [];
	const safeFocusRecords = focusRecords ? focusRecords : [];
	const flattenedActionItems = [...safeTasks, ...safeFocusRecords];

	const [todayDateObj, setTodayDateObj] = useState(new Date());
	const [todayDayTopValue, setTodayDayTopValue] = useState(getTopPositioningFromTime(todayDateObj));

	useEffect(() => {
		// Function to update both currentDateObj and currentDayTopValue
		const updateDateTime = () => {
			const newDate = new Date();
			setTodayDateObj(newDate);
			setTodayDayTopValue(getTopPositioningFromTime(newDate));
		};

		// Calculate how long to wait until the next minute starts
		const now = new Date();
		const msUntilNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

		// Update immediately at the next minute mark
		const timeoutId = setTimeout(() => {
			updateDateTime();
			// Then set an interval to continue updating every minute
			const intervalId = setInterval(updateDateTime, 60000);
			// Clear this interval on cleanup
			return () => {
				clearInterval(intervalId);
			};
		}, msUntilNextMinute);

		// Clean up the timeout and interval
		return () => {
			clearTimeout(timeoutId);
		};
	}, []); // Empty dependency array ensures this effect runs only once after initial render

	const dueDateIsToday = areDatesEqual(currDueDate, todayDateObj);

	return (
		<div>
			<StickyHeader
				{...{
					setMiniTopHeaderHeight,
					setFormattedDayWidth,
					formattedDay,
					dueDateIsToday,
					safeTasks,
					actionItems,
					flattenedActionItems,
					currDueDate,
				}}
			/>

			<div className="flex overflow-auto gray-scrollbar" style={{ maxHeight }}>
				<div className="relative">
					<AbsolutePosFocusRecords
						{...{
							safeFocusRecords,
							tasks,
							actionItems,
							flattenedActionItems,
							formattedDay,
							formattedDayWidth,
						}}
					/>

					<TodayCurrentTimeLine
						{...{
							dueDateIsToday,
							todayDayTopValue,
							todayDateObj,
							formattedDayWidth,
							setTodayDateObj,
							setTodayDayTopValue,
						}}
					/>
				</div>

				{/* Sidebar thing */}
				<div className="py-1 px-2 w-[90px] text-right">
					<div>
						{allHours.map((hour) => {
							const isWithin25MinOfCurrentTime =
								dueDateIsToday && isTimeWithin25Minutes(hour, todayDateObj);

							return (
								<div
									key={hour}
									className={classNames(
										'text-color-gray-100 text-[12px] h-[60px]',
										isWithin25MinOfCurrentTime && 'invisible'
									)}
								>
									{hour}
								</div>
							);
						})}
					</div>
				</div>

				<div className="flex-1 relative w-full">
					<QuarterHourBlockList {...{ allHours, currDueDate }} />
				</div>
			</div>
		</div>
	);
};

export default DayView;

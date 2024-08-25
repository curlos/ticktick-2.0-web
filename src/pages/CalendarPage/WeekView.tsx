import { useEffect, useState } from 'react';
import { useCalendarContext } from '../../contexts/useCalendarContext';
import useGetCurrentTime from '../../hooks/useGetCurrentTime';
import useMaxHeight from '../../hooks/useMaxHeight';
import { getAllHours, formatCheckedInDayDate, areDatesEqual, getAllDaysInWeekFromDate } from '../../utils/date.utils';
import { getTopPositioningFromTime } from './DayView/getHeightAndPositioning.utils';
import SidebarHourBlockList from './DayView/SidebarHourBlockList';
import AbsolutePosFocusRecords from './DayView/AbsolutePosFocusRecords';
import StickyHeader from './DayView/StickyHeader';

const WeekView = ({ groupedItemsByDateObj, currDueDate }) => {
	const { currentDate } = useCalendarContext();

	const { allItemsGroupedByDate } = groupedItemsByDateObj;

	const [formattedDayWidth, setFormattedDayWidth] = useState(0);

	const [miniTopHeaderHeight, setMiniTopHeaderHeight] = useState(0);

	const { headerHeight } = useCalendarContext();
	const maxHeight = useMaxHeight(headerHeight + miniTopHeaderHeight);

	const allHours = getAllHours();

	const [todayDateObj, setTodayDateObj] = useState(new Date());
	const [todayDayTopValue, setTodayDayTopValue] = useState(getTopPositioningFromTime(todayDateObj));

	useGetCurrentTime((newDate) => {
		setTodayDateObj(newDate);
		setTodayDayTopValue(getTopPositioningFromTime(newDate));
	});

	const allDaysInWeekFromDate = getAllDaysInWeekFromDate(currentDate);
	const [allDaysInWeekFromDaysObjValues, setAllDaysInWeekFromDaysObjValues] = useState(null);

	useEffect(() => {
		let newAllDaysInWeekFromDaysObjValues = {};

		allDaysInWeekFromDate.forEach((day) => {
			const formattedDay = formatCheckedInDayDate(day);
			const actionItems = allItemsGroupedByDate[formattedDay] || {};
			const { tasks, focusRecords } = actionItems;
			const safeTasks = tasks ? tasks : [];
			const safeFocusRecords = focusRecords ? focusRecords : [];
			const flattenedActionItems = [...safeTasks, ...safeFocusRecords];
			const dueDateIsToday = areDatesEqual(day, todayDateObj);

			newAllDaysInWeekFromDaysObjValues[formattedDay] = {
				formattedDay,
				actionItems,
				tasks,
				focusRecords,
				safeTasks,
				safeFocusRecords,
				flattenedActionItems,
				dueDateIsToday,
			};
		});

		setAllDaysInWeekFromDaysObjValues(newAllDaysInWeekFromDaysObjValues);
	}, [currentDate, allItemsGroupedByDate]);

	const dueDateIsToday = areDatesEqual(currentDate, todayDateObj);

	return (
		<div>
			<div className="flex">
				<div className="w-[90px]" />

				<div className="grid grid-cols-7 flex-1">
					{allDaysInWeekFromDaysObjValues &&
						allDaysInWeekFromDate.map((day) => {
							const dayKey = formatCheckedInDayDate(day);
							const dayValues = allDaysInWeekFromDaysObjValues[dayKey];

							if (!dayValues) {
								return null;
							}

							const {
								formattedDay,
								actionItems,
								tasks,
								focusRecords,
								safeTasks,
								safeFocusRecords,
								flattenedActionItems,
								dueDateIsToday,
							} = dayValues;

							return (
								<StickyHeader
									{...{
										setMiniTopHeaderHeight,
										setFormattedDayWidth,
										formattedDay,
										dueDateIsToday,
										safeTasks,
										actionItems,
										flattenedActionItems,
										currDueDate: day,
										fromWeekView: true,
									}}
								/>
							);
						})}
				</div>
			</div>

			<div className="flex overflow-auto gray-scrollbar" style={{ maxHeight }}>
				{/* <div className="relative">
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
				</div> */}

				<SidebarHourBlockList {...{ allHours, dueDateIsToday, todayDateObj }} />

				{/* <div className="flex-1 relative w-full">
					<QuarterHourBlockList {...{ allHours, currDueDate }} />
				</div> */}
			</div>
		</div>
	);
};

export default WeekView;

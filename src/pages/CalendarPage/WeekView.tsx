import { useEffect, useState } from 'react';
import { useCalendarContext } from '../../contexts/useCalendarContext';
import useGetCurrentTime from '../../hooks/useGetCurrentTime';
import useMaxHeight from '../../hooks/useMaxHeight';
import {
	getAllHours,
	formatCheckedInDayDate,
	areDatesEqual,
	getAllDaysInWeekFromDate,
	getAllMultiDaysFromDate,
} from '../../utils/date.utils';
import { getTopPositioningFromTime } from './DayView/getHeightAndPositioning.utils';
import SidebarHourBlockList from './DayView/SidebarHourBlockList';
import AbsolutePosFocusRecords from './DayView/AbsolutePosFocusRecords';
import StickyHeader from './DayView/StickyHeader';
import { TodayCurrentTimeBox } from './DayView/TodayCurrentTimeLine';
import QuarterHourBlockList from './DayView/QuarterHourBlockList';

const WeekView = ({ groupedItemsByDateObj, currDueDate }) => {
	const { currentDate, selectedInterval, multiDays } = useCalendarContext();

	const { allItemsGroupedByDate } = groupedItemsByDateObj;

	const [formattedDayWidth, setFormattedDayWidth] = useState(0);

	const [miniTopHeaderValues, setMiniTopHeaderValues] = useState({
		height: 0,
		width: 0,
	});

	const { headerHeight } = useCalendarContext();
	const maxHeight = useMaxHeight(headerHeight + miniTopHeaderValues.height);

	const allHours = getAllHours();

	const [todayDateObj, setTodayDateObj] = useState(new Date());
	const [todayDayTopValue, setTodayDayTopValue] = useState(getTopPositioningFromTime(todayDateObj));

	useGetCurrentTime((newDate) => {
		setTodayDateObj(newDate);
		setTodayDayTopValue(getTopPositioningFromTime(newDate));
	});

	const listOfDays =
		selectedInterval === 'Week'
			? getAllDaysInWeekFromDate(currentDate)
			: getAllMultiDaysFromDate(currentDate, multiDays);
	const [listOfDaysObjValues, setListOfDaysObjValues] = useState(null);

	useEffect(() => {
		let newListOfDaysObjValues = {};

		listOfDays.forEach((day) => {
			const formattedDay = formatCheckedInDayDate(day);

			if (newListOfDaysObjValues[formattedDay]) {
				return;
			}

			const actionItems = allItemsGroupedByDate[formattedDay] || {};
			const { tasks, focusRecords } = actionItems;
			const safeTasks = tasks ? tasks : [];
			const safeFocusRecords = focusRecords ? focusRecords : [];
			const flattenedActionItems = [...safeTasks, ...safeFocusRecords];
			const dueDateIsToday = areDatesEqual(day, todayDateObj);

			newListOfDaysObjValues[formattedDay] = {
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

		setListOfDaysObjValues(newListOfDaysObjValues);
	}, [currentDate, allItemsGroupedByDate, multiDays]);

	const dueDateIsToday = areDatesEqual(currentDate, todayDateObj);

	return (
		<div>
			<div className="flex">
				<div className="w-[90px]" />

				<div className="flex flex-1">
					{listOfDaysObjValues &&
						listOfDays.map((day) => {
							const dayKey = formatCheckedInDayDate(day);
							const dayValues = listOfDaysObjValues[dayKey];

							if (!dayValues) {
								return null;
							}

							const { formattedDay, actionItems, safeTasks, flattenedActionItems, dueDateIsToday } =
								dayValues;

							return (
								<StickyHeader
									{...{
										setMiniTopHeaderValues,
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
				<div className="relative">
					{listOfDaysObjValues &&
						listOfDays.map((day, index) => {
							const dayKey = formatCheckedInDayDate(day);
							const dayValues = listOfDaysObjValues[dayKey];

							if (!dayValues) {
								return null;
							}

							const { formattedDay, actionItems, tasks, safeFocusRecords, flattenedActionItems } =
								dayValues;

							return (
								<AbsolutePosFocusRecords
									{...{
										safeFocusRecords,
										tasks,
										actionItems,
										flattenedActionItems,
										formattedDay,
										formattedDayWidth,
										miniTopHeaderValues,
										fromWeekView: true,
										weekDayIndex: index,
									}}
								/>
							);
						})}

					{/* 7 Lines going downwards vertically  */}
					{listOfDays.map((_, index) => {
						return (
							<div
								className="border-l-[1px] border-color-gray-200 absolute"
								style={{ left: 90 + miniTopHeaderValues.width * index, height: 60 * 24, width: 1 }}
							></div>
						);
					})}

					<TodayCurrentTimeLine
						{...{
							dueDateIsToday,
							listOfDays,
							todayDateObj,
							todayDayTopValue,
							miniTopHeaderValues,
						}}
					/>

					<TodayCurrentTimeBox {...{ dueDateIsToday, todayDayTopValue, todayDateObj }} />

					{/* <TodayCurrentTimeLine
						{...{
							dueDateIsToday,
							todayDayTopValue,
							todayDateObj,
							formattedDayWidth,
							setTodayDateObj,
							setTodayDayTopValue,
						}}
					/> */}
				</div>

				<SidebarHourBlockList {...{ allHours, dueDateIsToday, todayDateObj, fromWeekView: true }} />

				<div className="flex-1 relative w-full">
					<QuarterHourBlockList {...{ allHours, currDueDate, fromWeekView: true }} />
				</div>
			</div>
		</div>
	);
};

const TodayCurrentTimeLine = ({ dueDateIsToday, listOfDays, todayDateObj, todayDayTopValue, miniTopHeaderValues }) => {
	if (!dueDateIsToday) {
		return null;
	}

	const indexOfTodaysDate = listOfDays.findIndex((day) => areDatesEqual(day, todayDateObj));

	let customWidth = miniTopHeaderValues.width;

	// For the last day of the week, Sunday, it's possible to overflow so subtract 20px from the end to ensure it doesn't.
	if (indexOfTodaysDate === 6) {
		customWidth -= 11;
	}

	return (
		<>
			{/* Full Line */}
			<div
				className="bg-red-500 h-[1px]"
				style={{
					position: 'absolute',
					top: todayDayTopValue,
					left: '90px',
					width: miniTopHeaderValues.width * 7 - 20,
					opacity: '30%',
					zIndex: 1,
				}}
			></div>

			{/* Circle */}
			<div
				className="bg-red-500 h-[10px] w-[10px] rounded-full"
				style={{
					position: 'absolute',
					top: todayDayTopValue - 5,
					left: 90 + miniTopHeaderValues.width * indexOfTodaysDate - 3,
					zIndex: 1,
				}}
			></div>

			{/* Line for the current day of the week */}
			<div
				className="bg-red-500 h-[1px]"
				style={{
					position: 'absolute',
					top: todayDayTopValue,
					left: 90 + miniTopHeaderValues.width * indexOfTodaysDate,
					width: customWidth,
					opacity: '100%',
					zIndex: 1,
				}}
			></div>
		</>
	);
};

export default WeekView;

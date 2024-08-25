import { useState } from 'react';
import { areDatesEqual, formatCheckedInDayDate, getAllHours } from '../../../utils/date.utils';
import useMaxHeight from '../../../hooks/useMaxHeight';
import { useCalendarContext } from '../../../contexts/useCalendarContext';
import AbsolutePosFocusRecords from './AbsolutePosFocusRecords';
import { getTopPositioningFromTime } from './getHeightAndPositioning.utils';
import QuarterHourBlockList from './QuarterHourBlockList';
import StickyHeader from './StickyHeader';
import TodayCurrentTimeLine from './TodayCurrentTimeLine';
import SidebarHourBlockList from './SidebarHourBlockList';
import useGetCurrentTime from '../../../hooks/useGetCurrentTime';

const DayView = ({ groupedItemsByDateObj, currDueDate }) => {
	const { allItemsGroupedByDate } = groupedItemsByDateObj;

	const [formattedDayWidth, setFormattedDayWidth] = useState(0);

	const [miniTopHeaderValues, setMiniTopHeaderValues] = useState({
		height: 0,
		width: 0,
	});

	const { headerHeight } = useCalendarContext();
	const maxHeight = useMaxHeight(headerHeight + miniTopHeaderValues.height);

	const allHours = getAllHours();

	const formattedDay = formatCheckedInDayDate(currDueDate);
	const actionItems = allItemsGroupedByDate[formattedDay] || {};
	const { tasks, focusRecords } = actionItems;
	const safeTasks = tasks ? tasks : [];
	const safeFocusRecords = focusRecords ? focusRecords : [];
	const flattenedActionItems = [...safeTasks, ...safeFocusRecords];

	const [todayDateObj, setTodayDateObj] = useState(new Date());
	const [todayDayTopValue, setTodayDayTopValue] = useState(getTopPositioningFromTime(todayDateObj));

	useGetCurrentTime((newDate) => {
		setTodayDateObj(newDate);
		setTodayDayTopValue(getTopPositioningFromTime(newDate));
	});

	const dueDateIsToday = areDatesEqual(currDueDate, todayDateObj);

	return (
		<div>
			<StickyHeader
				{...{
					setMiniTopHeaderValues,
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

				<SidebarHourBlockList {...{ allHours, dueDateIsToday, todayDateObj }} />

				<div className="flex-1 relative w-full">
					<QuarterHourBlockList {...{ allHours, currDueDate }} />
				</div>
			</div>
		</div>
	);
};

export default DayView;

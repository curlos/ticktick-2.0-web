import MiniActionItem from '../MiniActionItem';
import { getHeightValue, getTopPositioningFromTime } from './getHeightAndPositioning.utils';

const AbsolutePosFocusRecords = ({
	safeFocusRecords,
	tasks,
	actionItems,
	flattenedActionItems,
	formattedDay,
	formattedDayWidth,
	fromWeekView,
	weekDayIndex,
}) => {
	return (
		<>
			{safeFocusRecords?.map((focusRecord, index) => {
				const { startTime } = focusRecord;
				// Create a Date object from the startTime
				const date = new Date(startTime);

				const topValue = getTopPositioningFromTime(date, fromWeekView);
				const heightValue = getHeightValue(focusRecord, fromWeekView);
				let leftValue = fromWeekView ? 95 + formattedDayWidth * weekDayIndex : 95;

				// Use to adjust the mini action item a little more.
				if (fromWeekView && weekDayIndex !== 0) {
					leftValue += 20;
				}

				return (
					<MiniActionItem
						key={focusRecord._id}
						index={(tasks?.length ? tasks.length : 0) + index}
						focusRecord={focusRecord}
						actionItems={actionItems}
						flattenedActionItems={flattenedActionItems}
						shownActionItems={flattenedActionItems}
						formattedDay={formattedDay}
						customStyling={{
							width: fromWeekView ? formattedDayWidth : formattedDayWidth - 10,
							position: 'absolute',
							zIndex: 1,
							top: topValue,
							height: heightValue,
							left: leftValue,
							fontSize: fromWeekView ? '12px' : '13px',
						}}
						dayViewHeightValue={heightValue}
						fromWeekView={fromWeekView}
					/>
				);
			})}
		</>
	);
};

export default AbsolutePosFocusRecords;

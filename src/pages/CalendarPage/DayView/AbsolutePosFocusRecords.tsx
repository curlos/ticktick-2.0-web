import MiniActionItem from '../MiniActionItem';
import { getHeightValue, getTopPositioningFromTime } from './getHeightAndPositioning.utils';

const AbsolutePosFocusRecords = ({
	safeFocusRecords,
	tasks,
	actionItems,
	flattenedActionItems,
	formattedDay,
	formattedDayWidth,
	miniTopHeaderValues,
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
				let leftValue = fromWeekView ? 95 + (miniTopHeaderValues?.width - 10) * weekDayIndex : 95;

				// Use to adjust the mini action item a little more. This seems to be dependent on the formatted width.
				if (fromWeekView && weekDayIndex !== 0) {
					leftValue += 10 * weekDayIndex;
				}

				let customWidth = fromWeekView ? miniTopHeaderValues?.width - 10 : miniTopHeaderValues?.width - 20;

				// For the final day of the week, Sunday, the width has to be cut off by 20px instead of 10px because of that damn scrollbar or else it'll overflow.
				if (fromWeekView && weekDayIndex === 6) {
					customWidth = miniTopHeaderValues?.width - 20;
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
							width: customWidth,
							position: 'absolute',
							zIndex: 1,
							top: topValue,
							height: heightValue,
							left: leftValue,
							fontSize: fromWeekView ? '11px' : '13px',
						}}
						dayViewHeightValue={parseFloat(heightValue)}
						fromWeekView={fromWeekView}
					/>
				);
			})}
		</>
	);
};

export default AbsolutePosFocusRecords;

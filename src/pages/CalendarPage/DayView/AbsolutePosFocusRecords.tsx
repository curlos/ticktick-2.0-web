import MiniActionItem from '../MiniActionItem';
import { getHeightValue, getTopPositioningFromTime } from './getHeightAndPositioning.utils';

const AbsolutePosFocusRecords = ({
	safeFocusRecords,
	tasks,
	actionItems,
	flattenedActionItems,
	formattedDay,
	formattedDayWidth,
}) => {
	return (
		<>
			{safeFocusRecords?.map((focusRecord, index) => {
				const { startTime } = focusRecord;
				// Create a Date object from the startTime
				const date = new Date(startTime);

				const topValue = getTopPositioningFromTime(date);
				const heightValue = getHeightValue(focusRecord);

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
							width: formattedDayWidth - 10,
							position: 'absolute',
							zIndex: 1,
							top: topValue,
							height: heightValue,
							left: '95px',
							fontSize: '13px',
						}}
						dayViewHeightValue={heightValue}
					/>
				);
			})}
		</>
	);
};

export default AbsolutePosFocusRecords;

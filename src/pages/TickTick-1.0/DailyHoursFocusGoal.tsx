import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../services/resources/ticktickOneApi';
import { areDatesEqual } from '../../utils/date.utils';

const DailyHoursFocusGoal = () => {
	// RTK Query - TickTick 1.0 - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingGetFocusRecords,
		error: errorGetFocusRecords,
	} = useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords, focusRecordsById } = fetchedFocusRecords || {};

	if (!focusRecords) {
		return null;
	}

	console.log(focusRecords);

	const getFocusRecordsFromToday = () => {
		const focusRecordsFromToday = [];

		for (let focusRecord of focusRecords) {
			const isFocusRecordFromToday = areDatesEqual(new Date(focusRecord.startTime), new Date());

			// The array of focus records is sorted in order from start time so the most recent focus records will show up first. This means that today's focus records will show up first - assuming there is any. So, when you get to the first focus record that is not from today, we have found all possible focus records for today. This prevents the loop from going through thousands of records.
			if (!isFocusRecordFromToday) {
				break;
			}

			focusRecordsFromToday.push(focusRecord);
		}

		return focusRecordsFromToday;
	};

	// Using this, calculate the total time focused today.
	const focusRecordsFromToday = getFocusRecordsFromToday();

	console.log(focusRecordsFromToday);

	return (
		<div>
			<CircularProgressbarWithChildren
				value={23}
				strokeWidth={1.5}
				styles={buildStyles({
					textColor: '#4772F9',
					pathColor: '#4772F9', // Red when overtime, otherwise original color
					trailColor: '#3d3c3c',
				})}
				counterClockwise={true}
			>
				<div
					className="text-white text-[40px] flex justify-center gap-4 w-[100%] select-none cursor-pointer mb-[-10px]"
					onMouseOver={() => {}}
				>
					<div data-cy="timer-display" className="text-center text-[45px]">
						1h/5h
					</div>
				</div>
			</CircularProgressbarWithChildren>
		</div>
	);
};

export default DailyHoursFocusGoal;

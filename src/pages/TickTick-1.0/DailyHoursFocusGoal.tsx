import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../services/resources/ticktickOneApi';
import { areDatesEqual } from '../../utils/date.utils';
import { getFocusDuration, getFormattedDuration } from '../../utils/helpers.utils';

const DailyHoursFocusGoal = () => {
	// 18,000 seconds = 5 Hours, the daily goal for number of focus hours per day.
	// TODO: GOAL number of seconds should editable in the "/user-settings" endpoint and that should come from there.
	const GOAL_SECONDS = 18000;

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

	const getTotalFocusDurationToday = () => {
		const focusRecordsFromToday = getFocusRecordsFromToday();
		let totalFocusDurationToday = 0;

		focusRecordsFromToday.forEach((focusRecord) => {
			totalFocusDurationToday += getFocusDuration(focusRecord);
		});

		return totalFocusDurationToday;
	};

	const getPercentageOfFocusedGoalHours = () => {
		const totalFocusDurationToday = getTotalFocusDurationToday();
		return (totalFocusDurationToday / GOAL_SECONDS) * 100;
	};

	const totalFocusDurationToday = getTotalFocusDurationToday();
	const percentageOfFocusedGoalHours = getPercentageOfFocusedGoalHours();

	// TODO: Related to this but later on, there should be a version of this added that will get a require daily number of hours for a specific list or task that can be connected to the goal. I'll have to add a backend endpoint and probably a model in the DB to handle these new changes to connect tasks.

	return (
		<div>
			<CircularProgressbarWithChildren
				value={getPercentageOfFocusedGoalHours()}
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
					<div data-cy="timer-display" className="text-center text-[35px]">
						<div className="mt-3">
							{getFormattedDuration(totalFocusDurationToday, false)}/
							{getFormattedDuration(GOAL_SECONDS, false)}
						</div>

						<div className="text-[20px] mt-[-5px] text-color-gray-100">{percentageOfFocusedGoalHours}%</div>
					</div>
				</div>
			</CircularProgressbarWithChildren>
		</div>
	);
};

export default DailyHoursFocusGoal;

import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../services/resources/tasksApi';
import { sortArrayByEndTime } from '../../utils/date.utils';
import FocusRecord from './FocusRecord';
import classNames from 'classnames';

const FocusRecordList = () => {
	// RTK Query - Focus Records
	const { data: fetchedFocusRecords } = useGetFocusRecordsQuery();
	const { focusRecords, groupedFocusRecords } = fetchedFocusRecords || {};

	// RTK Query - Tasks
	const { data: fetchedTasks } = useGetTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits } = useGetHabitsQuery();
	const { habitsById } = fetchedHabits || {};

	console.log(groupedFocusRecords);

	return (
		<div>
			{groupedFocusRecords &&
				Object.keys(groupedFocusRecords).length > 0 &&
				Object.keys(groupedFocusRecords).map((day, index) => {
					const focusRecordsForTheDay = groupedFocusRecords[day];

					return (
						<div key={day} className={classNames('text-[13px]', index !== 0 ? 'mt-5' : '')}>
							<div className="text-color-gray-100 text-[13px] mb-3">{day}</div>

							{focusRecords &&
								tasksById &&
								habitsById &&
								sortArrayByEndTime(focusRecordsForTheDay).map((focusRecord) => (
									<div key={focusRecord._id}>
										<FocusRecord
											focusRecord={focusRecord}
											tasksById={tasksById}
											habitsById={habitsById}
										/>
									</div>
								))}
						</div>
					);
				})}
		</div>
	);
};

export default FocusRecordList;

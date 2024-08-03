import { useState, useEffect } from 'react';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../services/resources/tasksApi';
import { groupByEndTimeDay } from '../../utils/date.utils';
import FocusRecord from './FocusRecord';
import classNames from 'classnames';

const FocusRecordList = () => {
	// RTK Query - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { focusRecords, parentOfFocusRecords } = fetchedFocusRecords || {};

	// RTK Query - Tasks
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits, error: errorGetHabits } = useGetHabitsQuery();
	const { habits, habitsById } = fetchedHabits || {};

	const [groupedRecords, setGroupedRecords] = useState();

	useEffect(() => {
		if (focusRecords) {
			const focusRecordsWithNoParent = focusRecords.filter((record) => !parentOfFocusRecords[record._id]);

			const newGroupedRecords = groupByEndTimeDay(focusRecordsWithNoParent);
			setGroupedRecords(newGroupedRecords);
		}
	}, [focusRecords]);

	function sortArrayByEndTime(array) {
		// Create a deep copy of the array to avoid modifying the original.
		const arrayCopy = array.map((item) => ({ ...item }));

		return arrayCopy.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
	}

	return (
		<div>
			{groupedRecords &&
				Object.keys(groupedRecords).map((day, index) => {
					const focusRecordsForTheDay = groupedRecords[day];

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

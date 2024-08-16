import { useState, useRef, useEffect } from 'react';
import { useGetFocusRecordsQuery } from '../../../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../../services/resources/tasksApi';
import { formatDateTime } from '../../../utils/date.utils';
import { getFormattedDuration } from '../../../utils/helpers.utils';
import DropdownSetTaskOrHabit from '../../Dropdown/DropdownsAddFocusRecord/DropdownSetTaskOrHabit';
import Icon from '../../Icon';

const FocusRecordChild = ({ childId }) => {
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { focusRecordsById } = fetchedFocusRecords || {};

	// RTK Query - Tasks
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits, error: errorGetHabits } = useGetHabitsQuery();
	const { habits, habitsById } = fetchedHabits || {};

	const [selectedTask, setSelectedTask] = useState<Object | null>(null);
	const [isDropdownSetTaskVisible, setIsDropdownSetTaskVisible] = useState(false);

	const dropdownSetTaskRef = useRef(null);

	useEffect(() => {
		setIsDropdownSetTaskVisible(false);
	}, [selectedTask]);

	const childFocusRecord = focusRecordsById[childId];
	const { _id, taskId, habitId, startTime, endTime, focusType, duration } = childFocusRecord;
	const task = taskId && tasksById[taskId];
	const habit = habitId && habitsById[habitId];

	const dateOptions = {
		year: 'numeric', // Full year
		month: 'long', // Full month name
		day: 'numeric', // Day of the month
	};

	const startDay = new Date(startTime).toLocaleString('en-US', dateOptions);
	const endDay = new Date(endTime).toLocaleString('en-US', dateOptions);

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);

	return (
		childFocusRecord && (
			<div key={_id} className="">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-1">
						<Icon name="nutrition" customClass={'!text-[21px] text-blue-500 cursor-pointer'} fill={1} />
						<div className="font-bold">{task || habit ? task?.title || habit?.name : 'No Task'}</div>
					</div>

					<div className="relative">
						<Icon
							ref={dropdownSetTaskRef}
							onClick={() => setIsDropdownSetTaskVisible(!isDropdownSetTaskVisible)}
							name="edit"
							customClass={'!text-[21px] text-color-gray-100 cursor-pointer'}
							fill={1}
						/>

						<DropdownSetTaskOrHabit
							toggleRef={dropdownSetTaskRef}
							isVisible={isDropdownSetTaskVisible}
							setIsVisible={setIsDropdownSetTaskVisible}
							selectedTask={selectedTask}
							setSelectedTask={setSelectedTask}
							customClasses="ml-[-270px]"
						/>
					</div>
				</div>
				<div className="flex items-center gap-1 mt-1 text-color-gray-100">
					<Icon name="adjust" customClass={'!text-[20px] cursor-pointer'} fill={0} />
					<div>{`${startDay}:  ${startTimeObj.time} - ${startDay !== endDay ? endTime : ''}${endTimeObj.time}`}</div>
				</div>

				<div className="flex items-center gap-1 mt-1 text-color-gray-100">
					<Icon name="timer" customClass={'!text-[20px] cursor-pointer'} fill={0} />
					<div>{`${getFormattedDuration(duration)}`}</div>
				</div>
			</div>
		)
	);
};

export default FocusRecordChild;

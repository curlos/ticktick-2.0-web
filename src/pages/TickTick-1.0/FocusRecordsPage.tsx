import { useState } from 'react';
import { getFormattedLongDay, sortArrayByProperty, sortObjectByDateKeys } from '../../utils/date.utils';
import { getFocusDuration, getFormattedDuration } from '../../utils/helpers.utils';
import FocusRecord from './FocusRecord';
import {
	useGetPomoAndStopwatchFocusRecordsQuery,
	useGetAllTasksQuery,
	useGetAllProjectsQuery,
} from '../../services/resources/ticktickOneApi';
import DailyHoursFocusGoal from './DailyHoursFocusGoal';

const FocusRecordsPage = () => {
	// RTK Query - TickTick 1.0 - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingGetFocusRecords,
		error: errorGetFocusRecords,
	} = useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords, focusRecordsById } = fetchedFocusRecords || {};

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetAllTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	// RTK Query - TickTick 1.0 - Projects
	const {
		data: fetchedProjects,
		isLoading: isLoadingGetProjects,
		error: errorGetProjects,
	} = useGetAllProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	const [groupedBy, setGroupedBy] = useState('day');

	if (!focusRecords) {
		return <div>Loading...</div>;
	}

	// if (tasks) {
	// 	return (
	// 		<div className="flex max-w-screen bg-color-gray-700 text-white">
	// 			<div>
	// 				{tasks.map((task) => (
	// 					<div>{task.title}</div>
	// 				))}
	// 			</div>
	// 		</div>
	// 	);
	// }

	const groupedFocusRecordsByDate = getGroupedFocusRecordsByDate(focusRecords);
	// const groupedFocusRecordsByTask = getGroupedFocusRecordsByTask(focusRecords, tasksById);

	const groupedByFocusRecords = groupedFocusRecordsByDate;

	const getInfoForGroup = (key, focusRecord, index) => {
		const infoForGroupedByDay = {
			title: key,
			focusRecordKey: focusRecord?.id,
		};

		switch (groupedBy) {
			case 'day':
				return infoForGroupedByDay;
			case 'tasks':
				return {
					title: tasksById[key].title,
					focusRecordKey: `${key} ${focusRecord?.id} ${index}`,
				};
			default:
				return infoForGroupedByDay;
		}
	};

	return (
		<div className="flex max-w-screen bg-color-gray-700">
			<div className="container mx-auto p-1">
				<div className="flex">
					<DailyHoursFocusGoal />
				</div>

				{Object.keys(groupedByFocusRecords).map((groupKey) => {
					const focusRecords = groupedByFocusRecords[groupKey];
					const totalFocusDuration = getTotalFocusDuration(focusRecords, groupedBy);
					const { title } = getInfoForGroup(groupKey);

					// TODO: If grouped by tasks, then we need to group those focus records for that task by date.
					if (groupedBy === 'tasks') {
					}

					return (
						<div key={groupKey} className="mb-[100px]">
							<div className="flex items-center gap-3 mb-5">
								<h2 className="text-[32px] font-bold border-b border-b-2">{title}</h2>
								<div className="text-[24px] text-color-gray-100">
									({getFormattedDuration(totalFocusDuration, false)})
								</div>
							</div>

							{groupedBy === 'tasks' ? (
								<GroupedFocusRecordListByDate
									{...{ focusRecords, getInfoForGroup, groupedBy, groupKey }}
								/>
							) : (
								<FocusRecordList {...{ focusRecords, getInfoForGroup, groupedBy, groupKey }} />
							)}
						</div>
					);
				})}
				{/* {focusDataStopwatch.map((focusRecord) => (
					<FocusRecord focusRecord={focusRecord} />
				))} */}
			</div>
		</div>
	);
};

const GroupedFocusRecordListByDate = ({ focusRecords, getInfoForGroup, groupedBy, groupKey }) => {
	const groupedFocusRecordsByDate = getGroupedFocusRecordsByDate(focusRecords);

	return (
		<div>
			{Object.keys(groupedFocusRecordsByDate).map((dateKey) => {
				const focusRecordsForTheDay = groupedFocusRecordsByDate[dateKey];

				return (
					<div className="mb-5">
						<h3 className="font-bold text-[18px] underline mb-3">{dateKey}</h3>

						<FocusRecordList
							{...{ focusRecords: focusRecordsForTheDay, getInfoForGroup, groupedBy, groupKey }}
						/>
					</div>
				);
			})}
		</div>
	);
};

const FocusRecordList = ({ focusRecords, getInfoForGroup, groupedBy, groupKey }) => {
	return (
		<div className="space-y-3">
			{focusRecords.map((focusRecord, index) => {
				const isLastItem = index === focusRecords.length - 1;
				const { focusRecordKey } = getInfoForGroup(groupKey, focusRecord, index);

				return <FocusRecord key={focusRecordKey} focusRecord={focusRecord} isLastItemForTheDay={isLastItem} />;
			})}
		</div>
	);
};

const getTotalFocusDuration = (focusRecords, groupedBy) => {
	let durationForTheDay = 0;

	focusRecords.forEach((focusRecord) => {
		const duration = getFocusDuration(focusRecord, groupedBy);
		durationForTheDay += duration;
	});

	return durationForTheDay;
};

/**
 * @description Gets the array of focus records and groups them by a unique date key. Each date key will a value that is the array of sorted focus records in ascending order by start time for the day.
 */
const getGroupedFocusRecordsByDate = (focusRecords) => {
	const groupedFocusRecordsByDate = {};

	focusRecords.forEach((focusRecord) => {
		const { startTime, endTime, note, tasks } = focusRecord;

		const dayTitle = getFormattedLongDay(new Date(startTime));

		if (!groupedFocusRecordsByDate[dayTitle]) {
			groupedFocusRecordsByDate[dayTitle] = [];
		}

		groupedFocusRecordsByDate[dayTitle].push(focusRecord);
	});

	// Sort all the items by their date key (from oldest to most recent)
	const sortedGroupedFocusDataByDate = groupedFocusRecordsByDate && sortObjectByDateKeys(groupedFocusRecordsByDate);

	const sortedGroupedFocusRecordsAsc = {};

	Object.keys(sortedGroupedFocusDataByDate).forEach((day, index) => {
		const focusRecordsForTheDay = sortedGroupedFocusDataByDate[day];
		const sortedFocusRecordsForTheDay = sortArrayByProperty(focusRecordsForTheDay, 'startTime', 'ascending');
		sortedGroupedFocusRecordsAsc[day] = sortedFocusRecordsForTheDay;
	});

	return sortedGroupedFocusRecordsAsc;
};

/**
 * @description Gets the array of focus records and groups them by a unique taskId. Each taskId will a value that is the array of sorted focus records in ascending order by start time for the day.
 */
const getGroupedFocusRecordsByTask = (focusRecords, tasksById) => {
	const groupedFocusRecordsByTask = {};

	// Create the groupedByTasks
	focusRecords.forEach((focusRecord) => {
		const { tasks } = focusRecord;

		const focusRecordTasksById = {};

		tasks.forEach((task) => {
			const { taskId } = task;

			const taskAlreadyInFocusRecord = focusRecordTasksById[taskId];

			// If the task in the list of "tasks" has already appeared in one of the earlier tasks in the focus record, then we don't we need to re-add it, as we've already the whole focus record and ALL of it's tasks. So, if we pushed a second focus record here when it's grouped by task, it would duplicate the focus record and show it a 2nd, 3rd, 4th, etc. time. This is only important for tasks of the same id as if the taskId has not already appeared before, then the focus record should appear a second time but in the different task.
			if (!taskAlreadyInFocusRecord && taskId) {
				if (!groupedFocusRecordsByTask[taskId]) {
					groupedFocusRecordsByTask[taskId] = [];
				}

				const focusRecordWithOnlyTasksOfThatTaskId = {
					...focusRecord,
					tasks: tasks.filter((task) => task.taskId === taskId),
				};

				groupedFocusRecordsByTask[taskId].push(focusRecordWithOnlyTasksOfThatTaskId);
				focusRecordTasksById[taskId] = true;
			}
		});
	});

	// Go through all the groupedByTasks and the focus records and inside the focus records, filter out any tasks that do not have the same "taskId" as the key.
	// This can't be done in the previous forEach loop because I need to know which tasks are CONNECTED to which focus records which can only truly be seen by having them all in the array first.
	Object.keys(groupedFocusRecordsByTask).forEach((taskId) => {
		const focusRecords = groupedFocusRecordsByTask[taskId];

		groupedFocusRecordsByTask[taskId] = focusRecords.map((focusRecord) => {
			const { tasks } = focusRecord;

			return {
				...focusRecord,
				// tasks: tasks.filter((task) => task.taskId === taskId),
			};
		});
	});

	const sortedGroupedFocusRecordsAsc = {};

	Object.keys(groupedFocusRecordsByTask).forEach((taskId, index) => {
		const focusRecordsForTheTask = groupedFocusRecordsByTask[taskId];
		const sortedFocusRecordsForTheTask = sortArrayByProperty(focusRecordsForTheTask, 'startTime', 'ascending');
		sortedGroupedFocusRecordsAsc[taskId] = sortedFocusRecordsForTheTask;
	});

	return sortedGroupedFocusRecordsAsc;
};

export default FocusRecordsPage;

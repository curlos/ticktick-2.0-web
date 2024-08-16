import Icon from '../../components/Icon';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { formatCheckedInDayDate, formatDateTime, sortObjectByDateKeys } from '../../utils/date.utils';
import { getFormattedDuration, hexToRGBA } from '../../utils/helpers.utils';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../services/resources/tasksApi';
import { useGetProjectsQuery } from '../../services/resources/projectsApi';
import { useEffect, useState } from 'react';

const AgendaView = () => {
	const [allItemsGroupedByDate, setAllItemsGroupedByDate] = useState({});

	// RTK Query - Focus Records
	const { data: fetchedFocusRecords, isLoading: isLoadingGetFocusRecords } = useGetFocusRecordsQuery();
	const { sortedGroupedFocusRecordsAsc, focusRecordsById } = fetchedFocusRecords || {};

	// RTK Query - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks } = useGetTasksQuery();
	const { tasks, tasksById, groupedTasksByDate } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits } = useGetHabitsQuery();
	const { habitsById } = fetchedHabits || {};

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const isAllDoneLoading =
		!(isLoadingGetFocusRecords && isLoadingGetTasks && isLoadingGetHabits) &&
		focusRecordsById &&
		tasksById &&
		projectsById &&
		habitsById;

	const sortedTasksByDate = groupedTasksByDate && sortObjectByDateKeys(groupedTasksByDate);
	const sortedFocusRecordsByDate = sortedGroupedFocusRecordsAsc && sortObjectByDateKeys(sortedGroupedFocusRecordsAsc);

	useEffect(() => {
		if (sortedTasksByDate && sortedFocusRecordsByDate) {
			const newAllGroupedByDate = {};

			Object.keys(sortedTasksByDate).map((dateKey) => {
				const tasksForThisDay = sortedTasksByDate[dateKey];

				if (!newAllGroupedByDate[dateKey]) {
					newAllGroupedByDate[dateKey] = {};
				}

				newAllGroupedByDate[dateKey].tasks = tasksForThisDay;
			});

			Object.keys(sortedFocusRecordsByDate).map((dateKey) => {
				const focusRecordForThisDay = sortedFocusRecordsByDate[dateKey];

				if (!newAllGroupedByDate[dateKey]) {
					newAllGroupedByDate[dateKey] = {};
				}

				newAllGroupedByDate[dateKey].focusRecords = focusRecordForThisDay;
			});

			// TODO: Sort the dates in the combined object.
			console.log(newAllGroupedByDate);

			const newSortedAllGroupedByDate = newAllGroupedByDate && sortObjectByDateKeys(newAllGroupedByDate);
			setAllItemsGroupedByDate(newSortedAllGroupedByDate);
		}
	}, [isAllDoneLoading]);

	console.log(allItemsGroupedByDate);

	return (
		<div className="flex-1 overflow-auto gray-scrollbar border-t border-color-gray-200 py-[50px] pl-[50px] pr-[120px]">
			<div className="space-y-10">
				{isAllDoneLoading &&
					allItemsGroupedByDate &&
					Object.keys(allItemsGroupedByDate).map((dateKey) => {
						const tasksAndFocusRecords = allItemsGroupedByDate[dateKey];
						const { tasks, focusRecords } = tasksAndFocusRecords;

						if (!tasks && !focusRecords) {
							return null;
						}

						return (
							<div key={dateKey} className="flex">
								<div className="font-bold text-[24px] flex-[3] text-right mr-[100px]">{dateKey}</div>
								<div className="space-y-4 flex-[8]">
									{tasks?.map((task, index) => {
										const isLastAgendaItem =
											(!focusRecords || focusRecords.length === 0) && index === tasks.length - 1;

										return (
											<AgendaItem
												key={task._id}
												task={task}
												focusRecordsById={focusRecordsById}
												tasksById={tasksById}
												habitsById={habitsById}
												projectsById={projectsById}
												isLastAgendaItem={isLastAgendaItem}
											/>
										);
									})}
									{focusRecords?.map((focusRecord, index) => {
										const isLastAgendaItem = index === focusRecords.length - 1;

										return (
											<AgendaItem
												key={focusRecord._id}
												focusRecord={focusRecord}
												focusRecordsById={focusRecordsById}
												tasksById={tasksById}
												habitsById={habitsById}
												projectsById={projectsById}
												isLastAgendaItem={isLastAgendaItem}
											/>
										);
									})}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

const AgendaItem = ({
	task = {},
	focusRecord = {},
	focusRecordsById,
	tasksById,
	habitsById,
	projectsById,
	isLastAgendaItem,
}) => {
	const isForTask = task && Object.keys(task).length > 0;
	const isForFocusRecord = focusRecord && Object.keys(focusRecord).length > 0;

	const [hover, setHover] = useState(false);

	const { _id, taskId, habitId, note, duration, startTime, endTime, children } = focusRecord;

	const taskForFocusRecord = isForFocusRecord && tasksById[taskId];
	const habit = isForFocusRecord && habitsById[habitId];
	const project = isForFocusRecord
		? taskForFocusRecord && taskForFocusRecord.projectId && projectsById[taskForFocusRecord.projectId]
		: projectsById[task.projectId];

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);

	const childFocusRecordTaskTitles = new Set();

	isForFocusRecord &&
		children?.forEach((childId) => {
			const childFocusRecord = focusRecordsById[childId];
			const isTask = childFocusRecord.taskId;

			const childItem = isTask ? tasksById[childFocusRecord.taskId] : habitsById[childFocusRecord.habitId];
			childFocusRecordTaskTitles.add(isTask ? childItem?.title : childItem?.name);
		});

	const getTime = () => {
		if (startTime) return startTimeObj.time;
		return 'All Day';
	};

	const bgColor = project?.color ? hexToRGBA(project.color, '30%') : hexToRGBA('#3b82f6', '30%');
	const bgColorHover = project?.color ? hexToRGBA(project.color, '60%') : hexToRGBA('#3b82f6', '60%');
	const borderColor = project?.color ? hexToRGBA(project.color) : hexToRGBA('#3b82f6');

	const cardStyle = {
		backgroundColor: hover ? bgColorHover : bgColor,
		borderColor: borderColor,
	};

	return (
		<li key={_id} className="relative m-0 list-none last:mb-[4px] cursor-pointer" style={{ minHeight: '54px' }}>
			{!isLastAgendaItem && (
				<div
					className="absolute top-[28px] left-[11px] h-full border-solid border-l-[1px] border-blue-900"
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				<div className="absolute left-[-105px] text-color-gray-100">{getTime()}</div>
				<div className="absolute left-[-40px] w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
					<Icon name="timer" customClass={'!text-[20px] text-blue-500 cursor-pointer'} fill={1} />
				</div>

				{!isLastAgendaItem && (
					<div
						className="absolute left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600 border-blue-500"
						style={{ top: '34px' }}
					></div>
				)}

				<div
					className="border-l border-l-[5px] rounded p-2"
					style={cardStyle}
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					{isForFocusRecord && (
						<div className="flex justify-between text-[12px] mb-[6px]">
							<div>
								{startTimeObj.time} - {endTimeObj.time}
							</div>
							<div>{getFormattedDuration(duration)}</div>
						</div>
					)}

					{isForFocusRecord ? (
						children && children.length > 0 ? (
							<div className="font-medium space-y-1">
								{[...childFocusRecordTaskTitles].map((title, index) => {
									return <div key={`${title}-${index}`}>{title}</div>;
								})}
							</div>
						) : (
							<div>
								<div>
									{taskForFocusRecord && (
										<div className="font-medium">{taskForFocusRecord.title}</div>
									)}
								</div>
								<div>{habit && <div className="font-medium">{habit.name}</div>}</div>
							</div>
						)
					) : (
						<div>{task && <div className="font-medium">{task.title}</div>}</div>
					)}
				</div>
			</div>
		</li>
	);
};

export default AgendaView;

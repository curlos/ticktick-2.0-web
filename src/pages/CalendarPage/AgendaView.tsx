import Icon from '../../components/Icon';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { formatCheckedInDayDate, formatDateTime } from '../../utils/date.utils';
import { getFormattedDuration, hexToRGBA } from '../../utils/helpers.utils';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../services/resources/tasksApi';
import { useGetProjectsQuery } from '../../services/resources/projectsApi';
import { useState } from 'react';

const AgendaView = () => {
	// RTK Query - Focus Records
	const { data: fetchedFocusRecords, isLoading: isLoadingGetFocusRecords } = useGetFocusRecordsQuery();
	const { sortedGroupedFocusRecordsAsc, focusRecordsById } = fetchedFocusRecords || {};

	// RTK Query - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks } = useGetTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits } = useGetHabitsQuery();
	const { habitsById } = fetchedHabits || {};

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const focusRecordsForTheDay = sortedGroupedFocusRecordsAsc && sortedGroupedFocusRecordsAsc['July 30, 2024'];

	console.log(focusRecordsForTheDay);

	const isAllDoneLoading =
		!(isLoadingGetFocusRecords && isLoadingGetTasks && isLoadingGetHabits) &&
		focusRecordsById &&
		tasksById &&
		projectsById &&
		habitsById;

	console.log(sortedGroupedFocusRecordsAsc);

	return (
		<div className="flex-1 overflow-auto gray-scrollbar border-t border-color-gray-200 py-[50px] pl-[50px] pr-[120px]">
			<div className="space-y-10">
				{isAllDoneLoading &&
					Object.values(sortedGroupedFocusRecordsAsc).map((focusRecordsForTheDay) => {
						const dateName = formatCheckedInDayDate(new Date(focusRecordsForTheDay[0].startTime));
						return (
							<div className="flex">
								<div className="font-bold text-[24px] flex-[3] text-right mr-[100px]">{dateName}</div>
								<div className="space-y-4 flex-[8]">
									{focusRecordsForTheDay?.map((focusRecord) => (
										<FocusRecord
											key={focusRecord._id}
											focusRecord={focusRecord}
											focusRecordsById={focusRecordsById}
											tasksById={tasksById}
											habitsById={habitsById}
											projectsById={projectsById}
										/>
									))}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

const FocusRecord = ({ focusRecord, focusRecordsById, tasksById, habitsById, projectsById }) => {
	const [hover, setHover] = useState(false);

	const { _id, taskId, habitId, note, duration, startTime, endTime, children } = focusRecord;

	const task = tasksById[taskId];
	const habit = habitsById[habitId];
	const project = task && task.projectId && projectsById[task.projectId];
	console.log(project);

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);

	const childFocusRecordTaskTitles = new Set();

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
			<div
				className="absolute top-[28px] left-[11px] h-full border-solid border-l-[1px] border-blue-900"
				style={{ height: 'calc(100% - 16px)' }}
			></div>

			<div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				<div className="absolute left-[-105px] text-color-gray-100">{getTime()}</div>
				<div className="absolute left-[-40px] w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
					<Icon name="nutrition" customClass={'!text-[20px] text-blue-500 cursor-pointer'} fill={1} />
				</div>

				<div
					className="absolute left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600 border-blue-500"
					style={{ top: '34px' }}
				></div>

				<div
					className="border-l border-l-[5px] rounded p-2"
					style={cardStyle}
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					<div className="flex justify-between text-[12px] mb-[6px]">
						<div>
							{startTimeObj.time} - {endTimeObj.time}
						</div>
						<div>{getFormattedDuration(duration)}</div>
					</div>

					{/* TODO: Render an array of titles if it has children for better clarity. */}

					{children && children.length > 0 ? (
						<div className="font-medium space-y-1">
							{[...childFocusRecordTaskTitles].map((title, index) => {
								return <div key={`${title}-${index}`}>{title}</div>;
							})}
						</div>
					) : (
						<div>
							<div>{task && <div className="font-medium">{task.title}</div>}</div>
							<div>{habit && <div className="font-medium">{habit.name}</div>}</div>
						</div>
					)}
				</div>
			</div>
		</li>
	);
};

export default AgendaView;

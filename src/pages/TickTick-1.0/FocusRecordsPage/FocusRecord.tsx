import ReactMarkdown from 'react-markdown';
import { formatDateTime, getFormattedLongDay, isTimeBetween } from '../../../utils/date.utils';
import { getFocusDuration, getFormattedDuration } from '../../../utils/helpers.utils';
import Icon from '../../../components/Icon';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';

const FocusRecord = ({ focusRecord, showSubtaskTime = true, isLastItemForTheDay = false, focusDuration }) => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetAllTasksQuery();
	const { completedTasksGroupedByDate } = fetchedTasks || {};

	const { note, startTime, endTime, tasks } = focusRecord;

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);
	const duration = focusDuration ? focusDuration : getFocusDuration(focusRecord);

	const themeColor = 'emerald-500';

	const cssStyles = {
		'blue-500': {
			textColor: 'text-blue-500',
			bgColor: 'bg-blue-500',
			borderColor: 'border-blue-500',
		},
		'emerald-500': {
			textColor: 'text-emerald-500',
			bgColor: 'bg-emerald-500',
			borderColor: 'border-emerald-500',
		},
		'red-500': {
			textColor: 'text-red-500',
			bgColor: 'bg-red-500',
			borderColor: 'border-red-500',
		},
	};

	const { textColor, bgColor, borderColor } = cssStyles[themeColor];

	const getAllCompletedTasksDuringFocusRecord = () => {
		if (!completedTasksGroupedByDate) {
			return [];
		}

		const startTimeDate = new Date(startTime);
		const endTimeDate = new Date(endTime);
		const startTimeKey = getFormattedLongDay(startTimeDate);
		const endTimeKey = getFormattedLongDay(endTimeDate);
		const startAndEndTimeHappenedOnSameDay = startTimeKey === endTimeKey;

		let completedTasksDuringFocusSession = [];

		const completedTasksInStartTimeDay = completedTasksGroupedByDate[startTimeKey];

		completedTasksDuringFocusSession = getCompletedTasksBetweenTimes(
			completedTasksInStartTimeDay,
			startTimeDate,
			endTimeDate
		);

		// I would think this scenario is very rare since I don't work at midnight anymore but basically if the start and end times were to happen on different days (September 13, 2024 11:05PM to September 14, 2024 1:12AM), then you need to grab the completed tasks for the end time's date as well.
		// TODO: Should be possible to actually test this when I bring over the focus records from 2021 and early 2022 since I did do a lot of work at midnight back then so the start and end time's would be different. Test this out after bringing over the records from back then.
		if (!startAndEndTimeHappenedOnSameDay) {
			const completedTasksInEndTimeDay = completedTasksGroupedByDate[endTimeKey];

			if (completedTasksInEndTimeDay) {
				completedTasksDuringFocusSession.push(
					...getCompletedTasksBetweenTimes(completedTasksInEndTimeDay, startTimeDate, endTimeDate)
				);
			}
		}

		return completedTasksDuringFocusSession;
	};

	const getCompletedTasksBetweenTimes = (completedTasksInTimeDay, startTimeDate, endTimeDate) => {
		if (!completedTasksInTimeDay) {
			return [];
		}

		return completedTasksInTimeDay.filter((completedTask) => {
			const { completedTime } = completedTask;
			const completedTimeDate = new Date(completedTime);

			// Passed in an offset of 10 minutes between the start and end times because often times, I don't actually complete a task during the literal focus record session but a little after it or maybe even before it. So, I feel like this would handle most of the completed task scenarios during a focus record.
			const completedDuringFocusSession = isTimeBetween(completedTimeDate, startTimeDate, endTimeDate, 10);

			return completedDuringFocusSession;
		});
	};

	const completedTasksDuringFocusSession = getAllCompletedTasksDuringFocusRecord();
	const thereAreCompletedTasks = completedTasksDuringFocusSession && completedTasksDuringFocusSession.length > 0;

	return (
		<div className="relative m-0 list-none last:mb-[4px]" style={{ minHeight: '54px' }}>
			<div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
				<Icon name="timer" customClass={classNames('!text-[20px]', textColor)} />
			</div>

			{!isLastItemForTheDay && (
				<div
					className={classNames(
						'absolute top-[28px] left-[11px] h-full border-solid border-l-[1px]',
						borderColor
					)}
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				{!isLastItemForTheDay && (
					<div
						className={classNames(
							'absolute left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600',
							borderColor
						)}
						style={{ top: '34px' }}
					></div>
				)}

				<div className="bg-emerald-500/50 p-2 rounded-lg w-full">
					<div className="text-gray-200">
						<span className="font-bold">{getFormattedLongDay(new Date(startTime))}</span> -{' '}
						{startTimeObj.time} - {endTimeObj.time} ({getFormattedDuration(duration, false)})
					</div>

					{tasks.map((task) => {
						const { startTime, endTime, taskId } = task;

						const startTimeObj = formatDateTime(startTime);
						const endTimeObj = formatDateTime(endTime);

						return (
							<div key={`${taskId} - ${startTime}`} className="flex justify-between items-center">
								<h3 className="text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px]">
									{task?.title}
								</h3>

								{showSubtaskTime && (
									<div className="ml-3 text-white">
										{startTimeObj.time} - {endTimeObj.time}
									</div>
								)}
							</div>
						);
					})}

					<div
						className={classNames('text-color-gray-100 text-white text-[15px] break-words react-markdown')}
					>
						<ReactMarkdown>{note}</ReactMarkdown>
					</div>

					{thereAreCompletedTasks && (
						<>
							<h4 className="text-[16px] font-bold underline mt-4">Completed Tasks</h4>

							<ul className="list-disc ml-[20px]">
								{completedTasksDuringFocusSession.map((completedTask) => (
									<li key={`${focusRecord.id} ${completedTask.id}`}>{completedTask.title}</li>
								))}
							</ul>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default FocusRecord;

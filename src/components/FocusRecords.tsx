import { useEffect, useRef, useState } from 'react';
import { formatDuration, formatTimeToHoursMinutesSeconds, getFormattedDuration } from '../utils/helpers.utils';
import { areDatesEqual } from '../utils/date.utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Icon from './Icon';
import useSticky from '../hooks/useSticky';
import ModalAddFocusRecord from './Modal/ModalAddFocusRecord';
import { setModalState } from '../slices/modalSlice';
import { useDispatch } from 'react-redux';
import { formatDateTime, groupByEndTimeDay } from '../utils/date.utils';
import { useGetTasksQuery } from '../services/resources/tasksApi';
import { useGetFocusRecordsQuery } from '../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../services/resources/habitsApi';

interface StatsOverviewProps {
	overviewData: object;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ focusRecords }) => {
	const [overviewData, setOverviewData] = useState({
		todaysPomo: 0,
		todaysFocus: 0,
		totalPomo: 0,
		totalFocusDuration: 0,
	});
	const { todaysPomo, todaysFocus, totalPomo, totalFocusDuration } = overviewData;

	useEffect(() => {
		if (focusRecords) {
			let todaysPomo = 0;
			let todaysFocus = 0;
			let totalPomo = 0;
			let totalFocusDuration = 0;

			focusRecords.forEach((focusRecord) => {
				const { pomos, duration, startTime } = focusRecord;

				totalPomo += pomos;
				totalFocusDuration += duration;

				const today = new Date();

				if (areDatesEqual(new Date(startTime), today)) {
					todaysPomo += pomos;
					todaysFocus += duration;
				}
			});

			setOverviewData({
				todaysPomo,
				todaysFocus,
				totalPomo,
				totalFocusDuration,
			});
		}
	}, [focusRecords]);

	interface OverviewStatProps {
		title: string;
		value: number;
		convertToHoursAndMinutes?: boolean;
	}

	const OverviewStat: React.FC<OverviewStatProps> = ({ title, value, convertToHoursAndMinutes }) => {
		let shownValue: number | string = Number(value);

		if (convertToHoursAndMinutes) {
			const { hours, minutes } = formatTimeToHoursMinutesSeconds(value);

			shownValue = `${hours.toLocaleString()}h${minutes}m`;
		} else {
			shownValue = shownValue.toLocaleString();
		}
		return (
			<div className="bg-color-gray-600 rounded p-2">
				<h6 className="text-[12px] text-color-gray-100">{title}</h6>
				<div className="text-[22px]">{shownValue}</div>
			</div>
		);
	};

	return (
		<div className="p-5">
			<h3 className="text-[18px] font-bold mb-5">Overview</h3>

			<div className="grid grid-cols-2 gap-2">
				<OverviewStat title="Today's Pomo" value={todaysPomo} />
				<OverviewStat title="Today's Focus" value={todaysFocus} convertToHoursAndMinutes={true} />
				<OverviewStat title="Total Pomo" value={totalPomo} />
				<OverviewStat title="Total Focus Duration" value={totalFocusDuration} convertToHoursAndMinutes={true} />
			</div>
		</div>
	);
};

const FocusRecordList = () => {
	const dispatch = useDispatch();
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

	const scrollableRef = useRef(null); // Reference to the scrollable container
	const stickyRef = useRef(null); // Reference to the sticky element
	const isSticky = useSticky(scrollableRef, stickyRef); // Pass both refs to the hook

	function sortArrayByEndTime(array) {
		// Create a deep copy of the array to avoid modifying the original
		const arrayCopy = array.map((item) => ({ ...item }));

		return arrayCopy.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
	}

	const [groupedRecords, setGroupedRecords] = useState();

	useEffect(() => {
		if (focusRecords) {
			const focusRecordsWithNoParent = focusRecords.filter((record) => !parentOfFocusRecords[record._id]);

			const newGroupedRecords = groupByEndTimeDay(focusRecordsWithNoParent);
			setGroupedRecords(newGroupedRecords);
		}
	}, [focusRecords]);

	return (
		<div
			ref={scrollableRef}
			className="flex flex-col w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700"
		>
			<StatsOverview focusRecords={focusRecords} />

			<div
				ref={stickyRef}
				className={
					`flex justify-between items-center px-5 mb-4 sticky top-0` +
					(isSticky ? ' border-b border-color-gray-100 p-2 pt-4 bg-color-gray-700 z-10' : '')
				}
			>
				<h4 className="text-[18px]">Focus Record</h4>
				<Icon
					name="add"
					customClass={'!text-[20px] text-color-gray-100 cursor-pointer rounded hover:bg-color-gray-300'}
					onClick={() => dispatch(setModalState({ modalId: 'ModalAddFocusRecord', isOpen: true }))}
				/>
			</div>

			{groupedRecords &&
				Object.keys(groupedRecords).map((day) => {
					const focusRecordsForTheDay = groupedRecords[day];

					return (
						<div key={day} className="text-[13px] px-5 mt-5">
							<div className="text-color-gray-100 text-[13px] mb-3">{day}</div>

							{focusRecords &&
								tasksById && habitsById &&
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

const FocusRecord = ({ focusRecord, tasksById, habitsById }) => {
	const dispatch = useDispatch();
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { focusRecordsById } = fetchedFocusRecords || {};

	const { _id, taskId, habitId, note, duration, startTime, endTime, children } = focusRecord;

	const task = tasksById[taskId];
	const habit = habitsById[habitId];

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);

	const childFocusRecordTaskTitles = new Set();

	children?.forEach((childId) => {
		const childFocusRecord = focusRecordsById[childId];
		const isTask = childFocusRecord.taskId;

		const childItem = isTask ? tasksById[childFocusRecord.taskId] : habitsById[childFocusRecord.habitId];
		childFocusRecordTaskTitles.add(isTask ? childItem?.title : childItem?.name);
	});

	return (
		<li
			key={_id}
			className="relative m-0 list-none last:mb-[4px] mt-[24px] cursor-pointer"
			style={{ minHeight: '54px' }}
			onClick={() =>
				dispatch(
					setModalState({ modalId: 'ModalAddFocusRecord', isOpen: true, props: { focusRecord: focusRecord } })
				)
			}
		>
			<div
				className="absolute top-[28px] left-[11px] h-full border-solid border-l-[1px] border-blue-900"
				style={{ height: 'calc(100% - 16px)' }}
			></div>

			<div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				<div className="absolute left-[-40px] w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
					<Icon name="nutrition" customClass={'!text-[20px] text-blue-500 cursor-pointer'} fill={1} />
				</div>

				<div
					className="absolute left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600 border-blue-500"
					style={{ top: '34px' }}
				></div>

				<div>
					<div className="flex justify-between text-color-gray-100 text-[12px] mb-[6px]">
						<div>
							{startTimeObj.time} - {endTimeObj.time}
						</div>
						<div>{getFormattedDuration(duration)}</div>
					</div>

					{/* TODO: Render an array of titles if it has children for better clarity. */}

					{children && children.length > 0 ? (
						<div className="font-medium space-y-1">
							{[...childFocusRecordTaskTitles].map((title) => (
								<div>{title}</div>
							))}
						</div>
					) : (
						<div>
							<div>{task && <div className="font-medium">{task.title}</div>}</div>
							<div>{habit && <div className="font-medium">{habit.name}</div>}</div>
						</div>
					)}

					<div className="text-color-gray-100 mt-1 max-w-[350px] break-words">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{note}</ReactMarkdown>
					</div>
				</div>
			</div>
		</li>
	);
};

export default FocusRecordList;

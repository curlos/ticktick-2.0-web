import { useEffect, useRef, useState } from 'react';
import { areDatesEqual, formatDuration, formatTimeToHoursAndMinutes } from '../utils/helpers.utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Icon from './Icon';
import useSticky from '../hooks/useSticky';
import ModalAddFocusRecord from './Modal/ModalAddFocusRecord';
import { setModalState } from '../slices/modalSlice';
import { useDispatch } from 'react-redux';
import { useGetFocusRecordsQuery, useGetTasksQuery } from '../services/api';
import { formatDateTime, groupByEndTimeDay } from '../utils/date.utils';

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
			const { hours, minutes } = formatTimeToHoursAndMinutes(value);

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

	console.log(totalFocusDuration);

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
	const { focusRecords } = fetchedFocusRecords || {};

	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasksById } = fetchedTasks || {};

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
			const newGroupedRecords = groupByEndTimeDay(focusRecords);
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
						<div className="text-[13px] px-5 mt-5">
							<div className="text-color-gray-100 text-[13px] mb-3">{day}</div>

							{focusRecords &&
								tasksById &&
								sortArrayByEndTime(focusRecordsForTheDay).map((focusRecord) => (
									<FocusRecord focusRecord={focusRecord} tasksById={tasksById} />
								))}
						</div>
					);
				})}
		</div>
	);
};

const FocusRecord = ({ focusRecord, tasksById }) => {
	const dispatch = useDispatch();
	const { _id, taskId, note, duration, startTime, endTime } = focusRecord;

	const task = tasksById[taskId];

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);

	const { hours, minutes } = formatTimeToHoursAndMinutes(duration);
	const formattedDuration = `${hours.toLocaleString()}h${minutes}m`;

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
						<div>{formattedDuration}</div>
					</div>

					{task && <div className="font-medium">{task.title}</div>}

					<div className="text-color-gray-100 mt-1">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{note}</ReactMarkdown>
					</div>
				</div>
			</div>
		</li>
	);
};

export default FocusRecordList;

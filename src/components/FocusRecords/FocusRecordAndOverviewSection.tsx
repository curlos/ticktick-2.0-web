import { useEffect, useRef, useState } from 'react';
import { formatTimeToHoursMinutesSeconds, getFormattedDuration } from '../../utils/helpers.utils';
import { areDatesEqual } from '../../utils/date.utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Icon from '../Icon';
import useSticky from '../../hooks/useSticky';
import { setModalState } from '../../slices/modalSlice';
import { useDispatch } from 'react-redux';
import { formatDateTime, groupByEndTimeDay } from '../../utils/date.utils';
import { useGetTasksQuery } from '../../services/resources/tasksApi';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import FocusRecord from './FocusRecord';
import FocusRecordList from './FocusRecordList';

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

const FocusRecordAndOverviewSection = () => {
	const dispatch = useDispatch();
	// RTK Query - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { focusRecords } = fetchedFocusRecords || {};

	const scrollableRef = useRef(null); // Reference to the scrollable container
	const stickyRef = useRef(null); // Reference to the sticky element
	const isSticky = useSticky(scrollableRef, stickyRef); // Pass both refs to the hook

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

			<div className="px-5 mt-5">
				<FocusRecordList />
			</div>
		</div>
	);
};

export default FocusRecordAndOverviewSection;

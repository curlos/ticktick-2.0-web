import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar } from 'recharts';
import { getFormattedDuration } from '../../../utils/helpers.utils';
import DateRangePicker from './DateRangePicker';
import { useStatsContext } from '../../../contexts/useStatsContext';
import {
	convertTo12HourFormat,
	getDailyHourBlocks,
	getFormattedLongDay,
	getTimeInBlocks,
} from '../../../utils/date.utils';
import ModalPickDateRange from './ModalPickDateRange';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';

const data = [
	{
		name: 'July 8',
		seconds: 15060,
	},
	{
		name: 'July 9',
		seconds: 19140,
	},
	{
		name: 'July 10',
		seconds: 20040,
	},
	{
		name: 'July 11',
		seconds: 20940,
	},
	{
		name: 'July 12',
		seconds: 18180,
	},
	{
		name: 'July 13',
		seconds: 21600,
	},
	{
		name: 'July 14',
		seconds: 10800,
	},
];

const MostFocusedTimeCard = () => {
	const { focusRecords, focusRecordsGroupedByDate } = useStatsContext();
	const [selectedDates, setSelectedDates] = useState([new Date('August 1, 2024')]);
	const [data, setData] = useState([]);

	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
	const [selectedInterval, setSelectedInterval] = useState('Month');

	// Custom
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	useEffect(() => {
		if (selectedInterval === 'All' && focusRecords) {
			getTimeBlockTotalsForInterval();
		} else if (selectedInterval !== 'All' && selectedDates?.length > 0 && focusRecordsGroupedByDate) {
			getTimeBlockTotalsForInterval();
		}
	}, [selectedDates, focusRecordsGroupedByDate, focusRecords, selectedInterval]);

	const getTimeBlockTotalsForInterval = () => {
		console.log(selectedDates);

		const newDailyHourBlocks = getDailyHourBlocks();

		// If the selected interval is "Day", "Week", "Month", "Year", or "Custom"
		if (selectedInterval !== 'All') {
			for (let date of selectedDates) {
				const dateKey = getFormattedLongDay(date);
				const focusRecordsForTheDay = focusRecordsGroupedByDate[dateKey];

				if (focusRecordsForTheDay) {
					fillInHourBlocksWithSeconds(focusRecordsForTheDay, newDailyHourBlocks);
				}
			}
		} else {
			if (focusRecords) {
				fillInHourBlocksWithSeconds(focusRecords, newDailyHourBlocks);
			}
		}

		const newData = Object.keys(newDailyHourBlocks).map((timeHourBlockKey) => {
			const timeHourBlock = newDailyHourBlocks[timeHourBlockKey];
			const { from, seconds } = timeHourBlock;

			return {
				name: convertTo12HourFormat(from),
				seconds,
			};
		});

		setData(newData);
	};

	const fillInHourBlocksWithSeconds = (focusRecords, newDailyHourBlocks) => {
		for (let focusRecord of focusRecords) {
			const { startTime, endTime, pauseDuration, tasks } = focusRecord;

			if (tasks?.length > 0) {
				for (let task of tasks) {
					const { startTime, endTime } = task;
					const timeInBlocks = getTimeInBlocks(startTime, endTime);

					for (let timeBlock of timeInBlocks) {
						const { from, to, seconds } = timeBlock;

						newDailyHourBlocks[from].seconds += seconds;
					}
				}
			} else {
				console.log('TODO:');
			}
		}
	};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-6">
				<h3 className="font-bold text-[16px]">Most Focused Time</h3>

				<div className="flex items-center gap-2">
					<GeneralSelectButtonAndDropdown
						selected={selectedInterval}
						setSelected={setSelectedInterval}
						selectedOptions={selectedIntervalOptions}
						onClick={(name) => {
							if (name?.toLowerCase() !== 'custom') {
								return;
							}

							setIsModalPickDateRangeOpen(true);
						}}
					/>

					{selectedInterval !== 'All' && (
						<DateRangePicker
							selectedDates={selectedDates}
							setSelectedDates={setSelectedDates}
							selectedInterval={selectedInterval}
							startDate={startDate}
							endDate={endDate}
						/>
					)}
				</div>
			</div>

			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					width={500}
					height={300}
					data={data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
					barSize={10}
				>
					<XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
					<YAxis dataKey="seconds" tickFormatter={(value) => `${getFormattedDuration(value, false)}`} />
					<Tooltip
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { name, seconds } = payload[0].payload;
								return (
									<div className="bg-black text-blue-500 p-2 rounded-md">{`${name}, ${getFormattedDuration(seconds, false)}`}</div>
								);
							}

							return null;
						}}
					/>
					<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
					<Bar
						dataKey="seconds"
						fill="#3b82f6"
						background={{ fill: '#3a3a3a' }}
						activeBar={{ fill: '#6ca6fc', cursor: 'pointer' }}
					/>
				</BarChart>
			</ResponsiveContainer>

			<ModalPickDateRange
				isModalOpen={isModalPickDateRangeOpen}
				setIsModalOpen={setIsModalPickDateRangeOpen}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
			/>
		</div>
	);
};

export default MostFocusedTimeCard;

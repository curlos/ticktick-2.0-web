import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useEffect, useState } from 'react';
import DateRangePicker from './DateRangePicker';
import ModalPickDateRange from './ModalPickDateRange';
import { useStatsContext } from '../../../contexts/useStatsContext';
import {
	getFormattedLongDay,
	getFormattedShortMonthDay,
	groupDatesByInterval,
	hasDatePassed,
} from '../../../utils/date.utils';
import { getFocusDurationFromArray, getFormattedDuration } from '../../../utils/helpers.utils';
import classNames from 'classnames';

const TrendsCard = () => {
	const { focusRecords, focusRecordsGroupedByDate } = useStatsContext();

	const [data, setData] = useState([]);

	const selectedIntervalOptions = ['Week', 'Month', 'Year', 'All', 'Custom'];
	const [selectedInterval, setSelectedInterval] = useState(selectedIntervalOptions[0]);
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	const selectedGroupedIntervalOptions = ['Days', 'Weeks', 'Months'];
	const [selectedGroupedInterval, setSelectedGroupedInterval] = useState('Days');

	// Custom
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	useEffect(() => {
		// TODO: BS
		if (selectedInterval === 'All' && focusRecords) {
			const allFocusRecordDates = Object.keys(focusRecordsGroupedByDate).map((dateKey) => new Date(dateKey));
			const newData = getUpdatedData(allFocusRecordDates);
			setData(newData);
		} else if (selectedInterval !== 'All' && selectedDates?.length > 0 && focusRecordsGroupedByDate) {
			const newData = getUpdatedData(selectedDates);
			setData(newData);
		}
	}, [selectedDates, selectedInterval, selectedGroupedInterval, focusRecordsGroupedByDate, focusRecords]);

	useEffect(() => {
		if (selectedInterval === 'Month') {
			setSelectedGroupedInterval('Days');
		}
	}, [selectedInterval]);

	const getUpdatedData = (selectedDates) => {
		const newData = [];

		const groupedDates = groupDatesByInterval(selectedDates, selectedGroupedInterval);

		Object.keys(groupedDates).forEach((groupedKey) => {
			const daysInGroupedInterval = groupedDates[groupedKey];
			let focusDurationForGroup = 0;

			for (let date of daysInGroupedInterval) {
				const dateKey = getFormattedLongDay(date);

				const focusRecordsForDay = focusRecordsGroupedByDate[dateKey];
				focusDurationForGroup += getFocusDurationFromArray(focusRecordsForDay);
			}

			newData.push({
				name: groupedKey,
				seconds: focusDurationForGroup,
			});
		});

		return newData;
	};

	const getAverage = () => {
		let totalSeconds = 0;
		let daysWithAtLeastOneFocusRecord = 0;

		data.forEach((day) => {
			const { seconds } = day;
			totalSeconds += seconds;

			if (seconds) {
				daysWithAtLeastOneFocusRecord += 1;
			}
		});

		const averageSeconds = totalSeconds / daysWithAtLeastOneFocusRecord;

		return `Daily Average: ${getFormattedDuration(averageSeconds, false)}`;
	};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-4">
				<h3 className="font-bold text-[16px]">Trends</h3>

				<div className={classNames('flex gap-2 items-center', selectedInterval === 'All' && 'py-2')}>
					{selectedInterval !== 'Week' && (
						<GeneralSelectButtonAndDropdown
							selected={selectedGroupedInterval}
							setSelected={setSelectedGroupedInterval}
							selectedOptions={
								selectedInterval === 'Month' ? ['Days', 'Weeks'] : selectedGroupedIntervalOptions
							}
						/>
					)}

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

			<div className="text-color-gray-100 mb-2">{getAverage()}</div>

			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					width={500}
					height={400}
					data={data}
					margin={{
						top: 10,
						right: 30,
						left: 0,
						bottom: 0,
					}}
				>
					<defs>
						<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="30%" stopColor="#3b82f6" stopOpacity={0.8} />
							<stop offset="95%" stopColor="black" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="5" strokeOpacity={0.3} />
					<XAxis dataKey="name" />
					<YAxis
						dataKey="seconds"
						type="number"
						domain={['dataMin', 'dataMax']}
						tickFormatter={(seconds) => getFormattedDuration(seconds, false)}
					/>
					<Tooltip
						offset={10}
						contentStyle={{
							backgroundColor: 'black',
						}}
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
					<Area type="monotone" dataKey="seconds" stroke="#3b82f6" strokeWidth={3} fill="url(#colorPv)" />
				</AreaChart>
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

export default TrendsCard;

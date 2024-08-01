import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import ModalPickDateRange from './ModalPickDateRange';

const data = [
	{
		name: 'July 8',
		score: 2,
	},
	{
		name: 'July 9',
		score: 2,
	},
	{
		name: 'July 10',
		score: 7,
	},
	{
		name: 'July 11',
		score: 1,
	},
	{
		name: 'July 12',
		score: 1,
	},
	{
		name: 'July 13',
		score: 8,
	},
	{
		name: 'July 14',
		score: 4,
	},
];

const TrendsCard = () => {
	const selectedOptions = ['List', 'Tag', 'Task'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'Custom'];
	const [selectedInterval, setSelectedInterval] = useState(selectedIntervalOptions[0]);
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	// Custom
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-4">
				<h3 className="font-bold text-[16px]">Trends</h3>

				<div className="flex gap-2 items-center">
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

					<DateRangePicker
						selectedDates={selectedDates}
						setSelectedDates={setSelectedDates}
						selectedInterval={selectedInterval}
						startDate={startDate}
						endDate={endDate}
					/>
				</div>
			</div>

			<div className="text-color-gray-100 mb-2">Daily Average: 5h36m</div>

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
						{/* <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
						</linearGradient> */}
						<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="30%" stopColor="#3b82f6" stopOpacity={0.8} />
							<stop offset="95%" stopColor="black" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="5" strokeOpacity={0.3} />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip
						offset={10}
						contentStyle={{
							backgroundColor: 'black',
						}}
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { name, score } = payload[0].payload;
								return (
									<div className="bg-black text-blue-500 p-2 rounded-md">{`${name}, ${score}`}</div>
								);
							}

							return null;
						}}
					/>
					<Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="url(#colorPv)" />
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

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useEffect, useState } from 'react';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { getLast7Days } from '../../../utils/date.utils';

const RecentCompletionCurveCard = () => {
	const lastSevenDays = getLast7Days();
	const defaultData = lastSevenDays.map((day) => ({
		name: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
		score: 0,
	}));

	const [data, setData] = useState(defaultData);
	const selectedOptions = ['Day', 'Week', 'Month'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	const { statsForLastSevenDays, statsForLastSevenWeeks } = useStatsContext();

	useEffect(() => {
		if (!statsForLastSevenDays || !statsForLastSevenWeeks) {
			return;
		}

		let statsToUse = null;

		switch (selected) {
			case 'Day':
				statsToUse = statsForLastSevenDays;
				break;
			case 'Week':
				statsToUse = statsForLastSevenWeeks;
				break;
			default:
				statsToUse = statsForLastSevenDays;
		}

		const newData = statsToUse?.map((dataForTheDay) => ({
			name: dataForTheDay.name,
			fullName: dataForTheDay.fullName || dataForTheDay.name,
			score: dataForTheDay.completedTasks?.length || 0,
		}));
		setData(newData);
	}, [selected, statsForLastSevenDays, statsForLastSevenWeeks]);

	console.log(data);

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-6">
				<h3 className="font-bold text-[16px]">Recent Completion Curve</h3>

				<GeneralSelectButtonAndDropdown
					selected={selected}
					setSelected={setSelected}
					selectedOptions={selectedOptions}
				/>
			</div>

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
								const { name, fullName, score } = payload[0].payload;

								const nameToUse = fullName ? fullName : name;

								return (
									<div className="bg-black text-blue-500 p-2 rounded-md">{`${nameToUse} = ${score}`}</div>
								);
							}

							return null;
						}}
					/>
					<Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="url(#colorPv)" />
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default RecentCompletionCurveCard;

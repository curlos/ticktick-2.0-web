import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { getFormattedLongDay, getLast7Days } from '../../../utils/date.utils';

const CompletionDistributionCard = ({ selectedTimeInterval, selectedDates }) => {
	const { completedTasksGroupedByDate } = useStatsContext();

	const lastSevenDays = getLast7Days();
	const defaultData = lastSevenDays.map((day) => ({
		name: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
		completedTasks: 0,
	}));

	const [data, setData] = useState(defaultData);

	useEffect(() => {
		if (!completedTasksGroupedByDate) {
			return;
		}

		const newData = getCompletedTasksData();

		console.log(newData);

		setData(newData);
	}, [completedTasksGroupedByDate, selectedDates, selectedTimeInterval]);

	const getCompletedTasksData = () => {
		if (selectedTimeInterval === 'All') {
			return Object.keys(completedTasksGroupedByDate).map((dateKey) => {
				const date = new Date(dateKey);
				const completedTasksForDateArr = completedTasksGroupedByDate[dateKey] || [];

				const dayShortName = date.toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
				});
				const dayLongName = date.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				});

				return {
					name: dayShortName,
					fullName: dayLongName,
					completedTasks: completedTasksForDateArr.length,
				};
			});
		}

		return selectedDates.map((date) => {
			const dateKey = getFormattedLongDay(date);
			const completedTasksForDateArr = completedTasksGroupedByDate[dateKey] || [];

			const dayShortName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
			const dayLongName = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

			return {
				name: dayShortName,
				fullName: dayLongName,
				completedTasks: completedTasksForDateArr.length,
			};
		});
	};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col">
			<div className="flex justify-between items-center mb-6">
				<h3 className="font-bold text-[16px]">Completion Distribution</h3>
			</div>

			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					width={512}
					height={210}
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
					<YAxis dataKey="completedTasks" tickFormatter={(value) => `${value}`} />
					<Tooltip
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { name, fullName, completedTasks } = payload[0].payload;
								const nameToUse = fullName || name;

								return (
									<div className="bg-black text-blue-500 p-2 rounded-md">{`${nameToUse}, ${completedTasks}`}</div>
								);
							}

							return null;
						}}
					/>
					<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
					<Bar
						dataKey="completedTasks"
						fill="#3b82f6"
						background={{ fill: '#3a3a3a' }}
						activeBar={{ fill: '#6ca6fc', cursor: 'pointer' }}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default CompletionDistributionCard;

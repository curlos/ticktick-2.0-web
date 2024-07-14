import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import TimeIntervalsButtonAndDropdown from '../TimeIntervalsButtonAndDropdown';

const data = [
	{
		name: 'July 8',
		percent: 100,
	},
	{
		name: 'July 9',
		percent: 100,
	},
	{
		name: 'July 10',
		percent: 0,
	},
	{
		name: 'July 11',
		percent: 100,
	},
	{
		name: 'July 12',
		percent: 100,
	},
	{
		name: 'July 13',
		percent: 0,
	},
	{
		name: 'July 14',
		percent: 50,
	},
];

const RecentCompletionRateCurveCard = () => {
	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-6">
				<h3 className="font-bold text-[16px]">Recent Pomo Curve</h3>

				<TimeIntervalsButtonAndDropdown />
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
					<YAxis dataKey="percent" tickFormatter={(value) => `${value}%`} />
					<Tooltip
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { name, percent } = payload[0].payload;
								return (
									<div className="bg-black text-blue-500 p-2 rounded-md">{`${name}, ${percent}%`}</div>
								);
							}

							return null;
						}}
					/>
					<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
					<Bar
						dataKey="percent"
						fill="#3b82f6"
						background={{ fill: '#3a3a3a' }}
						activeBar={{ fill: '#6ca6fc', cursor: 'pointer' }}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default RecentCompletionRateCurveCard;

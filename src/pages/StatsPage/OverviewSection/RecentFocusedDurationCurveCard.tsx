import { getFormattedDuration } from '../../../utils/helpers.utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useState } from 'react';

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

const RecentFocusedDurationCurveCard = () => {
	const selectedOptions = ['Day', 'Week', 'Month'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-6">
				<h3 className="font-bold text-[16px]">Recent Focused Duration Curve</h3>

				<GeneralSelectButtonAndDropdown
					selected={selected}
					setSelected={setSelected}
					selectedOptions={selectedOptions}
				/>
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
		</div>
	);
};

export default RecentFocusedDurationCurveCard;

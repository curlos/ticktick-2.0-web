import { getFormattedDuration } from '../../../utils/helpers.utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useState } from 'react';

const data = [
	{
		name: 'July 8',
		completedTasks: 2,
	},
	{
		name: 'July 9',
		completedTasks: 2,
	},
	{
		name: 'July 10',
		completedTasks: 0,
	},
	{
		name: 'July 11',
		completedTasks: 1,
	},
	{
		name: 'July 12',
		completedTasks: 1,
	},
	{
		name: 'July 13',
		completedTasks: 0,
	},
	{
		name: 'July 14',
		completedTasks: 1,
	},
];

const CompletionDistributionCard = () => {
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
								const { name, completedTasks } = payload[0].payload;
								console.log(completedTasks);

								return (
									<div className="bg-black text-blue-500 p-2 rounded-md">{`${name}, ${completedTasks}`}</div>
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

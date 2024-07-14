import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
	{
		name: '8',
		score: 7518,
	},
	{
		name: '9',
		score: 7532,
	},
	{
		name: '10',
		score: 7545,
	},
	{
		name: '11',
		score: 7545,
	},
	{
		name: '12',
		score: 7551,
	},
	{
		name: '13',
		score: 7558,
	},
	{
		name: 'Today',
		score: 7559,
	},
];

const MyAchievementScoreCard = () => {
	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[300px]">
			<div className="flex justify-between gap-2">
				<h3 className="font-medium text-[16px]">My Achievement Score</h3>
				<div className="flex items-center gap-2">
					<div className="text-green-400 font-bold text-[20px]">7559</div>
					<img
						src="/hades-keepsake-icons/hades_gamepedia_en-images-f-fa-Sigil_of_the_Dead.png-revision-latest-scale-to-width-down.png"
						className="w-[30px]"
					/>
				</div>
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
								const { score } = payload[0].payload;
								return <div className="bg-black text-blue-500 p-2 rounded-md">{score}</div>;
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

export default MyAchievementScoreCard;

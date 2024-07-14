import { PieChart, Pie, Cell, Label } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useState } from 'react';

const ClassifiedCompletionStatisticsCard = () => {
	const progressBarData = [
		{ name: 'Inbox', value: 5, percentage: 63, color: '#3690E4' },
		{ name: 'Hello Mobile', value: 3, percentage: 37, color: '#FF7D00' },
	];

	const SmallLabel = ({ data }) => {
		const { name, value, color } = data;

		return (
			<div className="flex items-center gap-2">
				<div
					className="w-[15px] h-[15px] rounded-full"
					style={{
						backgroundColor: color,
					}}
				></div>
				<div className="w-[10px]">{value}</div>
				<div className="border-l border-color-gray-100 pl-2">{name}</div>
			</div>
		);
	};

	const selectedOptions = ['List', 'Tag'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[280px]">
			<div className="flex justify-between items-center">
				<h3 className="font-bold text-[16px]">Classified Completion Statistics</h3>

				<GeneralSelectButtonAndDropdown
					selected={selected}
					setSelected={setSelected}
					selectedOptions={selectedOptions}
				/>
			</div>

			<div className="flex-1 mt-2 flex items-center gap-10 px-4">
				<div>
					<PieChart width={170} height={170}>
						<Pie
							data={progressBarData}
							cx={80}
							cy={80}
							innerRadius={70}
							outerRadius={85}
							paddingAngle={5}
							dataKey="percentage"
						>
							{progressBarData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
							))}

							<Label
								position="center"
								fill="white"
								content={({ viewBox }) => {
									const { cx, cy } = viewBox;

									// In Recharts, the Label component inside a Pie (or other chart types) does not support rendering HTML elements such as <div> directly because it operates within an SVG context. This is why "svg" elements like "<text>" are used instead to display the HTML elements.

									return (
										<g>
											<text
												x={cx}
												y={cy - 10}
												fill="white"
												textAnchor="middle"
												dominantBaseline="central"
												className="text-[24px] font-bold"
											>
												8
											</text>
											<text
												x={cx}
												y={cy + 15}
												fill="#aaa"
												textAnchor="middle"
												dominantBaseline="central"
												className="text-[14px]"
											>
												Completed Tasks
											</text>
										</g>
									);
								}}
							/>
							{/* <CustomLabel value="50%" /> */}
						</Pie>
					</PieChart>
				</div>

				<div className="space-y-2">
					{progressBarData.map((data) => (
						<SmallLabel key={data.name} data={data} />
					))}
				</div>
			</div>
		</div>
	);
};

export default ClassifiedCompletionStatisticsCard;

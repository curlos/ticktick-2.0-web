import { PieChart, Pie, Cell, Label } from 'recharts';

const CompletionRateDistributionCard = () => {
	const progressBarData = [
		{ name: 'Overdue', value: 0, percentage: 0, color: '#1F67E2' },
		{ name: 'On-Time', value: 1, percentage: 50, color: '#3690E4' },
		{ name: 'Undated', value: 0, percentage: 0, color: '#E69138' },
		{ name: 'Uncompleted', value: 1, percentage: 50, color: '#FF7D00' },
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

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[280px]">
			<h3 className="font-bold text-[16px]">Completion Rate Distribution</h3>

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
												50%
											</text>
											<text
												x={cx}
												y={cy + 15}
												fill="#aaa"
												textAnchor="middle"
												dominantBaseline="central"
												className="text-[14px]"
											>
												Completion Rate
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

export default CompletionRateDistributionCard;

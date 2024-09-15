import { PieChart, Pie, Cell, Label } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useEffect, useState } from 'react';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { checkIfInboxProject } from '../../../utils/tickTickOne.util';
import classNames from 'classnames';

const noData = [
	{
		name: 'No Data',
		color: 'gray',
		value: 0,
		percentage: 100,
	},
];

const ClassifiedCompletionStatisticsCard = ({ selectedTimeInterval, selectedDates }) => {
	const { completedTasksGroupedByDate, getCompletedTasksFromSelectedDates, projectsById } = useStatsContext() || {};

	const [progressBarData, setProgressBarData] = useState(noData);
	const [numOfCompletedTasks, setNumOfCompletedTasks] = useState(0);
	const [thereIsNoData, setThereIsNoData] = useState(true);

	useEffect(() => {
		if (!completedTasksGroupedByDate || !projectsById) {
			return;
		}

		console.log('hello world');

		// Get all the completed tasks from the selected interval of dates
		const allCompletedTasksForInterval = getCompletedTasksFromSelectedDates(selectedDates);
		const newNumOfCompletedTasks = allCompletedTasksForInterval.length;

		// Group up those tasks by project
		const completedTasksGroupedByProject = {};

		allCompletedTasksForInterval.forEach((task) => {
			const { projectId } = task;

			if (!completedTasksGroupedByProject[projectId]) {
				completedTasksGroupedByProject[projectId] = [];
			}

			completedTasksGroupedByProject[projectId].push(task);
		});

		let newProgressBarData = Object.keys(completedTasksGroupedByProject).map((projectId) => {
			const completedTasksArr = completedTasksGroupedByProject[projectId];
			const numOfCompletedTasks = completedTasksArr.length;
			const percentage = Number(((numOfCompletedTasks / newNumOfCompletedTasks) * 100).toFixed(2));

			const isFromInboxProject = checkIfInboxProject(projectId);

			let name = 'Inbox';
			let color = 'green';

			if (!isFromInboxProject) {
				const project = projectsById[projectId];
				name = project.name;
				color = project.color;
			}

			return {
				name,
				color,
				value: numOfCompletedTasks,
				percentage,
			};
		});

		const thereIsNoData = !newProgressBarData || newProgressBarData.length === 0;

		if (thereIsNoData) {
			newProgressBarData = noData;

			setThereIsNoData(true);
		} else {
			setThereIsNoData(false);
		}

		setNumOfCompletedTasks(newNumOfCompletedTasks);
		setProgressBarData(newProgressBarData);
	}, [completedTasksGroupedByDate, selectedDates, projectsById]);

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
				<div className="w-[25px]">{value}</div>
				<div className="border-l border-color-gray-100 pl-2">{name}</div>
			</div>
		);
	};

	const selectedOptions = ['Project', 'Tag'];
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

			<div className={classNames('flex-1 mt-2 flex items-center gap-10 px-4', thereIsNoData && 'justify-center')}>
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
											{!thereIsNoData ? (
												<>
													<text
														x={cx}
														y={cy - 10}
														fill="white"
														textAnchor="middle"
														dominantBaseline="central"
														className="text-[24px] font-bold"
													>
														{numOfCompletedTasks}
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
												</>
											) : (
												<text
													x={cx}
													y={cy}
													fill="#aaa"
													textAnchor="middle"
													dominantBaseline="central"
													className="text-[14px]"
												>
													No Data
												</text>
											)}
										</g>
									);
								}}
							/>
						</Pie>
					</PieChart>
				</div>

				{!thereIsNoData && (
					<div className="space-y-2">
						{progressBarData.map((data) => (
							<SmallLabel key={data.name} data={data} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ClassifiedCompletionStatisticsCard;

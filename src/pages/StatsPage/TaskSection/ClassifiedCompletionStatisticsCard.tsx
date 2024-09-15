import { PieChart, Pie, Cell, Label } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useEffect, useRef, useState } from 'react';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { checkIfInboxProject } from '../../../utils/tickTickOne.util';
import classNames from 'classnames';
import SmallLabel from './SmallLabel';
import DropdownCompletedSmallLabeList from './DropdownCompletedSmallLabeList';

const noData = [
	{
		name: 'No Data',
		color: 'gray',
		value: 0,
		percentage: 100,
	},
];

const ClassifiedCompletionStatisticsCard = ({ selectedTimeInterval, selectedDates }) => {
	const { completedTasksGroupedByDate, getCompletedTasksFromSelectedDates, projectsById, tags, tagsByRawName } =
		useStatsContext() || {};

	const selectedOptions = ['Project', 'Tag'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	const [progressBarData, setProgressBarData] = useState(noData);
	const [numOfCompletedTasks, setNumOfCompletedTasks] = useState(0);
	const [thereIsNoData, setThereIsNoData] = useState(true);

	useEffect(() => {
		if (!completedTasksGroupedByDate || !projectsById) {
			return;
		}

		// Get all the completed tasks from the selected interval of dates
		const allCompletedTasksForInterval = getCompletedTasksFromSelectedDates(selectedDates);
		const newNumOfCompletedTasks = allCompletedTasksForInterval.length;

		let newProgressBarData = progressBarData;

		switch (selected) {
			case 'Project':
				newProgressBarData = getDataByProjects(allCompletedTasksForInterval, newNumOfCompletedTasks);
				break;
			case 'Tag':
				newProgressBarData = getDataByTags(allCompletedTasksForInterval, newNumOfCompletedTasks);
				break;
			default:
				newProgressBarData = getDataByProjects(allCompletedTasksForInterval, newNumOfCompletedTasks);
			// case 'Task':
			// 	newProgressBarData = getDataByProjects(allCompletedTasksForInterval, newNumOfCompletedTasks);
		}

		const thereIsNoData = !newProgressBarData || newProgressBarData.length === 0;

		if (thereIsNoData) {
			newProgressBarData = noData;

			setThereIsNoData(true);
		} else {
			setThereIsNoData(false);
		}

		setNumOfCompletedTasks(newNumOfCompletedTasks);
		setProgressBarData(newProgressBarData);
	}, [completedTasksGroupedByDate, selectedDates, projectsById, tagsByRawName, selected]);

	const getDataByProjects = (allCompletedTasksForInterval, newNumOfCompletedTasks) => {
		const completedTasksGroupedByProject = {};

		allCompletedTasksForInterval.forEach((task) => {
			const { projectId } = task;

			if (!completedTasksGroupedByProject[projectId]) {
				completedTasksGroupedByProject[projectId] = [];
			}

			completedTasksGroupedByProject[projectId].push(task);
		});

		return Object.keys(completedTasksGroupedByProject).map((projectId) => {
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
	};

	const getDataByTags = (allCompletedTasksForInterval, newNumOfCompletedTasks) => {
		const completedTasksGroupedByTags = {};
		const UNCLASSIFIED_KEY = 'UNCLASSIFIED';

		allCompletedTasksForInterval.forEach((task) => {
			const { tags } = task;

			if (tags && tags.length > 0) {
				console.log(task);
				console.log(tags);

				for (let tagName of tags) {
					if (!completedTasksGroupedByTags[tagName]) {
						completedTasksGroupedByTags[tagName] = [];
					}

					completedTasksGroupedByTags[tagName].push(task);
				}
			} else {
				// If the task is unclassified (no tags)
				if (!completedTasksGroupedByTags[UNCLASSIFIED_KEY]) {
					completedTasksGroupedByTags[UNCLASSIFIED_KEY] = [];
				}

				completedTasksGroupedByTags[UNCLASSIFIED_KEY].push(task);
			}
		});

		return Object.keys(completedTasksGroupedByTags).map((tagName) => {
			const completedTasksArr = completedTasksGroupedByTags[tagName];
			const numOfCompletedTasks = completedTasksArr.length;
			const percentage = Number(((numOfCompletedTasks / newNumOfCompletedTasks) * 100).toFixed(2));

			const isUnclassifiedTag = tagName === UNCLASSIFIED_KEY;

			let name = 'Unclassified';
			let color = 'black';

			if (!isUnclassifiedTag) {
				const tag = tagsByRawName[tagName];
				name = tag.name;
				color = tag.color;
			}

			return {
				name,
				color,
				value: numOfCompletedTasks,
				percentage,
			};
		});
	};

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
					<SmallLabelList progressBarData={progressBarData} />
					// <div className="space-y-2">
					// 	{progressBarData.map((data) => (
					// 		<SmallLabel key={data.name} data={data} />
					// 	))}
					// </div>
				)}
			</div>
		</div>
	);
};

const SmallLabelList = ({ progressBarData }) => {
	const dropdownFocusRankingListRef = useRef(null);
	const [isDropdownCompletedSmallListVisible, setIsDropdownCompletedSmallListVisible] = useState(false);

	return (
		<div>
			<div className="space-y-2 w-full">
				{progressBarData.slice(0, 5).map((data) => (
					<SmallLabel key={data.name} data={data} />
				))}
			</div>

			{progressBarData?.length > 5 && (
				<div className="relative">
					<div
						ref={dropdownFocusRankingListRef}
						onClick={() => setIsDropdownCompletedSmallListVisible(!isDropdownCompletedSmallListVisible)}
						className="text-color-gray-100 cursor-pointer mt-2"
					>
						View More
					</div>

					<DropdownCompletedSmallLabeList
						toggleRef={dropdownFocusRankingListRef}
						isVisible={isDropdownCompletedSmallListVisible}
						setIsVisible={setIsDropdownCompletedSmallListVisible}
						progressBarData={progressBarData}
					/>
				</div>
			)}
		</div>
	);
};

export default ClassifiedCompletionStatisticsCard;

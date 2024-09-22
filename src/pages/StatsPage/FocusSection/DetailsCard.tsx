import { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, Label } from 'recharts';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import DateRangePicker from './DateRangePicker';
import DropdownFocusRankingList from './DropdownFocusRankingList';
import ModalPickDateRange from './ModalPickDateRange';
import ProgressBar from './ProgressBar';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { checkIfInboxProject } from '../../../utils/tickTickOne.util';
import { getFocusDurationFromArray, getFormattedDuration, getRandomColor } from '../../../utils/helpers.utils';

const noData = [
	{
		name: 'No Data',
		color: 'gray',
		value: 0,
		percentage: 100,
	},
];

const DetailsCard = () => {
	const { focusRecordsGroupedByDate, getFocusRecordsFromSelectedDates, tasksById, projectsById, tagsByRawName } =
		useStatsContext();

	// const progressBarData = [
	// 	{ name: 'Hello Mobile', value: '426h28m', percentage: 53.47, color: '#3b82f6' },
	// 	{ name: 'Side Projects', value: '246h33m', percentage: 30.91, color: '#dc2626' },
	// 	{ name: 'GUNPLA', value: '42h12m', percentage: 5.29, color: '#7e22ce' },
	// 	{ name: 'Q Link Wireless', value: '23h47m', percentage: 5.29, color: '#f97316' },
	// 	{ name: 'GFE - Handbook', value: '16h21m', percentage: 2.05, color: '#2dd4bf' },
	// ];

	const [progressBarData, setProgressBarData] = useState(noData);
	const [thereIsNoData, setThereIsNoData] = useState(true);

	const selectedOptions = ['Project', 'Tag', 'Task'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'Custom'];
	const [selectedInterval, setSelectedInterval] = useState(selectedIntervalOptions[0]);
	const [selectedDates, setSelectedDates] = useState([new Date()]);
	const [focusDurationForInterval, setFocusDurationForInterval] = useState(0);

	// Custom
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	useEffect(() => {
		if (!focusRecordsGroupedByDate || !projectsById || !tasksById) {
			return;
		}

		// Get all the completed tasks from the selected interval of dates
		const allFocusRecordsForInterval = getFocusRecordsFromSelectedDates(selectedDates);
		const newNumOfFocusRecords = allFocusRecordsForInterval.length;
		const newFocusDurationForInterval = getFocusDurationFromArray(allFocusRecordsForInterval);

		let newProgressBarData = progressBarData;

		switch (selected) {
			case 'Project':
				newProgressBarData = getDataByProjects(allFocusRecordsForInterval, newFocusDurationForInterval);
				break;
			case 'Tag':
				newProgressBarData = getDataByTags(allFocusRecordsForInterval, newFocusDurationForInterval);
				break;
			default:
				newProgressBarData = getDataByProjects(allFocusRecordsForInterval, newFocusDurationForInterval);
		}

		const thereIsNoData = !newProgressBarData || newProgressBarData.length === 0;

		if (thereIsNoData) {
			newProgressBarData = noData;

			setThereIsNoData(true);
		} else {
			setThereIsNoData(false);
		}

		setProgressBarData(newProgressBarData);
		setFocusDurationForInterval(newFocusDurationForInterval);
	}, [focusRecordsGroupedByDate, selectedDates, projectsById, tagsByRawName, selected, tasksById]);

	const getDataByProjects = (allFocusRecordsForInterval, focusDurationForInterval) => {
		const focusRecordsGroupedByProject = {};

		// Default it to the "Inbox" project if the focus record has no task with a project.
		const INBOX_PROJECT_ID = 'inbox116577688';

		allFocusRecordsForInterval.forEach((focusRecord) => {
			const { tasks } = focusRecord;

			if (tasks?.length > 0) {
				for (const task of tasks) {
					const { taskId } = task;
					let projectKey = INBOX_PROJECT_ID;

					if (taskId) {
						if (tasksById[taskId]) {
							const { projectId } = tasksById[taskId];
							projectKey = projectId;
						}
					}

					if (!focusRecordsGroupedByProject[projectKey]) {
						focusRecordsGroupedByProject[projectKey] = [];
					}

					focusRecordsGroupedByProject[projectKey].push(task);
				}
			} else {
				// If there are no tasks in the focus records, there is no connected project, so just put it in the "Inbox" project by default.
				if (!focusRecordsGroupedByProject[INBOX_PROJECT_ID]) {
					focusRecordsGroupedByProject[INBOX_PROJECT_ID] = [];
				}

				focusRecordsGroupedByProject[INBOX_PROJECT_ID].push(focusRecord);
			}
		});

		// console.log(focusRecordsGroupedByProject);

		let sum = 0;
		// console.log(Object.values(focusRecordsGroupedByProject).forEach((arr) => (sum += arr.length)));
		// console.log(sum);

		return Object.keys(focusRecordsGroupedByProject).map((projectId) => {
			const focusRecordsArr = focusRecordsGroupedByProject[projectId];
			const focusDurationForProject = getFocusDurationFromArray(focusRecordsArr);

			// const numOfFocusRecords = focusRecordsArr.length;

			const percentage = Number(((focusDurationForProject / focusDurationForInterval) * 100).toFixed(2));

			const isFromInboxProject = checkIfInboxProject(projectId);

			let name = 'Inbox';
			let color = 'green';

			if (!isFromInboxProject) {
				const project = projectsById[projectId];
				name = project.name;

				if (project.color) {
					color = project.color;
				} else {
					// If there's no color, assign a random color.
					color = getRandomColor();
				}
			}

			return {
				name,
				color,
				value: getFormattedDuration(focusDurationForProject, false),
				percentage,
			};
		});
	};

	const getDataByTags = (allFocusRecordsForInterval, focusDurationForInterval) => {
		const focusRecordsGroupedByTag = {};

		allFocusRecordsForInterval.forEach((focusRecord) => {
			const { tasks } = focusRecord;

			if (!tasks || tasks.length === 0) {
				addFocusRecordToUnclassified(focusRecord, focusRecordsGroupedByTag);
			} else {
				for (const task of tasks) {
					const { taskId } = task;

					if (!taskId || !tasksById[taskId]) {
						addFocusRecordToUnclassified(task, focusRecordsGroupedByTag);
					} else {
						const { tags } = tasksById[taskId];

						if (!tags || tags.length === 0) {
							addFocusRecordToUnclassified(task, focusRecordsGroupedByTag);
						} else {
							// console.log(tasksById[taskId]);

							for (let tagName of tags) {
								if (!focusRecordsGroupedByTag[tagName]) {
									focusRecordsGroupedByTag[tagName] = [];
								}

								focusRecordsGroupedByTag[tagName].push(task);
							}
						}
					}
				}
			}
		});

		// console.log(focusRecordsGroupedByTag);

		const taskAlreadyAppearedInAnotherTag = {};

		return Object.keys(focusRecordsGroupedByTag).map((tagName) => {
			const focusRecordsArr = focusRecordsGroupedByTag[tagName];
			const filteredFocusRecordsArr =
				tagName === 'UNCLASSIFIED'
					? focusRecordsArr
					: focusRecordsArr.filter((focusRecord) => {
							const { tasks } = focusRecord;
							return focusRecord;
						});
			const focusDurationForTag = getFocusDurationFromArray(focusRecordsArr);
			const totalFocusDuration = getFocusDurationFromArray(allFocusRecordsForInterval);
			const percentage = Number(((focusDurationForTag / focusDurationForInterval) * 100).toFixed(2));

			const isUnclassifiedTag = tagName === 'UNCLASSIFIED';

			let name = 'Unclassified';
			let color = 'green';

			// TODO: The numbers beind the grouped tags seems to be a bit off and don't all add up the final number of focused hours over an interval. Very strange. Look into this later!
			// if (isUnclassifiedTag) {
			// 	console.log('TAGs Focus Records: ');
			// 	console.log(focusRecordsArr);
			// 	console.log('All Fcous Records:');
			// 	console.log(allFocusRecordsForInterval);
			// }

			if (!isUnclassifiedTag) {
				const tag = tagsByRawName[tagName];
				name = tag.name;

				if (tag.color) {
					color = tag.color;
				} else {
					// If there's no color, assign a random color.
					color = getRandomColor();
				}
			}

			return {
				name,
				color,
				value: getFormattedDuration(focusDurationForTag, false),
				percentage,
			};
		});
	};

	const addFocusRecordToUnclassified = (taskFromFocusRecord, focusRecordsGroupedByTag) => {
		// Default it to the "Unclassified" tag if the focus record has no task with a project.
		const UNCLASSIFIED_KEY = 'UNCLASSIFIED';

		// If there are no tasks in the focus records, there is no connected project, so just put it in the "Inbox" project by default.
		if (!focusRecordsGroupedByTag[UNCLASSIFIED_KEY]) {
			focusRecordsGroupedByTag[UNCLASSIFIED_KEY] = [];
		}

		focusRecordsGroupedByTag[UNCLASSIFIED_KEY].push(taskFromFocusRecord);
	};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-full">
			<div className="flex justify-between items-center">
				<h3 className="font-bold text-[16px]">Details</h3>

				<div className="flex items-center gap-4">
					<GeneralSelectButtonAndDropdown
						selected={selected}
						setSelected={setSelected}
						selectedOptions={selectedOptions}
					/>

					<GeneralSelectButtonAndDropdown
						selected={selectedInterval}
						setSelected={setSelectedInterval}
						selectedOptions={selectedIntervalOptions}
						onClick={(name) => {
							if (name?.toLowerCase() !== 'custom') {
								return;
							}

							setIsModalPickDateRangeOpen(true);
						}}
					/>

					<DateRangePicker
						selectedDates={selectedDates}
						setSelectedDates={setSelectedDates}
						selectedInterval={selectedInterval}
						startDate={startDate}
						endDate={endDate}
					/>
				</div>
			</div>

			<div className="flex-1 mt-2 flex items-center gap-10 px-4">
				<div>
					<PieChart width={220} height={220}>
						<Pie
							data={progressBarData}
							cx={100}
							cy={100}
							innerRadius={85}
							outerRadius={100}
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
												{getFormattedDuration(focusDurationForInterval, false)}
											</text>
											<text
												x={cx}
												y={cy + 15}
												fill="#aaa"
												textAnchor="middle"
												dominantBaseline="central"
												className="text-[14px]"
											>
												Focus Duration
											</text>
										</g>
									);
								}}
							/>
							{/* <CustomLabel value="50%" /> */}
						</Pie>
					</PieChart>
				</div>

				<div className="mt-3 flex flex-col gap-2 w-full">
					<ProgressBarList data={progressBarData} />
				</div>
			</div>

			<ModalPickDateRange
				isModalOpen={isModalPickDateRangeOpen}
				setIsModalOpen={setIsModalPickDateRangeOpen}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
			/>
		</div>
	);
};

interface ProgressBarListProps {
	data: Array<any>;
}

const ProgressBarList: React.FC<ProgressBarListProps> = ({ data }) => {
	const dropdownFocusRankingListRef = useRef(null);
	const [isDropdownFocusRankingListVisible, setIsDropdownFocusRankingListVisible] = useState(false);

	const sortedData = data.sort((a, b) => b.percentage - a.percentage);

	return (
		<div className="space-y-4 w-full">
			{sortedData.slice(0, 5).map((item) => (
				<ProgressBar key={item.name} item={item} />
			))}

			<div className="relative">
				<div
					ref={dropdownFocusRankingListRef}
					onClick={() => setIsDropdownFocusRankingListVisible(!isDropdownFocusRankingListVisible)}
					className="text-color-gray-100 cursor-pointer"
				>
					View More
				</div>

				<DropdownFocusRankingList
					toggleRef={dropdownFocusRankingListRef}
					isVisible={isDropdownFocusRankingListVisible}
					setIsVisible={setIsDropdownFocusRankingListVisible}
					progressData={data}
				/>
			</div>
		</div>
	);
};

export default DetailsCard;

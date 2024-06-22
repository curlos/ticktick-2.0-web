import { useState } from 'react';
import { TaskObj } from '../interfaces/interfaces';
import Icon from './Icon';
import TaskList from './TaskList';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { PRIORITIES } from '../utils/priorities.utils';

interface TaskListByGroupProps {
	tasks: Array<TaskObj>;
	selectedFocusRecordTask?: TaskObj;
	setSelectedFocusRecordTask?: React.Dispatch<React.SetStateAction<TaskObj>>;
	selectedPriorities?: Array<Object>;
	handleTaskClick?: () => void;
}

const TaskListByGroup: React.FC<TaskListByGroupProps> = ({
	tasks,
	selectedFocusRecordTask,
	setSelectedFocusRecordTask,
	selectedPriorities,
	handleTaskClick,
	groupBy,
	sortBy,
}) => {
	const categoryIconClass = 'text-color-gray-100 !text-[16px] hover:text-white';
	// Show all the priorities if no specific priorities were listed
	const showAllPriorities =
		!selectedPriorities || Object.values(selectedPriorities).every((priorityChosen) => !priorityChosen);

	if (!tasks || tasks.length === 0) {
		return null;
	}

	console.log(groupBy);
	console.log(sortBy);

	const GroupedByTaskList = ({ categoryName, tasks }) => {
		const [showTasks, setShowTasks] = useState(true);

		if (!tasks || tasks.length === 0) {
			return null;
		}

		// TODO: This does animate it but it keeps opening and closing when I click the DropdownProjects toggler. Disabling this for now to see what I do with it in the future.
		const listVariants = {
			// hidden: { opacity: 0, height: 0 },
			// visible: { opacity: 1, height: 'auto', transition: { duration: 0.1 } },
		};

		return (
			<div>
				<div
					className="flex items-center text-[12px] cursor-pointer mb-2"
					onClick={() => setShowTasks(!showTasks)}
				>
					{showTasks ? (
						<Icon name="expand_more" customClass={categoryIconClass} />
					) : (
						<Icon name="chevron_right" customClass={categoryIconClass} />
					)}
					<span className="mr-[6px] font-bold">{categoryName}</span>
					<span className="text-color-gray-100 font-bold">{tasks.length}</span>{' '}
					{/* Updated to show actual count */}
				</div>

				<AnimatePresence>
					{showTasks && (
						<motion.div initial="hidden" animate="visible" exit="hidden" variants={listVariants}>
							<TaskList
								tasks={tasks}
								selectedFocusRecordTask={selectedFocusRecordTask}
								setSelectedFocusRecordTask={setSelectedFocusRecordTask}
								handleTaskClick={handleTaskClick}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	};

	const GroupedByPriority = () => {
		const { highPriorityTasks, mediumPriorityTasks, lowPriorityTasks, noPriorityTasks, completedTasks } =
			groupTasksByPriority(tasks, selectedPriorities, showAllPriorities);

		return (
			<React.Fragment>
				{showAllPriorities ? (
					<React.Fragment>
						<GroupedByTaskList categoryName="High" tasks={highPriorityTasks} />
						<GroupedByTaskList categoryName="Medium" tasks={mediumPriorityTasks} />
						<GroupedByTaskList categoryName="Low" tasks={lowPriorityTasks} />
						<GroupedByTaskList categoryName="None" tasks={noPriorityTasks} />
					</React.Fragment>
				) : (
					<React.Fragment>
						{selectedPriorities.high && <GroupedByTaskList categoryName="High" tasks={highPriorityTasks} />}
						{selectedPriorities.medium && (
							<GroupedByTaskList categoryName="Medium" tasks={mediumPriorityTasks} />
						)}
						{selectedPriorities.low && <GroupedByTaskList categoryName="Low" tasks={lowPriorityTasks} />}
						{selectedPriorities.none && <GroupedByTaskList categoryName="None" tasks={noPriorityTasks} />}
					</React.Fragment>
				)}
				<GroupedByTaskList
					categoryName="Completed"
					tasks={completedTasks}
					selectedPriorities={selectedPriorities}
				/>
			</React.Fragment>
		);
	};

	const GroupedByTime = () => {
		const groupedTasksByDueDate = groupTasksByDueDate(tasks);

		return (
			<React.Fragment>
				{Object.entries(groupedTasksByDueDate).map(([dueDate, tasksForThisDate]) => {
					console.log(dueDate);

					return <GroupedByTaskList categoryName={dueDate} tasks={tasksForThisDate} />;
				})}
				{/* TODO: This is going to be a list of GroupedLists grouped by time (days) */}
				{/* <GroupedByTaskList categoryName="High" tasks={highPriorityTasks} />
				<GroupedByTaskList categoryName="High" tasks={highPriorityTasks} />
				<GroupedByTaskList categoryName="High" tasks={highPriorityTasks} />
				<GroupedByTaskList categoryName="High" tasks={highPriorityTasks} /> */}
			</React.Fragment>
		);
	};

	const getGroupedByList = () => {
		switch (groupBy) {
			case 'time':
				return <GroupedByTime />;
			default:
				return <GroupedByPriority />;
		}
	};

	return <div className="flex flex-col gap-1">{getGroupedByList()}</div>;
};

const groupTasksByDueDate = (tasks) => {
	// Create an empty object to hold the grouped tasks
	const groupedTasks = {};

	// Iterate through each task in the array
	tasks.forEach((task) => {
		// Ensure the dueDate is available
		if (task.dueDate) {
			// Convert the date to a more readable format if necessary
			const date = new Date(task.dueDate).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});

			// Check if the date already exists in groupedTasks
			if (!groupedTasks[date]) {
				// If it doesn't exist, create a new array
				groupedTasks[date] = [];
			}

			// Add the task to the array for the corresponding date
			groupedTasks[date].push(task);
		} else {
			if (!groupedTasks['No Date']) {
				// If it doesn't exist, create a new array
				groupedTasks['No Date'] = [];
			}

			groupedTasks['No Date'].push(task);
		}
	});

	const sortedKeys = Object.keys(groupedTasks).sort((a, b) => {
		if (a === 'No Date') return 1; // Always put 'No Date' last
		if (b === 'No Date') return -1; // Always put 'No Date' last
		return new Date(a) - new Date(b);
	});

	const sortedGroupedTasks = {};
	sortedKeys.forEach((key) => {
		sortedGroupedTasks[key] = groupedTasks[key];
	});

	return sortedGroupedTasks;
};

const groupTasksByPriority = (tasks, selectedPriorities, showAllPriorities) => {
	return tasks.reduce(
		(acc, task) => {
			if (!task.completedTime) {
				switch (task.priority) {
					case 3:
						acc.highPriorityTasks.push(task);
						break;
					case 2:
						acc.mediumPriorityTasks.push(task);
						break;
					case 1:
						acc.lowPriorityTasks.push(task);
						break;
					default:
						acc.noPriorityTasks.push(task);
						break;
				}
			} else {
				if (selectedPriorities && !showAllPriorities) {
					const key = PRIORITIES[task.priority].name.toLowerCase();
					const priorityIsSelected = selectedPriorities[key];

					if (priorityIsSelected) {
						acc.completedTasks.push(task);
					}
				} else {
					acc.completedTasks.push(task);
				}
			}

			return acc;
		},
		{
			highPriorityTasks: [],
			mediumPriorityTasks: [],
			lowPriorityTasks: [],
			noPriorityTasks: [],
			completedTasks: [],
		}
	);
};

export default TaskListByGroup;

import { useState } from 'react';
import { TaskObj } from '../interfaces/interfaces';
import Icon from './Icon';
import TaskList from './TaskList';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { PRIORITIES } from '../utils/priorities.utils';
import { useGetProjectsQuery } from '../services/resources/projectsApi';

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
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const categoryIconClass = 'text-color-gray-100 !text-[16px] hover:text-white';
	// Show all the priorities if no specific priorities were listed
	const showAllPriorities =
		!selectedPriorities || Object.values(selectedPriorities).every((priorityChosen) => !priorityChosen);

	if (!tasks || tasks.length === 0) {
		return null;
	}

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

	const GroupedByTaskListWrapper = ({ groupBy, groupedTasks }) => {
		return (
			<React.Fragment>
				{Object.entries(groupedTasks).map(([key, tasksList]) => {
					let groupedByKey = key;

					if (groupBy === 'project') {
						const project = projectsById[key];
						groupedByKey = project.name;
					}

					return <GroupedByTaskList key={groupedByKey} categoryName={groupedByKey} tasks={tasksList} />;
				})}
			</React.Fragment>
		);
	};

	const getGroupedByTaskList = () => {
		switch (groupBy) {
			case 'project':
				const groupedTasksByProject = groupTasksByProject(tasks);
				return <GroupedByTaskListWrapper groupBy="project" groupedTasks={groupedTasksByProject} />;
			case 'time':
				const groupedTasksByDueDate = groupTasksByDueDate(tasks);
				return <GroupedByTaskListWrapper groupBy="time" groupedTasks={groupedTasksByDueDate} />;
			case 'tag':
				// TODO: Implement this when tags are set up on the backend and for tasks
				return null;
			case 'priority':
				// TODO: Refactor this to be more dynamic.
				return <GroupedByPriority />;
			default:
				return (
					<TaskList
						tasks={tasks}
						selectedFocusRecordTask={selectedFocusRecordTask}
						setSelectedFocusRecordTask={setSelectedFocusRecordTask}
						handleTaskClick={handleTaskClick}
					/>
				);
		}
	};

	return <div className="flex flex-col gap-1">{getGroupedByTaskList()}</div>;
};

const groupTasksByProject = (tasks, projectsById) => {
	const groupedTasks = {};

	tasks.forEach((task) => {
		const { projectId } = task;

		if (!groupedTasks[projectId]) {
			groupedTasks[projectId] = [];
		}

		groupedTasks[projectId].push(task);
	});

	return groupedTasks;
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

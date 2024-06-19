import { useState } from 'react';
import { TaskObj } from '../interfaces/interfaces';
import Icon from './Icon';
import TaskList from './TaskList';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { PRIORITIES } from '../utils/priorities.utils';

interface TaskListByCategoryProps {
	tasks: Array<TaskObj>;
	selectedFocusRecordTask?: TaskObj;
	setSelectedFocusRecordTask?: React.Dispatch<React.SetStateAction<TaskObj>>;
	selectedPriorities?: Array<Object>;
}

const TaskListByCategory: React.FC<TaskListByCategoryProps> = ({
	tasks,
	selectedFocusRecordTask,
	setSelectedFocusRecordTask,
	selectedPriorities,
}) => {
	const categoryIconClass = 'text-color-gray-100 !text-[16px] hover:text-white';
	// Show all the priorities if no specific priorities were listed
	const showAllPriorities =
		!selectedPriorities || Object.values(selectedPriorities).every((priorityChosen) => !priorityChosen);

	if (!tasks || tasks.length === 0) {
		return null;
	}

	const { highPriorityTasks, mediumPriorityTasks, lowPriorityTasks, noPriorityTasks, completedTasks } = tasks.reduce(
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

	const CategoryTaskList = ({ categoryName, tasks }) => {
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
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-1">
			{showAllPriorities ? (
				<React.Fragment>
					<CategoryTaskList categoryName="High" tasks={highPriorityTasks} />
					<CategoryTaskList categoryName="Medium" tasks={mediumPriorityTasks} />
					<CategoryTaskList categoryName="Low" tasks={lowPriorityTasks} />
					<CategoryTaskList categoryName="None" tasks={noPriorityTasks} />
				</React.Fragment>
			) : (
				<React.Fragment>
					{selectedPriorities.high && <CategoryTaskList categoryName="High" tasks={highPriorityTasks} />}
					{selectedPriorities.medium && (
						<CategoryTaskList categoryName="Medium" tasks={mediumPriorityTasks} />
					)}
					{selectedPriorities.low && <CategoryTaskList categoryName="Low" tasks={lowPriorityTasks} />}
					{selectedPriorities.none && <CategoryTaskList categoryName="None" tasks={noPriorityTasks} />}
				</React.Fragment>
			)}
			<CategoryTaskList categoryName="Completed" tasks={completedTasks} selectedPriorities={selectedPriorities} />
		</div>
	);
};

export default TaskListByCategory;

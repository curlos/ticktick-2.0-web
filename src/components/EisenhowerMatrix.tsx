import { useState, useEffect } from 'react';
import { useGetProjectsQuery, useGetTasksQuery } from '../services/api';
import { getTasksWithNoParent } from '../utils/helpers.utils';
import { SMART_LISTS } from '../utils/smartLists.utils';
import TaskListByCategory from './TaskListByCategory';
import Icon from './Icon';

const EisenhowerMatrix = () => {
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { projects } = fetchedProjects || {};
	const { tasks, tasksById } = fetchedTasks || {};
	const [tasksWithNoParent, setTasksWithNoParent] = useState([]);

	const isLoadingOrErrors = isLoadingTasks || errorTasks || isLoadingProjects || errorProjects;

	useEffect(() => {
		if (!tasks || !projects) {
			return;
		}

		const newTasksWithNoParent = getTasksWithNoParent(tasks, tasksById, null, false);
		setTasksWithNoParent(newTasksWithNoParent);
	}, [fetchedTasks, fetchedProjects]);

	if (isLoadingOrErrors) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-full h-full max-h-screen bg-color-gray-700 p-4 flex flex-col">
			<h1 className="font-medium text-[20px]">Eisenhower Matrix</h1>

			<div className="flex-1 max-h-[90vh] grid grid-cols-2 gap-2">
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
			</div>
		</div>
	);
};

const MatrixSquare = ({ tasksWithNoParent, priority }) => {
	const iconClass = '!text-[20px] p-[3px] rounded hover:bg-color-gray-200';

	return (
		<div className="w-full rounded-lg bg-color-gray-600 p-3 h-full">
			<div className="mb-3 flex justify-between items-center cursor-pointer group">
				<div>Urgent & Important</div>

				{/* <div className="invisible group-hover:visible">
					<Icon name="add" fill={0} customClass={'!text-[20px]'} />
					<Icon name="more_horiz" fill={0} customClass={'!text-[20px] ml-2'} />
				</div> */}

				<div className="text-color-gray-100 space-x-1">
					<Icon name="add" fill={0} customClass={iconClass} />
					<Icon name="more_horiz" fill={0} customClass={iconClass} />
				</div>
			</div>

			<div className="overflow-auto gray-scrollbar max-h-[39vh]">
				<TaskListByCategory
					tasks={tasksWithNoParent.filter((task) => {
						if (task.isDeleted) {
							return false;
						}

						if (task.willNotDo) {
							return false;
						}

						return true;
					})}
				/>
			</div>
		</div>
	);
};

export default EisenhowerMatrix;

import { useState, useEffect } from 'react';
import { useGetProjectsQuery, useGetTasksQuery } from '../services/api';
import { getTasksWithNoParent } from '../utils/helpers.utils';
import { SMART_LISTS } from '../utils/smartLists.utils';

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

			<div className="flex-1 grid grid-cols-2 gap-2">
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
			</div>
		</div>
	);
};

const MatrixSquare = ({ tasksWithNoParent, priority }) => {
	return (
		<div className="w-full rounded-lg bg-color-gray-600 p-3">
			<div>Urgent & Important</div>

			{/* TODO: Map tasks */}
			{/* <div>{tasksWithNoParent}</div> */}
		</div>
	);
};

export default EisenhowerMatrix;

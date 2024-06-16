import { useState, useEffect, useRef } from 'react';
import { useGetMatricesQuery, useGetProjectsQuery, useGetTasksQuery } from '../services/api';
import { getTasksWithNoParent } from '../utils/helpers.utils';
import { SMART_LISTS } from '../utils/smartLists.utils';
import TaskListByCategory from './TaskListByCategory';
import Icon from './Icon';
import DropdownMatrixOptions from './Dropdown/DropdownMatrixOptions';
import { setModalState } from '../slices/modalSlice';
import { useDispatch } from 'react-redux';

const EisenhowerMatrix = () => {
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

	const { data: fetchedMatrices, isLoading: isLoadingMatrices, error: errorMatrices } = useGetMatricesQuery();
	const { matrices } = fetchedMatrices || {};

	const [tasksWithNoParent, setTasksWithNoParent] = useState([]);

	const isLoadingOrErrors =
		isLoadingTasks || isLoadingProjects || isLoadingMatrices || errorTasks || errorProjects || errorMatrices;

	useEffect(() => {
		if (!tasks || !projects || !matrices) {
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
			<h1 className="font-medium text-[20px] mb-4">Eisenhower Matrix</h1>

			<div className="flex-1 max-h-[80vh] grid grid-cols-2 gap-2">
				<MatrixSquare matrix={matrices[0]} tasksWithNoParent={tasksWithNoParent} priority={3} />
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
				<MatrixSquare tasksWithNoParent={tasksWithNoParent} priority={3} />
			</div>
		</div>
	);
};

const MatrixSquare = ({ matrix, tasksWithNoParent, priority }) => {
	const iconClass = '!text-[20px] p-[3px] rounded hover:bg-color-gray-200';

	const dispatch = useDispatch();
	const dropdownMatrixOptionsRef = useRef();
	const [isDropdownMatrixOptionsVisible, setIsDropdownMatrixOptionsVisible] = useState(false);

	return (
		<div className="w-full rounded-lg bg-color-gray-600 p-3 h-full">
			<div className="mb-3 flex justify-between items-center cursor-pointer group">
				<div>Urgent & Important</div>

				{/* <div className="invisible group-hover:visible">
					<Icon name="add" fill={0} customClass={'!text-[20px]'} />
					<Icon name="more_horiz" fill={0} customClass={'!text-[20px] ml-2'} />
				</div> */}

				<div className="text-color-gray-100 flex items-center gap-1">
					<div className="relative">
						<Icon
							name="add"
							fill={0}
							customClass={iconClass}
							onClick={() => {
								dispatch(setModalState({ modalId: 'ModalAddTaskForm', isOpen: true }));
							}}
						/>
					</div>

					<div className="relative">
						<Icon
							toggleRef={dropdownMatrixOptionsRef}
							name="more_horiz"
							fill={0}
							customClass={iconClass}
							onClick={() => setIsDropdownMatrixOptionsVisible(!isDropdownMatrixOptionsVisible)}
						/>

						<DropdownMatrixOptions
							toggleRef={dropdownMatrixOptionsRef}
							isVisible={isDropdownMatrixOptionsVisible}
							setIsVisible={setIsDropdownMatrixOptionsVisible}
							matrix={matrix}
						/>
					</div>
				</div>
			</div>

			<div className="overflow-auto gray-scrollbar max-h-[36vh]">
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

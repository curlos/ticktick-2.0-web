import { useState, useEffect, useRef } from 'react';
import { allExceptOneFalse, getTasksWithNoParent } from '../utils/helpers.utils';
import { SMART_LISTS } from '../utils/smartLists.utils';
import Icon from './Icon';
import DropdownMatrixOptions from './Dropdown/DropdownMatrixOptions';
import { setModalState } from '../slices/modalSlice';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import TaskListByGroup from './TaskListByGroup';
import { useGetTasksQuery } from '../services/resources/tasksApi';
import { useGetProjectsQuery } from '../services/resources/projectsApi';
import { useGetMatricesQuery } from '../services/resources/matrixApi';

const stylingForMatrixHeaders = [
	{
		bgColor: 'bg-red-500',
		textColor: 'text-red-500',
		text: 'I',
	},
	{
		bgColor: 'bg-yellow-500',
		textColor: 'text-yellow-500',
		text: 'II',
	},
	{
		bgColor: 'bg-blue-500',
		textColor: 'text-blue-500',
		text: 'III',
	},
	{
		bgColor: 'bg-emerald-500',
		textColor: 'text-emerald-500',
		text: 'IV',
	},
];

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

	if (isLoadingOrErrors || !matrices) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-full h-full max-h-screen bg-color-gray-700 p-4 flex flex-col">
			<h1 className="font-medium text-[20px] mb-4">Eisenhower Matrix</h1>

			<div className="flex-1 max-h-[80vh] grid grid-cols-2 gap-2">
				<MatrixSquare matrix={matrices[0]} tasksWithNoParent={tasksWithNoParent} />
				<MatrixSquare matrix={matrices[1]} tasksWithNoParent={tasksWithNoParent} />
				<MatrixSquare matrix={matrices[2]} tasksWithNoParent={tasksWithNoParent} />
				<MatrixSquare matrix={matrices[3]} tasksWithNoParent={tasksWithNoParent} />
			</div>
		</div>
	);
};

const MatrixSquare = ({ matrix, tasksWithNoParent }) => {
	const iconClass = '!text-[20px] p-[3px] rounded hover:bg-color-gray-200';

	const dispatch = useDispatch();
	const dropdownMatrixOptionsRef = useRef();
	const [isDropdownMatrixOptionsVisible, setIsDropdownMatrixOptionsVisible] = useState(false);

	const { name, order, selectedPriorities } = matrix;

	const handleTaskClick = () => {
		// TODO: Show side dropdown
	};

	return (
		<div className="w-full rounded-lg bg-color-gray-600 p-3 h-full">
			<div className="mb-3 flex justify-between items-center cursor-pointer group">
				<div className="flex items-center gap-2">
					<div
						className={classNames(
							stylingForMatrixHeaders[order].bgColor,
							'text-color-gray-600 rounded-full w-[20px] h-[20px] text-[12px] font-[600] flex items-center justify-center font-serif'
						)}
					>
						{stylingForMatrixHeaders[order].text}
					</div>
					<div className={classNames(stylingForMatrixHeaders[order].textColor, 'text-[13px] font-[600]')}>
						{name}
					</div>
				</div>

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
								const onlyOnePriorityChecked = allExceptOneFalse(selectedPriorities);
								const priorityKey = onlyOnePriorityChecked;

								const defaultPriority = priorityKey ? priorityKey : 'none';

								dispatch(
									setModalState({
										modalId: 'ModalAddTaskForm',
										isOpen: true,
										props: {
											defaultPriority,
										},
									})
								);
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
				<TaskListByGroup
					tasks={tasksWithNoParent.filter((task) => {
						if (task.isDeleted) {
							return false;
						}

						if (task.willNotDo) {
							return false;
						}

						return true;
					})}
					handleTaskClick={handleTaskClick}
					selectedPriorities={selectedPriorities}
					groupBy={matrix.groupBy}
					sortBy={matrix.sortBy}
				/>
			</div>
		</div>
	);
};

export default EisenhowerMatrix;

import { useEffect, useRef, useState } from 'react';
import Icon from '../../../components/Icon';
import { useCalendarContext } from '../../../contexts/useCalendarContext';
import classNames from 'classnames';
import TaskListByGroup from '../../../components/TaskListByGroup';
import { getTasksWithNoParent } from '../../../utils/helpers.utils';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import { useGetTasksQuery } from '../../../services/resources/tasksApi';

const ArrangeTasksSidebar = () => {
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

	const { setShowArrangeTasksSidebar } = useCalendarContext();

	const iconClassName = 'text-color-gray-50 !text-[18px] cursor-pointer p-1 hover:bg-color-gray-300 rounded';
	const [selectedView, setSelectedView] = useState('Priority');
	const allViews = ['Projects', 'Tags', 'Priority'];
	const containerRef = useRef(null); // Ref for the container to allow relative positioning

	const [tasksWithNoParent, setTasksWithNoParent] = useState([]);

	useEffect(() => {
		if (!tasks || !projects) {
			return;
		}

		const newTasksWithNoParent = getTasksWithNoParent(tasks, tasksById, null, false);
		setTasksWithNoParent(newTasksWithNoParent);
	}, [fetchedTasks, fetchedProjects]);

	const handleTaskClick = () => {
		// TODO:
	};

	return (
		<div className="px-3 py-5">
			<div className="flex items-center justify-between">
				<div>Arrange Tasks</div>
				<div className="flex items-center">
					<Icon
						name="filter_alt"
						fill={0}
						customClass={iconClassName}
						onClick={() => {
							setShowArrangeTasksSidebar(false);
						}}
					/>

					<Icon
						name="close"
						fill={0}
						customClass={iconClassName}
						onClick={() => {
							setShowArrangeTasksSidebar(false);
						}}
					/>
				</div>
			</div>

			<div
				ref={containerRef}
				className="relative grid grid-cols-3 gap-1 items-center border border-color-gray-300 p-1 rounded-md mt-3"
				style={{ position: 'relative' }}
			>
				{allViews.map((view, index) => (
					<div
						key={view}
						className={
							'rounded-md text-center p-[2px] cursor-pointer transition-all duration-300 ease-in-out text-white'
						}
						onClick={() => setSelectedView(view)}
						style={{
							position: 'relative',
							zIndex: 2,
						}}
					>
						{view}
					</div>
				))}

				{/* Background div that moves across the different views to smoothly animate the background color being changed when a new view is selected. */}
				<div
					className="bg-color-gray-300 absolute left-0 top-0 bottom-0 transition-all duration-300 ease-in-out"
					style={{
						width: `${100 / allViews.length}%`,
						//
						transform: `translateX(${allViews.indexOf(selectedView) * 100}%)`,
					}}
				/>
			</div>

			<div className="flex items-center mt-4 cursor-pointer">
				<div className="text-blue-500">All Projects</div>
				<Icon
					name="chevron_right"
					fill={0}
					customClass={classNames(iconClassName, 'mb-[-2px]')}
					onClick={() => {
						setShowArrangeTasksSidebar(false);
					}}
				/>
			</div>

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
				groupBy="priority"
			/>
		</div>
	);
};

export default ArrangeTasksSidebar;

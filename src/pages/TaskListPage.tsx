import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import TaskList from '../components/TaskList';
import { useSelector } from 'react-redux';
import { TaskObj } from '../interfaces/interfaces';
import AddTaskForm from '../components/AddTaskForm';
import TaskListByCategory from '../components/TaskListByGroup';
import { SortableTree } from '../components/SortableTest/SortableTree';
import { fillInChildren, getTasksWithNoParent } from '../utils/helpers.utils';
import { useParams } from 'react-router';
import { SMART_LISTS } from '../utils/smartLists.utils';
import { filterTasksByFilter } from '../utils/filters.util';
import { useGetTasksQuery } from '../services/resources/tasksApi';
import { useGetProjectsQuery } from '../services/resources/projectsApi';
import { useGetTagsQuery } from '../services/resources/tagsApi';
import { useGetFiltersQuery } from '../services/resources/filtersApi';

const TaskListPage = () => {
	const { projectId, tagId, filterId } = useParams();

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsById } = fetchedTags || {};

	// RTK Query - Filters
	const { data: fetchedFilters, isLoading: isLoadingGetFilters, error: errorGetFilters } = useGetFiltersQuery();
	const { filtersById } = fetchedFilters || {};

	// RTK Query - Tasks
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById, tasksWithoutDeletedOrWillNotDo } = fetchedTasks || {};

	const [showAddTaskForm, setShowAddTaskForm] = useState(false);
	const [tasksWithNoParent, setTasksWithNoParent] = useState([]);
	const [title, setTitle] = useState(null);
	const [filterToUse, setFilterToUse] = useState(null);

	const isLoadingOrErrors =
		isLoadingTasks ||
		errorTasks ||
		isLoadingProjects ||
		errorProjects ||
		isLoadingGetTags ||
		errorGetTags ||
		isLoadingGetFilters ||
		errorGetFilters;
	const isSmartListView = SMART_LISTS[projectId];

	useEffect(() => {
		setShowAddTaskForm(false);

		if (isLoadingOrErrors) {
			return;
		}

		const inSmartListView = SMART_LISTS[projectId];

		if (inSmartListView) {
			if (SMART_LISTS[projectId]) {
				setTitle(SMART_LISTS[projectId].name);
			}
		} else {
			const foundProject = projectsById[projectId];

			if (foundProject) {
				setTitle(foundProject.name);
			} else if (tagId) {
				const foundTag = tagsById[tagId];

				if (foundTag) {
					setTitle(foundTag.name);
				}
			} else if (filterId) {
				const foundFilter = filtersById[filterId];

				if (foundFilter) {
					setTitle(foundFilter.name);
					setFilterToUse(foundFilter);
				}
			}

			if (!filterId) {
				setFilterToUse(null);
			}
		}

		if (!tasks) {
			return;
		}

		const newTasksWithNoParent = getTasksWithNoParent(tasks, tasksById, projectId, isSmartListView, tagId);
		setTasksWithNoParent(newTasksWithNoParent);
	}, [isLoadingOrErrors, projectId, tagId, filterId]);

	if (isLoadingOrErrors) {
		return <div>Loading...</div>; // Show loading state
	}

	const tasksToUse = filterTasksByFilter(tasksWithoutDeletedOrWillNotDo, filterToUse);

	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700 border-l border-r border-color-gray-200">
			<div className="p-4 h-full">
				<div className="flex justify-between items-center mb-4">
					<div className="flex gap-1 items-center">
						<Icon name="menu_open" customClass={'text-white !text-[24px]'} />
						{/* TODO: Look into this later. Need to make this an input that is editable by the user. */}
						<h3 className="text-[20px] font-[600] max-w-[500px] truncate">{title}</h3>
					</div>

					<div className="flex items-center gap-2">
						{/* <Icon name="swap_vert" customClass={"text-white !text-[24px]"} /> */}
						{/* <Icon name="more_horiz" customClass={"text-white !text-[24px]"} /> */}
					</div>
				</div>

				{tasksWithNoParent && tasksWithNoParent.length > 0 && (
					<SortableTree
						collapsible
						indicator
						removable
						defaultItems={tasksWithNoParent}
						tasksToUse={tasksToUse}
					/>
				)}

				{/* {tasksWithNoParent?.length > 0 && (
                    <div className="mt-4 space-y-4">
                        <TaskListByGroup tasks={tasksWithNoParent} />
                    </div>
                )} */}

				{!showAddTaskForm && (
					<button className="flex items-center gap-1 my-2" onClick={() => setShowAddTaskForm(true)}>
						<Icon name="add" customClass={'text-blue-500 !text-[20px]'} />
						<span className="text-blue-500">Add Task</span>
					</button>
				)}

				{showAddTaskForm && <AddTaskForm setShowAddTaskForm={setShowAddTaskForm} />}

				<div className="h-[50px]"></div>
			</div>
		</div>
	);
};

export default TaskListPage;

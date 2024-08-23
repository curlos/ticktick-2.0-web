import { useEffect, useState } from 'react';
import TaskListByGroup from '../../../components/TaskListByGroup';
import { getTasksWithNoParent } from '../../../utils/helpers.utils';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import { useGetTasksQuery } from '../../../services/resources/tasksApi';
import useMaxHeight from '../../../hooks/useMaxHeight';
import { useGetTagsQuery } from '../../../services/resources/tagsApi';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import TopHeader from './TopHeader';

const ArrangeTasksSidebar = () => {
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects, inboxProject } = fetchedProjects || {};

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsById, tagsWithNoParent } = fetchedTags || {};

	// Header
	const [headerHeight, setHeaderHeight] = useState(0);
	const maxHeight = useMaxHeight(headerHeight);

	const [selectedView, setSelectedView] = useState({
		name: 'Priority',
		groupBy: 'priority',
	});

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

	// Projects
	const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
	const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);
	const allProject = topListProjects.find((project) => project.urlName === 'all');

	// Tags
	const allTag = { name: 'All' };

	const [selectedProjectsList, setSelectedProjectsList] = useState([allProject]);
	const [selectedTagList, setSelectedTagList] = useState([allTag]);

	const getAllFilters = () => {
		const ifOnlyHasAllProject = selectedProjectsList.length === 1 && selectedProjectsList[0]?.urlName === 'all';
		const ifOnlyHasAllTag =
			selectedTagList.length === 1 &&
			selectedTagList[0].name === 'All' &&
			Object.keys(selectedTagList).length === 1;
		const selectedProjectIds = {};
		const selectedTagIds = {};

		selectedProjectsList.forEach((project) => {
			selectedProjectIds[project._id] = true;
		});

		selectedTagList.forEach((tag) => {
			selectedTagIds[tag._id] = true;
		});

		return {
			ifOnlyHasAllProject,
			ifOnlyHasAllTag,
			selectedProjectIds,
			selectedTagIds,
		};
	};

	return (
		<div>
			<TopHeader
				{...{
					selectedView,
					setHeaderHeight,
					selectedProjectsList,
					selectedTagList,
					setSelectedProjectsList,
					setSelectedTagList,
					setSelectedView,
					tagsWithNoParent,
					projects,
					isLoadingGetProjects,
					isLoadingGetTags,
				}}
			/>

			<div className="px-3 pt-5 overflow-auto max-h-screen gray-scrollbar" style={{ maxHeight }}>
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
					groupBy={selectedView.groupBy}
					showMiniTasks={true}
					fromCalendarPage={true}
					filters={getAllFilters()}
				/>
			</div>
		</div>
	);
};

export default ArrangeTasksSidebar;

import { useCalendarContext } from '../contexts/useCalendarContext';
import { useGetProjectsQuery } from '../services/resources/projectsApi';
import { useGetTagsQuery } from '../services/resources/tagsApi';
import { PRIORITIES } from '../utils/priorities.utils';

const useGetTaskBgColor = () => {
	const { colorsType } = useCalendarContext();

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsById } = fetchedTags || {};

	const getTaskBgColor = (taskToUse) => {
		const defaultColor = '#3b82f6';
		const { projectId, priority, tagIds } = taskToUse || {};

		// Project Color
		const foundProject = projectsById[projectId];
		const projectColor = foundProject?.color;

		// Priority Color
		const priorityData = PRIORITIES[priority];
		const priorityColor = priorityData?.flagColor;
		const noPriorityColor = PRIORITIES[0].flagColor;

		// Tag Color
		const firstTagId = tagIds && tagIds[0];
		const foundTag = tagsById[firstTagId];
		const tagColor = foundTag?.color;

		switch (colorsType) {
			case 'Projects':
				return projectColor || defaultColor;
			case 'Priority':
				return priorityColor || noPriorityColor;
			case 'Tags':
				return tagColor || defaultColor;
			default:
				return defaultColor;
		}
	};

	return getTaskBgColor;
};

export default useGetTaskBgColor;

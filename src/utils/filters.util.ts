import { arrayToObjectByKey } from './helpers.utils';
import { PRIORITIES } from './priorities.utils';

export const filterTasksByFilter = (tasks, filter) => {
	if (!filter) {
		return tasks;
	}

	const { selectedProjectIds, selectedTagIds, selectedPriorities, dateOptions } = filter;

	// Transform selectedProjectIds and selectedTagIds into an object of id's so that it's O(1) time to access.
	const selectedProjectIdsObj = arrayToObjectByKey(selectedProjectIds, null);
	const selectedTagIdsObj = arrayToObjectByKey(selectedTagIds, null);

	return tasks.filter((task) => {
		const { projectId, tagIds, priority, dueDate } = task;

		const taskPriorityName = PRIORITIES[priority].name.toLowerCase();
		const allProjectsSelected = selectedProjectIds.length === 0;
		const allTagsSelected = selectedTagIds.length === 0;
		const allPrioritiesSelected = Object.values(selectedPriorities).every((priority) => !priority);

		const includesProject = allProjectsSelected || selectedProjectIdsObj[projectId];
		const includesAtLeastOneTag = allTagsSelected || tagIds.find((tagId) => selectedTagIdsObj[tagId]);
		const includesPriority = allPrioritiesSelected || selectedPriorities[taskPriorityName];

		// TODO: Seems like I was possibly doing something here?
		// if (task.title === 'Hey bro') {
		// 	debugger;
		// }

		return includesProject && includesAtLeastOneTag && includesPriority;
	});
};

import { getFormattedLongDay, sortArrayByProperty, sortObjectByDateKeys } from './date.utils';
import { filterTasksByFilter } from './filters.util';
import { SMART_LISTS } from './smartLists.utils';

export function millisecondsToHoursAndMinutes(milliseconds: number) {
	// Convert milliseconds to minutes
	const totalMinutes = milliseconds / (1000 * 60);

	// Calculate hours and minutes
	const hours = Math.floor(totalMinutes / 60);
	const minutes = Math.floor(totalMinutes % 60);

	return {
		hours: hours,
		minutes: minutes,
	};
}

export function secondsToHoursAndMinutes(seconds: number) {
	// Convert seconds to minutes
	const totalMinutes = Math.floor(seconds / 60);

	// Calculate hours and minutes
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	return {
		hours: hours,
		minutes: minutes,
	};
}

export function secondsToMinutes(seconds: number) {
	// Convert seconds to total minutes
	const minutes = Math.floor(seconds / 60);

	// Calculate remaining seconds after converting to minutes
	const remainingSeconds = seconds % 60;

	return minutes;
}

/**
 * Transforms an array of objects into an object with keys based on a specified property.
 * @param {Object[]} array - The array of objects to transform.
 * @param {string} keyProperty - The property of the objects to use as keys in the resulting object.
 * @returns {Object} An object with keys derived from each object's specified property and values as the objects themselves.
 */
export function arrayToObjectByKey(array: any[], keyProperty: string) {
	return array.reduce((acc, obj) => {
		// Use the value of the specified property as the key
		const key = keyProperty ? obj[keyProperty] : obj;
		// Assign the entire object as the value for this key
		acc[key] = obj;
		return acc;
	}, {});
}

/**
 * Transforms an array of objects into an object with keys based on a specified property,
 * where each key holds an array of objects that have that key value.
 * @param {Object[]} array - The array of objects to transform.
 * @param {string} keyProperty - The property of the objects to use as keys in the resulting object.
 * @returns {Object} An object with keys derived from each object's specified property and values as arrays of objects.
 */
export function arrayToObjectArrayByKey(array: any[], keyProperty: string) {
	return array.reduce((acc, obj) => {
		const key = obj[keyProperty];
		// Check if the key already exists, append to it, or create a new array with the object
		if (!acc[key]) {
			acc[key] = []; // Initialize the key with an empty array if it doesn't exist
		}
		acc[key].push(obj); // Push the current object into the array corresponding to the key
		return acc;
	}, {});
}

export function debounce(func, wait, immediate = null) {
	var timeout;
	var cancelled = false; // flag to check if the debounce was cancelled

	var debounced = function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate && !cancelled) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};

	debounced.cancel = function () {
		clearTimeout(timeout);
		cancelled = true; // set the flag
	};

	return debounced;
}

export function getDateWithOrdinalAndMonth(date: Date, includeMonth = false) {
	const day = date.getDate();
	let ordinal = 'th';
	if (day % 10 === 1 && day !== 11) {
		ordinal = 'st';
	} else if (day % 10 === 2 && day !== 12) {
		ordinal = 'nd';
	} else if (day % 10 === 3 && day !== 13) {
		ordinal = 'rd';
	}
	const formattedDay = `${day}${ordinal}`;

	if (includeMonth) {
		const month = date.toLocaleString('en-US', { month: 'long' });
		return `${month} ${formattedDay}`;
	}

	return formattedDay;
}

export function formatTimeToHoursMinutesSeconds(seconds: number) {
	// Extract hours
	const hours = Math.floor(seconds / 3600);
	// Extract remaining minutes after converting to hours
	const minutes = Math.floor((seconds % 3600) / 60);
	// Extract remaining seconds after converting to minutes
	const secondsRemaining = seconds % 60;

	return { hours, minutes, seconds: secondsRemaining };
}

export function containsEmoji(text: string) {
	// Emoji regex pattern covering a broad range of Unicode emoji characters
	const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/u;

	// Test the input string against the emoji regex
	return emojiRegex.test(text);
}

export async function fetchData(apiUrl: string) {
	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return await response.json();
	} catch (error) {
		console.error(error);
	}
}

// Utility function to deeply clone an object or array
export function deepClone(data: any): any {
	return JSON.parse(JSON.stringify(data)); // Quick deep cloning using JSON serialization
}

// Function to fill in children for each task
export function fillInChildren(tasks: any[], tasksById): any[] {
	// Helper function to recursively process each task
	function processTask(task: any): any {
		// Replace `children` with an array of their IDs
		if (task.children && task.children.length > 0) {
			task.children = task.children.flatMap((child) => {
				if (!tasksById[child]) {
					return [];
				}

				const clonedChild = processTask(deepClone(tasksById[child]));
				return clonedChild; // Return the ID of the cloned child
			});
		}
		return task; // Return the processed task
	}

	// Create a new array of tasks with processed tasks
	return tasks.flatMap((task) => processTask(deepClone(task)));
}

// TODO: Something to look into?
const changeProjectIdsToMatchParent = (tasks: any[]) => {
	// console.log(tasks);
	// debugger;
};

export function prepareForBulkEdit(tasks: any[]): any[] {
	const formattedTasks = tasks;

	const allFoundTasks = [];

	// Helper function to recursively process each task

	function processTask(task: any, parentProjectId: any): any {
		if (parentProjectId) {
			task.projectId = parentProjectId;
		}

		// Find all the tasks even if they
		allFoundTasks.push(task);
		// Replace `children` with an array of their IDs
		if (task.children && task.children.length > 0) {
			task.children = task.children.map((child) => {
				let clonedChild = processTask(deepClone(child), task.projectId);

				return clonedChild; // Return the ID of the cloned child
			});
		}
		return task; // Return the processed task
	}

	for (let task of formattedTasks) {
		processTask(deepClone(task));
	}

	// After getting all the found tasks even in the children through recursion, go through all the tasks and replace their "children" with string "_ids" since that's how the backend sees it
	const allFoundTasksWithChildIds = allFoundTasks.map((task) => {
		return replaceChildrenWithStringIds(task);
	});

	// TODO: So this does work HOWEVER over the overarching task list - the one without children is not ordered. So anything under the children will naturally be ordered BUT if it's not under "children" and it's for example all the tasks without parents, then they will not stay in the order I put them. It seems I might still need a child_order property or something to take care of this. At least for the tasks without parents. Those are the ones that I see for sure causing trouble right now. The ordered children work though. Or at least seem to work.
	return allFoundTasksWithChildIds;
}

function replaceChildrenWithStringIds(task: any): any {
	// Replace `children` with an array of their IDs
	if (task.children && task.children.length > 0) {
		task.children = task.children.map((childObject) => childObject._id);
	}
	return task; // Return the processed task
}

/**
 * @description Gets the number of all the tasks, including children recursively.
 * @returns {Number}
 */
export const getNumberOfTasks = (tasks, tasksById) => {
	let numberOfTasks = 0;

	const recursivelyFindChildren = (tasks) => {
		for (let task of tasks) {
			numberOfTasks += 1;

			const foundTask = typeof task === 'string' ? tasksById[task] : task;

			if (!foundTask) {
				continue;
			}

			const { children } = foundTask;

			if (children) {
				recursivelyFindChildren(children);
			}
		}
	};

	recursivelyFindChildren(tasks);

	return numberOfTasks;
};

export const getTasksWithNoParent = (tasks, tasksById, projectId, isSmartListView, tagId) => {
	const transformedTasks = fillInChildren(tasks, tasksById);

	// Create a set of task IDs that are children
	const childTaskIds = new Set<string>();

	transformedTasks.forEach((task) => {
		task.children?.forEach((child) => {
			childTaskIds.add(child._id.toString());
		});
	});

	// Filter out tasks that are in the childTaskIds set
	let newTasksWithNoParent = transformedTasks.filter((task) => !childTaskIds.has(task._id.toString()));

	if (projectId) {
		// TODO: Figure out smart list view filtering
		if (isSmartListView) {
			newTasksWithNoParent = SMART_LISTS[projectId].getFilteredTasks(newTasksWithNoParent);
		} else {
			newTasksWithNoParent = newTasksWithNoParent.filter((task) => task.projectId === projectId);
		}
	} else if (tagId) {
		newTasksWithNoParent = newTasksWithNoParent.filter((task) => task.tagIds.includes(tagId));
	}

	return newTasksWithNoParent;
};

export const getTasksWithFilledInChildren = (
	tasks,
	tasksById,
	projectId,
	filterByNoParent,
	tagId,
	filterId,
	filtersById
) => {
	const tasksObjects = tasks.map((task) => {
		// If it's an id such as one coming from "children" array of strings, then we need to find the corresponding task using that id. If not, it can be assumed that it's already an object and thus we can just get the task as is.
		return typeof task === 'string' ? tasksById[task] : task;
	});
	const transformedTasks = fillInChildren(tasksObjects, tasksById);

	// Create a set of task IDs that are children
	const childTaskIds = new Set<string>();

	transformedTasks.forEach((task) => {
		task.children?.forEach((child) => {
			childTaskIds.add(child._id.toString());
		}); // Add child IDs to the set
	});

	let finalTasks = transformedTasks;

	if (filterByNoParent) {
		// Filter out tasks that are in the childTaskIds set
		finalTasks = finalTasks.filter((task) => !childTaskIds.has(task._id.toString()));
	}

	if (projectId) {
		const isSmartListView = SMART_LISTS[projectId];

		if (isSmartListView) {
			finalTasks = SMART_LISTS[projectId].getFilteredTasks(finalTasks);
		} else {
			finalTasks = finalTasks.filter((task) => task.projectId === projectId);
		}
	} else if (tagId) {
		finalTasks = finalTasks.filter((task) => task.tagIds.includes(tagId));
	} else if (filterId) {
		// TODO: Fix filter issue later
		// console.log('BINGAS');
		// console.log(filtersById);
		// console.log(filterId);
		// debugger;
		const foundFilter = filtersById[filterId];
		finalTasks = filterTasksByFilter(finalTasks, foundFilter);
	}

	return finalTasks;
};

export const getObjectOfEachItemsParent = (items) => {
	const itemsParent = {};

	for (let item of items) {
		for (let childId of item.children) {
			itemsParent[childId] = item._id;
		}
	}

	return itemsParent;
};

export const getObjectOfEachFocusRecordsParent = (focusRecords) => {
	const focusRecordsParent = {};

	for (let focusRecord of focusRecords) {
		for (let childId of focusRecord.children) {
			focusRecordsParent[childId] = focusRecord._id;
		}
	}

	return focusRecordsParent;
};

export const isTaskOverdue = (taskDate) => {
	const taskDateObj = new Date(taskDate);
	let today = new Date();

	// TODO: For now, set "today's time to be at the beginning of the day: 0 hours, mins, seconds." Once time is updated on the backend properly, then this can be removed and restored.
	today.setUTCHours(0, 0, 0, 0);

	if (taskDateObj > today) {
		return false;
	}

	return true;
};

/**
 * Sums up a specified property from each object in the array.
 * @param {Object[]} array - The array of objects.
 * @param {string} propertyName - The name of the property to sum.
 * @returns {number} The sum of the specified property from all objects in the array.
 */
export const sumProperty = (array, propertyName) => {
	return array.reduce((acc, obj) => {
		// Check if the property exists and is a number to avoid NaN results
		const value = typeof obj[propertyName] === 'number' ? obj[propertyName] : 0;
		return acc + value;
	}, 0);
};

export const getFormattedDuration = (duration, includeSeconds = true) => {
	if (!duration) {
		return includeSeconds ? '0h0m0s' : '0h0m';
	}

	const { hours, minutes, seconds } = formatTimeToHoursMinutesSeconds(duration);

	const hoursStr = hours !== 0 ? `${hours.toLocaleString()}h` : '';
	const minutesStr = minutes !== 0 ? `${minutes}m` : '';
	const secondsStr = seconds !== 0 && includeSeconds ? `${seconds}s` : '';

	return `${hoursStr}${minutesStr}${secondsStr}`;
};

export const formatSeconds = (seconds: number) => {
	// Calculate the number of minutes and the remaining seconds
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	// Pad with leading zeros if necessary
	const paddedMinutes = minutes.toString().padStart(2, '0');
	const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

	// Return the formatted string
	return `${paddedMinutes}:${paddedSeconds}`;
};

export const allExceptOneFalse = (obj) => {
	let foundTrue = false; // To track if more than one `true` is found
	for (const key in obj) {
		if (obj[key] === true) {
			if (foundTrue) return null; // If this is the second true found
			foundTrue = key; // Mark that we've found true for the exempt key
		}
	}

	if (foundTrue) {
		return foundTrue;
	}

	return null; // If loop completes without returning false, conditions are met
};

export const toTitleCase = (str) => {
	return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
};

export const hexToRGBA = (hex, opacity = '100%') => {
	// Remove the hash at the beginning of the hex code if it's there
	hex = hex.replace('#', '');

	// Parse the hex string into RGB components
	const r = parseInt(hex.substring(0, 2), 16); // Red component
	const g = parseInt(hex.substring(2, 4), 16); // Green component
	const b = parseInt(hex.substring(4, 6), 16); // Blue component

	// Return the RGBA color with specified opacity
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getTotalTaskCountWithChildren = (tasks) => {
	let count = 0; // Initialize counter

	// Recursive function to count tasks
	const countTasks = (taskArray) => {
		for (const task of taskArray) {
			count++; // Count the current task
			if (task.children && task.children.length > 0) {
				countTasks(task.children); // Recurse if there are children
			}
		}
	};

	countTasks(tasks); // Start the recursive count
	return count; // Return the total count
};

export const getMultiSelectFilteredTasks = (tasks, filters) => {
	if (!filters || Object.keys(filters).length === 0) {
		return tasks;
	}

	let filteredTasks = tasks;

	const { ifOnlyHasAllProject, ifOnlyHasAllTag, selectedProjectIds, selectedTagIds } = filters;

	// If we DO NOT only have the All project, then that means that a filter has been selected and thus we must filter out the tasks by that filter.
	if (!ifOnlyHasAllProject) {
		filteredTasks = filteredTasks.filter((task) => {
			// console.log(task.projectId);
			const projectIsInSelectedProjectIds = selectedProjectIds[task.projectId];

			// console.log(projectIsInSelectedProjectIds);

			return projectIsInSelectedProjectIds;
		});
	}

	// TODO: Filter out by tags
	if (!ifOnlyHasAllTag) {
		filteredTasks = filteredTasks.filter((task) => {
			const { tagIds } = task;
			const oneOfTheTagIdsIsSelected = tagIds.find((tagId) => selectedTagIds[tagId]);
			return oneOfTheTagIdsIsSelected;
		});
	}

	return filteredTasks;
};

/**
 * @description For TickTick 1.0 Focus Records
 */
export const getFocusDuration = (focusRecord, groupedBy) => {
	if (groupedBy === 'tasks') {
		const { tasks } = focusRecord;
		let totalDurationSeconds = 0;

		tasks.forEach((task) => {
			const { startTime, endTime } = task;

			// Convert ISO string times to Date objects
			const start = new Date(startTime);
			const end = new Date(endTime);

			// Calculate the total duration in seconds
			const durationSeconds = (end - start) / 1000; // Convert milliseconds to seconds
			totalDurationSeconds += durationSeconds;
		});

		return totalDurationSeconds;
	}

	// If grouped by date

	const { startTime, endTime, pauseDuration } = focusRecord;

	// Convert ISO string times to Date objects
	const start = new Date(startTime);
	const end = new Date(endTime);

	// Calculate the total duration in seconds
	const totalDurationSeconds = (end - start) / 1000; // Convert milliseconds to seconds

	// Subtract the pause duration to get the real focus time
	const realFocusTimeSeconds = totalDurationSeconds - pauseDuration;

	return realFocusTimeSeconds;
};

export const getAllTasksAndItemsTickTickOne = (tasks) => {
	const allTasksAndItems = [];

	for (let task of tasks) {
		const { items } = task;

		allTasksAndItems.push(task);

		for (let item of items) {
			allTasksAndItems.push(item);
		}
	}

	return allTasksAndItems;
};

export const getCompletedTasksGroupedByDate = (tasks) => {
	const completedTasksGroupedByDate = {};

	const storeTaskInCompletedDateKey = (completedTime, task) => {
		const completedTimeDate = new Date(completedTime);
		const completedTimeKey = getFormattedLongDay(completedTimeDate);

		if (!completedTasksGroupedByDate[completedTimeKey]) {
			completedTasksGroupedByDate[completedTimeKey] = [];
		}

		completedTasksGroupedByDate[completedTimeKey].push(task);
	};

	for (let task of tasks) {
		const { completedTime, items } = task;
		const noCompletedTasksOrTaskItems = !completedTime && (!items || items.length === 0);

		if (noCompletedTasksOrTaskItems) {
			continue;
		}

		if (completedTime) {
			storeTaskInCompletedDateKey(completedTime, task, completedTasksGroupedByDate);
		}

		for (let item of items) {
			const { completedTime } = item;

			if (completedTime) {
				storeTaskInCompletedDateKey(completedTime, item, completedTasksGroupedByDate);
			}
		}
	}

	return completedTasksGroupedByDate;
};

/**
 * @description Gets the array of focus records and groups them by a unique date key. Each date key will a value that is the array of sorted focus records in ascending order by start time for the day.
 */
export const getGroupedFocusRecordsByDate = (focusRecords) => {
	const groupedFocusRecordsByDate = {};

	focusRecords.forEach((focusRecord) => {
		const { startTime, endTime, note, tasks } = focusRecord;

		const dayTitle = getFormattedLongDay(new Date(startTime));

		if (!groupedFocusRecordsByDate[dayTitle]) {
			groupedFocusRecordsByDate[dayTitle] = [];
		}

		groupedFocusRecordsByDate[dayTitle].push(focusRecord);
	});

	// Sort all the items by their date key (from oldest to most recent)
	const sortedGroupedFocusDataByDate = groupedFocusRecordsByDate && sortObjectByDateKeys(groupedFocusRecordsByDate);

	const sortedGroupedFocusRecordsAsc = {};

	Object.keys(sortedGroupedFocusDataByDate).forEach((day, index) => {
		const focusRecordsForTheDay = sortedGroupedFocusDataByDate[day];
		const sortedFocusRecordsForTheDay = sortArrayByProperty(focusRecordsForTheDay, 'startTime', 'ascending');
		sortedGroupedFocusRecordsAsc[day] = sortedFocusRecordsForTheDay;
	});

	return sortedGroupedFocusRecordsAsc;
};

/**
 * @description Gets the array of focus records and groups them by a unique taskId. Each taskId will a value that is the array of sorted focus records in ascending order by start time for the day.
 */
export const getGroupedFocusRecordsByTask = (focusRecords, tasksById) => {
	const groupedFocusRecordsByTask = {};

	// Create the groupedByTasks
	focusRecords.forEach((focusRecord) => {
		const { tasks } = focusRecord;

		const focusRecordTasksById = {};

		tasks.forEach((task) => {
			const { taskId } = task;

			const taskAlreadyInFocusRecord = focusRecordTasksById[taskId];

			// If the task in the list of "tasks" has already appeared in one of the earlier tasks in the focus record, then we don't we need to re-add it, as we've already the whole focus record and ALL of it's tasks. So, if we pushed a second focus record here when it's grouped by task, it would duplicate the focus record and show it a 2nd, 3rd, 4th, etc. time. This is only important for tasks of the same id as if the taskId has not already appeared before, then the focus record should appear a second time but in the different task.
			if (!taskAlreadyInFocusRecord && taskId) {
				if (!groupedFocusRecordsByTask[taskId]) {
					groupedFocusRecordsByTask[taskId] = [];
				}

				const focusRecordWithOnlyTasksOfThatTaskId = {
					...focusRecord,
					tasks: tasks.filter((task) => task.taskId === taskId),
				};

				groupedFocusRecordsByTask[taskId].push(focusRecordWithOnlyTasksOfThatTaskId);
				focusRecordTasksById[taskId] = true;
			}
		});
	});

	// Go through all the groupedByTasks and the focus records and inside the focus records, filter out any tasks that do not have the same "taskId" as the key.
	// This can't be done in the previous forEach loop because I need to know which tasks are CONNECTED to which focus records which can only truly be seen by having them all in the array first.
	Object.keys(groupedFocusRecordsByTask).forEach((taskId) => {
		const focusRecords = groupedFocusRecordsByTask[taskId];

		groupedFocusRecordsByTask[taskId] = focusRecords.map((focusRecord) => {
			const { tasks } = focusRecord;

			return {
				...focusRecord,
				// tasks: tasks.filter((task) => task.taskId === taskId),
			};
		});
	});

	const sortedGroupedFocusRecordsAsc = {};

	Object.keys(groupedFocusRecordsByTask).forEach((taskId, index) => {
		const focusRecordsForTheTask = groupedFocusRecordsByTask[taskId];
		const sortedFocusRecordsForTheTask = sortArrayByProperty(focusRecordsForTheTask, 'startTime', 'ascending');
		sortedGroupedFocusRecordsAsc[taskId] = sortedFocusRecordsForTheTask;
	});

	return sortedGroupedFocusRecordsAsc;
};

export const getFocusDurationFromArray = (focusRecords) => {
	let totalFocusDuration = 0;

	focusRecords.forEach((focusRecord) => {
		totalFocusDuration += getFocusDuration(focusRecord);
	});

	return totalFocusDuration;
};

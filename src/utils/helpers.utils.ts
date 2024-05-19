import { useParams } from "react-router-dom";
import { SMART_LISTS } from "./smartLists.utils";

export function millisecondsToHoursAndMinutes(milliseconds: number) {
    // Convert milliseconds to minutes
    const totalMinutes = milliseconds / (1000 * 60);

    // Calculate hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return {
        hours: hours,
        minutes: minutes
    };
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
        const key = obj[keyProperty];
        // Assign the entire object as the value for this key
        acc[key] = obj;
        return acc;
    }, {});
}

export function areDatesEqual(date1: Date | null, date2: Date | null) {
    if (!date1 || !date2) {
        return false;
    }

    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

export function debounce(func, wait, immediate = null) {
    var timeout;
    var cancelled = false; // flag to check if the debounce was cancelled

    var debounced = function () {
        var context = this, args = arguments;
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

export function formatTimeToHoursAndMinutes(ms: number) {
    // Convert milliseconds to total minutes
    const totalMinutes = ms / (1000 * 60);
    // Extract hours
    const hours = Math.floor(totalMinutes / 60);
    // Extract remaining minutes after converting to hours
    const minutes = Math.floor(totalMinutes % 60);

    return { hours, minutes };
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
};


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
            task.children = task.children.flatMap(child => {
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
    return tasks.flatMap(task => processTask(deepClone(task)));
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
            task.children = task.children.map(child => {
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
        task.children = task.children.map(childObject => childObject._id);
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

export const getTasksWithNoParent = (tasks, tasksById, projectId, isSmartListView) => {
    const transformedTasks = fillInChildren(tasks, tasksById);

    // TODO: Bring this stuff below back once I figure out the problem with the "children"
    // Create a set of task IDs that are children
    const childTaskIds = new Set<string>();

    transformedTasks.forEach(task => {
        task.children?.forEach(child => {
            childTaskIds.add(child._id.toString());
        }); // Add child IDs to the set
    });

    // Filter out tasks that are in the childTaskIds set
    let newTasksWithNoParent = transformedTasks.filter(task => !childTaskIds.has(task._id.toString()));
    // TODO: Figure out smart lsit view filtering
    if (isSmartListView) {
        newTasksWithNoParent = newTasksWithNoParent.filter(SMART_LISTS[projectId].filterTasks());
    } else {
        newTasksWithNoParent = newTasksWithNoParent.filter((task) => task.projectId === projectId);
        // debugger;
    }

    // console.log('CHECKING');
    // console.log(transformedTasks.filter((task) => task.projectId === projectId));

    return newTasksWithNoParent;
};

export const getObjectOfEachTasksParent = (tasks) => {
    const tasksParent = {};

    for (let task of tasks) {
        for (let childId of task.children) {
            tasksParent[childId] = task._id;
        }
    }

    return tasksParent;
};
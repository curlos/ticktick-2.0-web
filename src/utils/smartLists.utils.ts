import { TaskObj } from "../interfaces/interfaces";

export const SMART_LISTS = {
    "all": {
        name: "All",
        urlName: "all",
        iconName: "stacks",
        route: "/projects/all/tasks",
        getFilteredTasks: (allTasks: Array<TaskObj>) => allTasks.filter((task) => !task.isDeleted),
        getDefaultDueDate: () => {
            return null;
        }
    },
    "today": {
        name: "Today",
        urlName: "today",
        iconName: "calendar_today",
        route: "/projects/today/tasks",
        getFilteredTasks: (tasks: Array<TaskObj>) => {
            return tasks.filter((task) => {
                if (task.isDeleted) return false;

                const { dueDate } = task;

                if (isTodayUTC(dueDate)) {
                    return true;
                }

                return false;
            });
        },
        getDefaultDueDate: () => {
            return new Date();
        }
    },
    "tomorrow": {
        name: "Tomorrow",
        urlName: "tomorrow",
        iconName: "upcoming",
        route: "/projects/tomorrow/tasks",
        getFilteredTasks: (tasks: Array<TaskObj>) => {
            return tasks.filter((task) => {
                if (task.isDeleted) return false;

                const { dueDate } = task;

                if (isTomorrowUTC(dueDate)) {
                    return true;
                }

                return false;
            });
        },
        getDefaultDueDate: () => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setUTCDate(today.getUTCDate() + 1); // Increment the day by 1

            return tomorrow;
        }
    },
    "week": {
        name: "Next 7 Days",
        urlName: "week",
        iconName: "event_upcoming",
        route: "/projects/week/tasks",
        getFilteredTasks: (tasks: Array<TaskObj>) => {
            return tasks.filter((task) => {
                if (task.isDeleted) return false;

                const { dueDate } = task;

                if (isWithinNext7DaysUTC(dueDate)) {
                    return true;
                }

                return false;
            });
        },
        getDefaultDueDate: () => {
            const today = new Date();
            const week = new Date();
            week.setUTCDate(today.getUTCDate() + 7); // Increment the day by 7

            return week;
        }
    },
    // {
    //     name: "Inbox",
    //     iconName: "mail",
    //     route: "/projects/inbox/tasks",
    //     numberOfTasks: 26
    // }
    "completed": {
        name: "Completed",
        urlName: "completed",
        iconName: "check_box",
        route: "/projects/completed/tasks",
        getFilteredTasks: (allTasks: Array<TaskObj>) => allTasks.filter((task) => task.completedTime),
        getDefaultDueDate: () => {
            return null;
        }
    },
    "trash": {
        name: "Trash",
        urlName: "trash",
        iconName: "delete",
        route: "/projects/trash/tasks",
        getFilteredTasks: (allTasks: Array<TaskObj>) => allTasks.filter((task) => task.isDeleted),
        getDefaultDueDate: () => {
            return null;
        }
    }
};

const isTodayUTC = (date) => {
    const today = new Date();
    const inputDate = new Date(date);

    // Convert both dates to UTC date strings and compare
    const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const inputDateUTC = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    return todayUTC === inputDateUTC;
};

const isTomorrowUTC = (date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setUTCDate(today.getUTCDate() + 1); // Increment the day by 1

    const inputDate = new Date(date);
    const tomorrowUTC = Date.UTC(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const inputDateUTC = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    return tomorrowUTC === inputDateUTC;
};

const isWithinNext7DaysUTC = (date) => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setUTCDate(today.getUTCDate() + 7); // Set to 7 days from today

    const inputDate = new Date(date);
    const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const nextWeekUTC = Date.UTC(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate());
    const inputDateUTC = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    return inputDateUTC > todayUTC && inputDateUTC <= nextWeekUTC;
};
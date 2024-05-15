import { TaskObj } from "../interfaces/interfaces";

export const SMART_LISTS = {
    "all": {
        name: "All",
        iconName: "mail",
        route: "/projects/all/tasks",
        getTasks: (allTasks: Array<TaskObj>) => allTasks,
        // Returns all tasks
        filterTasks: () => (task: TaskObj) => task
    },
    // {
    //     name: "Today",
    //     iconName: "mail",
    //     route: "/projects/today/tasks",
    //     numberOfTasks: 2
    // },
    // {
    //     name: "Tomorrow",
    //     iconName: "mail",
    //     route: "/projects/tomorrow/tasks",
    //     numberOfTasks: 1
    // },
    // {
    //     name: "Next 7 Days",
    //     iconName: "mail",
    //     route: "/projects/week/tasks",
    //     numberOfTasks: 3
    // },
    // {
    //     name: "Inbox",
    //     iconName: "mail",
    //     route: "/projects/inbox/tasks",
    //     numberOfTasks: 26
    // }
};
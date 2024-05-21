export interface TaskObj {
    _id: string,
    projectId: string,
    title: string,
    completed: boolean,
    children: Array<string>,
    parentId?: string,
    completedPomodoros: number,
    timeTaken: number,
    estimatedDuration: number;
    deadline?: string;
    description?: string;
}

export interface Tasks {
    [key: string]: TaskObj;
}

export interface DropdownProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    toggleRef: React.MutableRefObject<null>;
    customClasses: string;
    customStyling: Object;
}

export interface IProject extends Document {
    _id: string;
    name: string;
    color?: string;
    sortOrder: number;
    sortOption: {
        groupBy: string;
        orderBy: string;
    };
    sortType: string;
    groupId: string | null;
    isFolder: boolean;
    tasks: string[]; // New field for associated tasks
}

export interface IProjectGroup extends Document {
    name: string;
    sortOrder: number;
    sortOption: {
        groupBy: string;
        orderBy: string;
    };
    sortType: string;
    projects: string[];
}
export interface TaskObj {
    _id: string,
    title: string,
    completed: boolean,
    directSubtasks: Array<string>,
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
}
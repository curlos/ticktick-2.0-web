import { useState } from "react";
import Icon from "./Icon";
import { TaskObj } from "../interfaces/interfaces";
import Task from "./Task";

interface TaskListProps {
    tasks: Array<TaskObj>;
    selectedFocusRecordTask?: TaskObj;
    setSelectedFocusRecordTask?: React.Dispatch<React.SetStateAction<TaskObj>>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, selectedFocusRecordTask, setSelectedFocusRecordTask }) => {
    return (
        <div>
            {Object.values(tasks).map((task) => {
                return (
                    !task.parentId && <Task key={task._id} tasks={tasks} taskId={task._id} selectedFocusRecordTask={selectedFocusRecordTask} setSelectedFocusRecordTask={setSelectedFocusRecordTask} />
                );
            })}
        </div>
    );
};

export default TaskList;
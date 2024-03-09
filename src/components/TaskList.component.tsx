import { useState } from "react";
import Icon from "../components/Icon.component";
import { TaskObj } from "../types/types";
import Task from "./Task.component";

interface TaskListProps {
    tasks: Array<TaskObj>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {

    return (
        <div>
            {Object.values(tasks).map((task) => {
                return (
                    !task.parentId && <Task key={task._id} tasks={tasks} taskId={task._id} />
                );
            })}
        </div>
    );
};

export default TaskList;
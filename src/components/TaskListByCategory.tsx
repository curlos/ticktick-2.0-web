import { useState } from "react";
import { TaskObj } from "../types/types";
import Icon from "./Icon";
import TaskList from "./TaskList";

interface TaskListByCategoryProps {
    tasks: Array<TaskObj>;
    selectedFocusRecordTask?: TaskObj;
    setSelectedFocusRecordTask?: React.Dispatch<React.SetStateAction<TaskObj>>;
}

const TaskListByCategory: React.FC<TaskListByCategoryProps> = ({ tasks, selectedFocusRecordTask, setSelectedFocusRecordTask }) => {
    const [category, setCategory] = useState('high');
    const [showTasks, setShowTasks] = useState(true);
    const categoryIconClass = "text-color-gray-100 !text-[16px] hover:text-white";

    return (
        <div>
            {category && (
                <div className="flex items-center text-[12px] cursor-pointer mb-2" onClick={() => setShowTasks(!showTasks)}>
                    {showTasks ? (
                        <Icon name="expand_more" customClass={categoryIconClass} />
                    ) : (
                        <Icon name="chevron_right" customClass={categoryIconClass} />
                    )}

                    <span className="mr-[6px]">High</span>
                    <span className="text-color-gray-100">3</span>
                </div>
            )}

            {showTasks && <TaskList tasks={tasks} selectedFocusRecordTask={selectedFocusRecordTask} setSelectedFocusRecordTask={setSelectedFocusRecordTask} />}
        </div>
    );
};

export default TaskListByCategory;
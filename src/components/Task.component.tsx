import { useState } from "react";
import Icon from "./Icon.component";
import { TaskObj } from "../types/types";
import { millisecondsToHoursAndMinutes } from "../utils/helpers.utils";

interface TaskProps {
    tasks: Array<TaskObj>;
    taskId: string;
}

const Task: React.FC<TaskProps> = ({ tasks, taskId }) => {
    const { _id, title, directSubtasks, parentId, completedPomodoros, timeTaken, estimatedDuration, deadline } = tasks[taskId];

    const [completed, setCompleted] = useState(false);
    const [showSubtasks, setShowSubtasks] = useState(true);
    const formattedTimeTaken = millisecondsToHoursAndMinutes(timeTaken);
    const formattedEstimatedDuration = millisecondsToHoursAndMinutes(estimatedDuration);
    const categoryIconClass = 'text-color-gray-100 !text-[16px] hover:text-white' + (directSubtasks?.length >= 1 ? '' : ' invisible');

    return (
        <div className={`${!parentId ? 'py-3' : 'pt-3 pl-6'}`}>
            <div className="flex items-center gap-1">
                <div className="flex items-center cursor-pointer" onClick={() => setShowSubtasks(!showSubtasks)}>
                    {showSubtasks ? (
                        <Icon name="expand_more" customClass={categoryIconClass} />
                    ) : (
                        <Icon name="chevron_right" customClass={categoryIconClass} />
                    )}
                </div>

                <div className="flex items-center gap-1 cursor-pointer">
                    {!completed ? (
                        <Icon name="check_box_outline_blank" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-p"} />
                    ) : (
                        <Icon name="check_box" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-p"} />
                    )}

                    {title}
                </div>
            </div>

            {showSubtasks && directSubtasks.map((subtaskId: string) => (
                <Task key={subtaskId} tasks={tasks} taskId={subtaskId} />
            ))}
        </div>
    );
};

export default Task;
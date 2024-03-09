import { useState } from "react";
import Icon from "./Icon.component";
import { TaskObj } from "../types/types";
import { millisecondsToHoursAndMinutes } from "../utils/helpers.utils";
import { useNavigate } from "react-router-dom";

interface TaskProps {
    tasks: Array<TaskObj>;
    taskId: string;
    fromTaskDetails: boolean;
}

const Task: React.FC<TaskProps> = ({ tasks, taskId, fromTaskDetails }) => {
    let navigate = useNavigate();

    const { _id, title, directSubtasks, parentId, completedPomodoros, timeTaken, estimatedDuration, deadline } = tasks[taskId];

    const [completed, setCompleted] = useState(false);
    const [showSubtasks, setShowSubtasks] = useState(true);
    const formattedTimeTaken = millisecondsToHoursAndMinutes(timeTaken);
    const formattedEstimatedDuration = millisecondsToHoursAndMinutes(estimatedDuration);
    const categoryIconClass = ' text-color-gray-100 !text-[16px] hover:text-white' + (directSubtasks?.length >= 1 ? '' : ' invisible');

    return (
        <div className={`${(!parentId || fromTaskDetails) ? 'py-2' : 'pt-2 pl-6'}`}>
            <div className="flex items-center gap-1">
                {!fromTaskDetails && (
                    <div className="flex items-center cursor-pointer" onClick={() => setShowSubtasks(!showSubtasks)}>
                        {showSubtasks ? (
                            <Icon name="expand_more" customClass={categoryIconClass} />
                        ) : (
                            <Icon name="chevron_right" customClass={categoryIconClass} />
                        )}
                    </div>
                )}

                <div className="flex gap-1 cursor-pointer">
                    {!completed ? (
                        <Icon name="check_box_outline_blank" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-p"} />
                    ) : (
                        <Icon name="check_box" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-p"} />
                    )}

                    <div onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tasks/${_id}`);
                    }}>
                        {title}
                    </div>
                </div>
            </div>

            {showSubtasks && !fromTaskDetails && (
                <div className="flex flex-col mt-1">
                    {directSubtasks.map((subtaskId: string) => (
                        <Task key={subtaskId} tasks={tasks} taskId={subtaskId} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Task;
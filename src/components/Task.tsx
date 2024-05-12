import { useState } from "react";
import Icon from "./Icon";
import { TaskObj } from "../interfaces/interfaces";
import { millisecondsToHoursAndMinutes } from "../utils/helpers.utils";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTasksQuery } from "../services/api";

interface TaskProps {
    taskId: string;
    fromTaskDetails?: boolean;
    selectedFocusRecordTask?: TaskObj;
    setSelectedFocusRecordTask?: React.Dispatch<React.SetStateAction<TaskObj>>;
    fromParent?: boolean;
}

const Task: React.FC<TaskProps> = ({ taskId, fromTaskDetails, selectedFocusRecordTask, setSelectedFocusRecordTask, fromParent }) => {
    const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
    const { tasksById } = fetchedTasks || {};
    let navigate = useNavigate();
    let { taskId: taskIdFromUrl } = useParams();
    const [completed, setCompleted] = useState(false);
    const [showSubtasks, setShowSubtasks] = useState(true);

    let task = typeof taskId == 'string' ? tasksById[taskId] : taskId;

    if (!task) {
        return null;
    }

    const { _id, projectId, title, children, completedPomodoros, timeTaken, estimatedDuration, deadline } = task;


    const formattedTimeTaken = millisecondsToHoursAndMinutes(timeTaken);
    const formattedEstimatedDuration = millisecondsToHoursAndMinutes(estimatedDuration);
    const categoryIconClass = ' text-color-gray-100 !text-[16px] hover:text-white' + (children?.length >= 1 ? '' : ' invisible');

    return (
        <div className={`${(!fromParent || fromTaskDetails) ? 'ml-0' : 'ml-4'}`}>
            <div
                className={`flex p-2 hover:bg-color-gray-600 cursor-pointer rounded-lg` + (taskIdFromUrl == taskId ? ' bg-color-gray-300' : '')}
                onClick={(e) => {
                    if (setSelectedFocusRecordTask) {
                        setSelectedFocusRecordTask(task);
                    } else {
                        // TODO: Add logic for smart list
                        navigate(`/projects/${projectId}/tasks/${_id}`);
                    }
                }}
            >
                {!fromTaskDetails && (
                    <div className="flex mt-[2px] cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        setShowSubtasks(!showSubtasks);
                    }}>
                        {showSubtasks ? (
                            <Icon name="expand_more" customClass={categoryIconClass} />
                        ) : (
                            <Icon name="chevron_right" customClass={categoryIconClass} />
                        )}
                    </div>
                )}

                <div className="flex gap-1 cursor-pointer">
                    {!setSelectedFocusRecordTask ? (
                        <div className="h-[20px]" onClick={(e) => {
                            e.stopPropagation();
                            setCompleted(!completed);
                        }}>
                            {!completed ? (
                                children && children.length >= 1 ? (
                                    <Icon name="list_alt" fill={0} customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                                ) : (
                                    <Icon name="check_box_outline_blank" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                                )
                            ) : (
                                <Icon name="check_box" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                            )}
                        </div>
                    ) : (
                        <div className="h-[20px]">
                            {selectedFocusRecordTask && selectedFocusRecordTask._id === _id ? (
                                <Icon name="radio_button_checked" fill={0} customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                            ) : (
                                <Icon name="radio_button_unchecked" fill={0} customClass={"text-color-gray-100 text-red-500 !text-[18px] hover:text-white cursor-pointer"} />
                            )}
                        </div>
                    )}

                    <div className={'break-all' + (completed ? ' line-through text-color-gray-100' : '')}>
                        {title}
                    </div>
                </div>
            </div>

            {showSubtasks && !fromTaskDetails && (
                <div className="flex flex-col mt-1">
                    {children && children.map((subtaskId: string) => (
                        <Task key={subtaskId} taskId={subtaskId} selectedFocusRecordTask={selectedFocusRecordTask} setSelectedFocusRecordTask={setSelectedFocusRecordTask} fromParent={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Task;
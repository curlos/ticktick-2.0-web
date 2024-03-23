import { useEffect, useState } from "react";
import Icon from "./Icon.component";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { TaskObj } from "../types/types";
import Task from "./Task.component";
import TooltipCalendar from "./tooltips/TooltipCalendar";

const EmptyTask = () => (
    <div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700 flex justify-center items-center text-[18px] text-color-gray-100">
        <div className="text-center space-y-5">
            <Icon name="ads_click" customClass={"text-color-gray-100 text-blue-500 !text-[50px] hover:text-white cursor-p"} />
            <div>Click task title to view the details</div>
        </div>
    </div>
);

const TaskDetailsPage = () => {
    const allTasks = useSelector((state) => state.tasks.tasks);
    const [currTitle, setCurrTitle] = useState('');
    const [currDescription, setCurrDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [task, setTask] = useState<TaskObj>();
    const [parentTask, setParentTask] = useState<TaskObj | null>();
    const [dueDate, setDueDate] = useState(null);
    const [isTooltipCalendarVisible, setIsTooltipCalendarVisible] = useState(true);

    let { taskId } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        const currTask = taskId && allTasks && allTasks[taskId];
        setTask(currTask);

        if (currTask) {
            setCurrTitle(currTask.title);

            if (currTask.parentId && allTasks[currTask.parentId]) {
                setParentTask(allTasks[currTask.parentId]);
            } else {
                setParentTask(null);
            }
        }
    }, [taskId]);

    if (!task) {
        return <EmptyTask />;
    }

    const { _id, directSubtasks, completedPomodoros, timeTaken, estimatedDuration, deadline } = task;

    return (
        <div className="flex flex-col w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-color-gray-200">
                <div className="flex items-center gap-2">
                    {!completed ? (
                        directSubtasks.length >= 1 ? (
                            <Icon name="list_alt" fill={0} customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-p"} />
                        ) : (
                            <Icon name="check_box_outline_blank" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-p"} />
                        )
                    ) : (
                        <Icon name="check_box" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-p"} />
                    )}

                    <div
                        className="flex items-center gap-1 border-l border-color-gray-200 text-color-gray-100 px-2 cursor-pointer" onClick={() => setIsTooltipCalendarVisible(!isTooltipCalendarVisible)}>
                        <Icon name="calendar_month" customClass={"!text-[20px] hover:text-white cursor-p"} />
                        Due Date
                    </div>
                    <TooltipCalendar isVisible={isTooltipCalendarVisible} setIsVisible={setIsTooltipCalendarVisible} dueDate={dueDate} setDueDate={setDueDate} customClasses=" ml-[-100px] mt-[15px]" />
                </div>

                <Icon name="flag" customClass={"text-color-gray-100 text-red-500 !text-[22px] hover:text-white cursor-p"} />
            </div>

            <div className="p-4 flex flex-col justify-between">
                {parentTask && (
                    <div className="w-full flex justify-between items-center text-color-gray-100 cursor-pointer" onClick={() => navigate(`/tasks/${parentTask._id}`)}>
                        <div className="max-w-[368px]">
                            <div className="truncate text-[12px]">{parentTask.title}</div>
                        </div>
                        <Icon name="chevron_right" customClass={'text-color-gray-100 !text-[16px] hover:text-white'} />
                    </div>
                )}

                <TextareaAutosize className="text-[16px] placeholder:text-[#7C7C7C] font-bold mb-0 bg-transparent w-full outline-none resize-none" placeholder="What would you like to do?" value={currTitle} onChange={(e) => setCurrTitle(e.target.value)}></TextareaAutosize>
                <TextareaAutosize className="text-[14px] placeholder:text-[#7C7C7C] mt-2 mb-4 bg-transparent w-full outline-none resize-none" placeholder="Description" value={currDescription} onChange={(e) => setCurrDescription(e.target.value)}></TextareaAutosize>

                {/* <hr className="border-color-gray-200 mt-2 mb-3" /> */}

                {directSubtasks.map((subtaskId: string) => (
                    <Task key={subtaskId} tasks={allTasks} taskId={subtaskId} fromTaskDetails={true} />
                ))}

                {directSubtasks && directSubtasks.length > 1 && (
                    <div className="text-blue-500 flex items-center gap-1 cursor-pointer mt-1">
                        <Icon name="add" customClass={"text-color-gray-100 text-blue-500 !text-[22px] hover:text-white cursor-p"} />
                        Add Subtask
                    </div>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-end text-color-gray-100">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <Icon name="drive_file_move" customClass={"text-color-gray-100 !text-[18px] hover:text-white cursor-p"} />
                        Hello Mobile
                    </div>

                    <div className="flex items-center gap-2">
                        <Icon name="edit_note" customClass={"text-color-gray-100 !text-[18px] hover:text-white cursor-p"} fill={0} />
                        <Icon name="comment" customClass={"text-color-gray-100 !text-[18px] hover:text-white cursor-p"} fill={0} />
                        <Icon name="more_horiz" customClass={"text-color-gray-100 !text-[18px] hover:text-white cursor-p"} fill={0} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsPage;
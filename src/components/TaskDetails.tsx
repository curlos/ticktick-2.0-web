import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { TaskObj } from "../types/types";
import Task from "./Task";
import DropdownCalendar from "./Dropdown/DropdownCalendar";
import AddTaskForm from "./AddTaskForm";

const EmptyTask = () => (
    <div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700 flex justify-center items-center text-[18px] text-color-gray-100">
        <div className="text-center space-y-5">
            <Icon name="ads_click" customClass={"text-color-gray-100 text-blue-500 !text-[50px] hover:text-white cursor-pointer"} />
            <div>Click task title to view the details</div>
        </div>
    </div>
);

const TaskDetails = () => {
    const allTasks = useSelector((state) => state.tasks.tasks);
    const [currTitle, setCurrTitle] = useState('');
    const [currDescription, setCurrDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [task, setTask] = useState<TaskObj>();
    const [parentTask, setParentTask] = useState<TaskObj | null>();
    const [dueDate, setDueDate] = useState(null);
    const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [showAddCommentInput, setShowAddCommentInput] = useState(false);
    const [currentComment, setCurrentComment] = useState('');
    const [comments, setComments] = useState([
        {
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        },
        {
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        },
        {
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        },
        {
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        },
        {
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        }
    ]);

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
    }, [taskId, allTasks]);

    if (!task) {
        return <EmptyTask />;
    }

    const { _id, directSubtasks, completedPomodoros, timeTaken, estimatedDuration, deadline } = task;

    return (
        <div className="flex flex-col w-full h-full max-h-screen bg-color-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-color-gray-200">
                <div className="flex items-center gap-2">
                    {!completed ? (
                        directSubtasks.length >= 1 ? (
                            <Icon name="list_alt" fill={0} customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                        ) : (
                            <Icon name="check_box_outline_blank" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                        )
                    ) : (
                        <Icon name="check_box" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                    )}

                    <div
                        className="flex items-center gap-1 border-l border-color-gray-200 text-color-gray-100 px-2 cursor-pointer" onClick={() => setIsDropdownCalendarVisible(!isDropdownCalendarVisible)}>
                        <Icon name="calendar_month" customClass={"!text-[20px] hover:text-white cursor-pointer"} />
                        Due Date
                    </div>
                    <DropdownCalendar isVisible={isDropdownCalendarVisible} setIsVisible={setIsDropdownCalendarVisible} dueDate={dueDate} setDueDate={setDueDate} customClasses=" ml-[-100px] mt-[15px]" />
                </div>

                <Icon name="flag" customClass={"text-color-gray-100 text-red-500 !text-[22px] hover:text-white cursor-pointer"} />
            </div>

            <div className="flex-1 overflow-auto no-scrollbar">
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

                    {directSubtasks.map((subtaskId: string) => (
                        <Task key={subtaskId} tasks={allTasks} taskId={subtaskId} fromTaskDetails={true} />
                    ))}

                    {directSubtasks && directSubtasks.length > 1 && (
                        <div>
                            {!showAddTaskForm && (
                                <button className="flex items-center gap-1 my-2" onClick={() => setShowAddTaskForm(true)}>
                                    <Icon name="add" customClass={"text-blue-500 !text-[20px]"} />
                                    <span className="text-blue-500">Add Subtask</span>
                                </button>
                            )}

                            {showAddTaskForm && <AddTaskForm setShowAddTaskForm={setShowAddTaskForm} />}
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-end">
                    {comments && comments.length > 0 && (
                        <div className="p-4 border-t border-color-gray-200 text-[13px]">
                            <div className="mb-4 flex items-center gap-2 text-[14px]">
                                <span>Comments</span>
                                <span>{comments.length}</span>
                            </div>

                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div className="flex">
                                        <div className="rounded-full bg-black p-1 mb-3">
                                            <img src="/prestige-9-bo2.png" alt="user-icon" className="w-[32px] h-[32px]" />
                                        </div>

                                        <div className="ml-2">
                                            <div className="flex items-center gap-4 text-color-gray-100">
                                                <div>{comment.username}</div>
                                                <div>{comment.timePosted}</div>
                                            </div>

                                            <div className="mt-2">
                                                {comment.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div>
                {showAddCommentInput && (
                    <div className="p-4 border-t border-b border-color-gray-200">
                        <TextareaAutosize className="placeholder-color-gray-100 bg-color-gray-300 p-[10px] rounded-md w-full outline-none border border-transparent focus:border-blue-500 resize-none" placeholder="Write a comment" value={currentComment} onChange={(e) => setCurrentComment(e.target.value)}></TextareaAutosize>
                    </div>
                )}

                <div className="px-4 py-3 flex justify-between items-center text-color-gray-100">
                    <div className="flex items-center gap-1">
                        <Icon name="drive_file_move" customClass={"text-color-gray-100 !text-[18px] hover:text-white cursor-pointer"} />
                        Hello Mobile
                    </div>

                    <div className="flex items-center gap-2">
                        <Icon name="edit_note" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} />
                        <Icon name="comment" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} onClick={() => setShowAddCommentInput(!showAddCommentInput)} />
                        <Icon name="more_horiz" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
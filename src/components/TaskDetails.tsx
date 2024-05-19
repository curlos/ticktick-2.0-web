import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { DropdownProps, TaskObj } from "../interfaces/interfaces";
import Task from "./Task";
import DropdownCalendar from "./Dropdown/DropdownCalendar";
import AddTaskForm from "./AddTaskForm";
import Dropdown from "./Dropdown/Dropdown";
import CustomInput from "./CustomInput";
import ModalTaskActivities from "./Modal/ModalTaskActivities";
import { useDeleteTaskMutation, useEditTaskMutation, useGetTasksQuery } from "../services/api";
import ModalAddTaskForm from "./Modal/ModalAddTaskForm";
import { useDebouncedCallback } from "../hooks/useDebounceCallback";
import { getTasksWithFilledInChildren } from "../utils/helpers.utils";
import { SortableTree } from "./SortableTest/SortableTree";
import useDebouncedEditTask from "../hooks/useDebouncedEditTask";
import classNames from "classnames";

const EmptyTask = () => (
    <div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700 flex justify-center items-center text-[18px] text-color-gray-100">
        <div className="text-center space-y-5">
            <Icon name="ads_click" customClass={"text-color-gray-100 text-blue-500 !text-[50px] hover:text-white cursor-pointer"} />
            <div>Click task title to view the details</div>
        </div>
    </div>
);

const TaskDetails = () => {
    const { data: fetchedTasks, isLoading: isTasksLoading, error } = useGetTasksQuery();
    const { tasks, tasksById, parentsOfTasks } = fetchedTasks || {};
    const { debouncedEditTaskApiCall } = useDebouncedEditTask();

    const [currTitle, setCurrTitle] = useState('');
    const [currDescription, setCurrDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [task, setTask] = useState<TaskObj>();
    const [parentTask, setParentTask] = useState<TaskObj | null>();
    const [childTasks, setChildTasks] = useState([]);
    const [currDueDate, setCurrDueDate] = useState(null);
    const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);
    const [isDropdownTaskOptionsVisible, setIsDropdownTaskOptionsVisible] = useState(false);
    const [isModalTaskActivitiesOpen, setIsModalTaskActivitiesOpen] = useState(false);
    const [isModalAddTaskFormOpen, setIsModalAddTaskFormOpen] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [showAddCommentInput, setShowAddCommentInput] = useState(false);
    const [currentComment, setCurrentComment] = useState('');
    const [comments, setComments] = useState([
        {
            'id': 1,
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        },
        {
            'id': 2,
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        },
        {
            'id': 3,
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        },
        {
            'id': 4,
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        },
        {
            'id': 5,
            'username': 'curlos',
            'timePosted': 'just now',
            'content': 'Lakers VS. Pelicans'
        }
    ]);

    const dropdownCalendarToggleRef = useRef(null);
    const dropdownTaskOptionsRef = useRef(null);

    let { taskId } = useParams();
    let navigate = useNavigate();
    const { projectId } = useParams();

    useEffect(() => {
        if (isTasksLoading) {
            return;
        }

        const currTask = taskId && tasksById && tasksById[taskId];
        setTask(currTask);

        console.log('dasd');

        if (currTask) {
            setCurrTitle(currTask.title);
            setCurrDescription(currTask.description);

            if (currTask.dueDate) {
                setCurrDueDate(new Date(currTask.dueDate));
            } else {
                setCurrDueDate(null);
            }

            console.log(currTask.dueDate);

            const parentTaskId = parentsOfTasks[currTask._id];
            const newParentTask = parentTaskId && tasksById[parentTaskId];

            if (newParentTask) {
                setParentTask(newParentTask);
            } else {
                setParentTask(null);
            }

            // TODO: There is a problem caused by this. Sortable Tree not updating with latest tasks.
            const newChildTasks = getTasksWithFilledInChildren(currTask.children, tasksById, projectId);
            setChildTasks(newChildTasks);
            // debugger;
        }
    }, [taskId, tasks, tasksById]);

    if (!task || isTasksLoading) {
        return <EmptyTask />;
    }

    const { _id, children, completedPomodoros, timeTaken, estimatedDuration, deadline } = task;

    return (
        <div className="flex flex-col w-full h-full max-h-screen bg-color-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-color-gray-200">
                <div className="flex items-center gap-2">
                    {!completed ? (
                        children.length > 0 ? (
                            <Icon name="list_alt" fill={0} customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                        ) : (
                            <Icon name="check_box_outline_blank" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                        )
                    ) : (
                        <Icon name="check_box" customClass={"text-color-gray-100 text-red-500 !text-[20px] hover:text-white cursor-pointer"} />
                    )}

                    <div
                        ref={dropdownCalendarToggleRef}
                        className="flex items-center gap-1 border-l border-color-gray-200 text-color-gray-100 px-2 cursor-pointer" onClick={() => setIsDropdownCalendarVisible(!isDropdownCalendarVisible)}
                    >
                        <Icon name="calendar_month" customClass={classNames(
                            "!text-[20px] hover:text-white cursor-pointer",
                            currDueDate ? "text-blue-500" : ""
                        )} />
                        {currDueDate ? (
                            <span className="text-blue-500">
                                {currDueDate.toLocaleDateString('en-US', {
                                    year: 'numeric', // Full year
                                    month: 'long',   // Full month name
                                    day: 'numeric'   // Day of the month
                                })}
                            </span>
                        ) : "Due Date"}
                    </div>
                    <DropdownCalendar toggleRef={dropdownCalendarToggleRef} isVisible={isDropdownCalendarVisible} setIsVisible={setIsDropdownCalendarVisible} task={task} currDueDate={currDueDate} setCurrDueDate={setCurrDueDate} customClasses=" ml-[-100px] mt-[15px]" />
                </div>

                <Icon name="flag" customClass={"text-color-gray-100 text-red-500 !text-[22px] hover:text-white cursor-pointer"} />
            </div>

            <div className="flex-1 overflow-auto no-scrollbar">
                <div className="p-4 flex flex-col justify-between">
                    {parentTask && (
                        <div className="w-full flex justify-between items-center text-color-gray-100 cursor-pointer" onClick={() => navigate(`/projects/${parentTask.projectId}/tasks/${parentTask._id}`)}>
                            <div className="max-w-[368px]">
                                <div className="truncate text-[12px]">{parentTask.title}</div>
                            </div>
                            <Icon name="chevron_right" customClass={'text-color-gray-100 !text-[16px] hover:text-white'} />
                        </div>
                    )}

                    <TextareaAutosize className="text-[16px] placeholder:text-[#7C7C7C] font-bold mb-0 bg-transparent w-full outline-none resize-none no-scrollbar" placeholder="What would you like to do?" value={currTitle} onChange={(e) => {
                        setCurrTitle(e.target.value);
                        debouncedEditTaskApiCall(_id, { title: e.target.value });
                    }}></TextareaAutosize>

                    <TextareaAutosize className="text-[14px] placeholder:text-[#7C7C7C] mt-2 mb-4 bg-transparent w-full outline-none resize-none" placeholder="Description" value={currDescription} onChange={(e) => {
                        setCurrDescription(e.target.value);
                        debouncedEditTaskApiCall(_id, { description: e.target.value });
                    }}></TextareaAutosize>

                    {/* {children.map((subtaskId: string) => (
                        <Task key={subtaskId} taskId={subtaskId} fromTaskDetails={true} />
                    ))} */}

                    {/* TODO: There is a problem caused by this. Sortable Tree not updating with latest tasks. */}
                    {childTasks && childTasks.length > 0 && <SortableTree collapsible indicator removable defaultItems={childTasks} tasksToUse={task.children} />}

                    {children && children.length > 0 && (
                        <div>
                            {!showAddTaskForm && (
                                <button className="flex items-center gap-1 my-2" onClick={() => setShowAddTaskForm(true)}>
                                    <Icon name="add" customClass={"text-blue-500 !text-[20px]"} />
                                    <span className="text-blue-500">Add Subtask</span>
                                </button>
                            )}

                            {showAddTaskForm && <AddTaskForm setShowAddTaskForm={setShowAddTaskForm} parentId={_id} />}
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-end">
                    {/* TODO: Bring comments back once I add the functionality and the routes on the backend. */}
                    {!comments && comments.length > 0 && (
                        <div className="p-4 border-t border-color-gray-200 text-[13px]">
                            <div className="mb-4 flex items-center gap-2 text-[14px]">
                                <span>Comments</span>
                                <span>{comments.length}</span>
                            </div>

                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex">
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
                        {/* <Icon name="edit_note" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} /> */}
                        <Icon name="comment" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} onClick={() => setShowAddCommentInput(!showAddCommentInput)} />
                        <Icon toggleRef={dropdownTaskOptionsRef} name="more_horiz" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} onClick={() => setIsDropdownTaskOptionsVisible(!isDropdownTaskOptionsVisible)} />

                        <DropdownTaskOptions toggleRef={dropdownTaskOptionsRef} isVisible={isDropdownTaskOptionsVisible} setIsVisible={setIsDropdownTaskOptionsVisible} setIsModalTaskActivitiesOpen={setIsModalTaskActivitiesOpen} setIsModalAddTaskFormOpen={setIsModalAddTaskFormOpen} task={task} />
                    </div>
                </div>
            </div>

            <ModalTaskActivities isModalOpen={isModalTaskActivitiesOpen} setIsModalOpen={setIsModalTaskActivitiesOpen} />

            <ModalAddTaskForm isModalOpen={isModalAddTaskFormOpen} setIsModalOpen={setIsModalAddTaskFormOpen} parentId={_id} />
        </div>
    );
};

interface DropdownTaskOptionsProps extends DropdownProps {
    setIsModalTaskActivitiesOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsModalAddTaskFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    task: TaskObj;
}

const DropdownTaskOptions: React.FC<DropdownTaskOptionsProps> = ({ toggleRef, isVisible, setIsVisible, setIsModalTaskActivitiesOpen, setIsModalAddTaskFormOpen, task }) => {
    const [deleteTask] = useDeleteTaskMutation();
    const [isDropdownStartFocusVisible, setIsDropdownStartFocusVisible] = useState(false);
    const [isDropdownEstimationVisible, setIsDropdownEstimationVisible] = useState(false);

    const dropdownStartFocusRef = useRef(null);
    const dropdownEstimationRef = useRef(null);

    // TODO: Write logic
    const handleDelete = () => {
        // Delete the task and then the redirect to the list of tasks in the project as the current task has been delete and thus the page is not accessible anymore.
        try {
            deleteTask(task._id);
            setIsVisible(false);
        } catch (error) {
            throw new Error(error);
        }
    };


    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' mt-[5px] shadow-2xl border border-color-gray-200 rounded mt-[-190px] ml-[-180px]'}>
            <div className="w-[232px] p-1 rounded text-[13px]" onClick={(e) => e.stopPropagation()}>
                <div className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer" onClick={() => setIsModalAddTaskFormOpen(true)}>
                    <Icon name="add_task" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} />
                    <div>Add Subtask</div>
                </div>

                <div ref={dropdownStartFocusRef} className="p-1 flex justify-between items-center hover:bg-color-gray-300 cursor-pointer" onClick={() => setIsDropdownStartFocusVisible(!isDropdownStartFocusVisible)}>
                    <div className="flex items-center gap-[2px]">
                        <Icon name="timer" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} />
                        <div>Start Focus</div>
                    </div>

                    <Icon name="chevron_right" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} />
                </div>

                {/* Side Dropdowns */}
                <DropdownStartFocus toggleRef={dropdownStartFocusRef} toggleDropdownEstimationRef={dropdownEstimationRef} isVisible={isDropdownStartFocusVisible} setIsVisible={setIsDropdownStartFocusVisible} setIsDropdownEstimationVisible={setIsDropdownEstimationVisible} />

                <DropdownEstimation toggleRef={dropdownEstimationRef} isVisible={isDropdownEstimationVisible} setIsVisible={setIsDropdownEstimationVisible} />

                <div className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer" onClick={() => setIsModalTaskActivitiesOpen(true)}>
                    <Icon name="timeline" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer mb-[-2px]"} fill={0} />
                    <div>Task Activities</div>
                </div>

                <div className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer" onClick={handleDelete}>
                    <Icon name="delete" customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} />
                    <div>Delete</div>
                </div>
            </div>
        </Dropdown>
    );
};

interface DropdownStartFocusProps extends DropdownProps {
    setIsDropdownEstimationVisible: React.Dispatch<React.SetStateAction<boolean>>;
    toggleDropdownEstimationRef: React.MutableRefObject<null>;
}

const DropdownStartFocus: React.FC<DropdownStartFocusProps> = ({ toggleRef, toggleDropdownEstimationRef, isVisible, setIsVisible, setIsDropdownEstimationVisible }) => {

    // TODO: Implement logic
    const handleStartPomo = () => {
        return;
    };

    // TODO: Implement logic
    const handleStartStopwatch = () => {
        return;
    };

    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' mt-[5px] shadow-2xl border border-color-gray-200 rounded mt-[-141px] ml-[-180px]'}>
            <div className="w-[170px] p-1 rounded text-[13px]" onClick={(e) => e.stopPropagation()}>
                <div className="p-2 hover:bg-color-gray-300 cursor-pointer" onClick={handleStartPomo}>
                    <div>Start Pomo</div>
                </div>

                <div className="p-2 hover:bg-color-gray-300 cursor-pointer" onClick={handleStartStopwatch}>
                    <div>Start Stopwatch</div>
                </div>

                <div ref={toggleDropdownEstimationRef} className="p-2 hover:bg-color-gray-300 cursor-pointer" onClick={() => setIsDropdownEstimationVisible(true)}>
                    <div>Estimation</div>
                </div>
            </div>
        </Dropdown>
    );
};

interface DropdownEstimationProps extends DropdownProps { }

const DropdownEstimation: React.FC<DropdownEstimationProps> = ({ toggleRef, isVisible, setIsVisible }) => {
    const [isDropdownEstimationOptionsVisible, setIsDropdownEstimationOptionsVisible] = useState(false);
    const [selectedEstimationOption, setSelectedEstimationOption] = useState('Estimated Pomo');

    const dropdownEstimationOptionsRef = useRef(null);

    const [pomos, setPomos] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' mt-[5px] shadow-2xl border border-color-gray-200 rounded mt-[-130px] ml-[-210px]'}>
            <div className="w-[200px] p-2 rounded text-[13px]" onClick={(e) => e.stopPropagation()}>
                <div className="flex-1">
                    <div ref={dropdownEstimationOptionsRef} className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer" onClick={() => {
                        setIsDropdownEstimationOptionsVisible(!isDropdownEstimationOptionsVisible);
                    }}>
                        <div>{selectedEstimationOption}</div>
                        <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                    </div>

                    <DropdownEstimationOptions toggleRef={dropdownEstimationOptionsRef} isVisible={isDropdownEstimationOptionsVisible} setIsVisible={setIsDropdownEstimationOptionsVisible} selectedEstimationOption={selectedEstimationOption} setSelectedEstimationOption={setSelectedEstimationOption} />

                    <div className="grid grid-cols-2 gap-4 my-4">
                        {selectedEstimationOption === 'Estimated Pomo' ? (
                            <div className="flex items-end gap-2">
                                <CustomInput value={pomos} setValue={setPomos} customClasses="w-[60px]" />
                                <div>pomos</div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-end gap-2">
                                    <CustomInput value={hours} setValue={setHours} customClasses="w-[60px]" />
                                    <div>hr</div>
                                </div>
                                <div className="flex items-end gap-2">
                                    <CustomInput value={minutes} setValue={setMinutes} customClasses="w-[60px]" />
                                    <div>min</div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200" onClick={() => {
                            setIsVisible(false);
                        }}>Cancel</button>
                        <button className="bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600" onClick={() => {
                            setIsVisible(false);
                        }}>Ok</button>
                    </div>
                </div>
            </div>
        </Dropdown>
    );
};

interface DropdownEstimationOptionsProps extends DropdownProps {
    selectedEstimationOption: string;
    setSelectedEstimationOption: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownEstimationOptions: React.FC<DropdownEstimationOptionsProps> = ({ toggleRef, isVisible, setIsVisible, selectedEstimationOption, setSelectedEstimationOption }) => {

    const estimationOptions = ['Estimated Pomo', 'Estimated Duration'];

    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' mt-[5px] shadow-2xl border border-color-gray-200 rounded-lg'}>
            <div className="w-[170px] p-1 rounded" onClick={(e) => e.stopPropagation()}>
                <div className="overflow-auto gray-scrollbar text-[13px]">
                    {estimationOptions.map((estimationOption) => {
                        const isSelected = (selectedEstimationOption == estimationOption);

                        return (
                            <div
                                key={estimationOption}
                                className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
                                onClick={() => {
                                    setSelectedEstimationOption(estimationOption);
                                    setIsVisible(false);
                                }}
                            >
                                <div className={isSelected ? 'text-blue-500' : ''}>{estimationOption}</div>
                                {isSelected && <Icon name="check" fill={0} customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Dropdown>
    );
};

export default TaskDetails;
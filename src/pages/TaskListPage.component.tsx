import { useState } from "react";
import Icon from "../components/Icon.component";
import TaskList from "../components/TaskList.component";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from '../store/store';
import { TaskObj } from "../types/types";
import TooltipCalendar from "../components/tooltips/TooltipCalendar";

interface TaskListByCategoryProps {
    tasks: Array<TaskObj>;
}

const TaskListByCategory: React.FC<TaskListByCategoryProps> = ({ tasks }) => {
    const [category, setCategory] = useState('high');
    const [showTasks, setShowTasks] = useState(true);
    const categoryIconClass = "text-color-gray-100 !text-[16px] hover:text-white";

    return (
        <div>
            {category && (
                <div className="flex items-center text-[12px] cursor-pointer" onClick={() => setShowTasks(!showTasks)}>
                    {showTasks ? (
                        <Icon name="expand_more" customClass={categoryIconClass} />
                    ) : (
                        <Icon name="chevron_right" customClass={categoryIconClass} />
                    )}

                    <span className="mr-[6px]">High</span>
                    <span className="text-color-gray-100">3</span>
                </div>
            )}

            {showTasks && <TaskList tasks={tasks} />}
        </div>
    );
};

const AddTaskInput = () => {
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [focused, setFocused] = useState(false);
    const [priority, setPriority] = useState({
        name: 'No Priority',
        backendValue: null,
        flagColor: '#7B7B7B'
    });
    const [dueDate, setDueDate] = useState(null);
    const [isTooltipCalendarVisible, setIsTooltipCalendarVisible] = useState(false);

    const handleAddTask = async (e) => {
        e.preventDefault();

        if (!title) {
            return null;
        }

        const payload = {
            title,
            priority: priority && priority.backendValue
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks/add`, {
                method: 'POST', // Specify the request method
                headers: {
                    'Content-Type': 'application/json', // Indicate the type of content expected by the server
                },
                body: JSON.stringify(payload), // Send the data as a JSON string
            });

            if (!response.ok) {
                // If the server response is not ok, throw an error
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json(); // Parse the JSON response
            dispatch(addTask(responseData)); // Dispatch an action to update the Redux store
            setTitle('');
            setPriority({
                name: 'No Priority',
                backendValue: null,
                flagColor: '#7B7B7B'
            });
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <>
            <form
                className={"mt-3 flex items-start gap-1 bg-color-gray-600 rounded-lg p-3 border" + (focused ? ' border-blue-500' : ' border-transparent')}
                onSubmit={handleAddTask}
            >
                <input
                    className="text-[14px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none"
                    placeholder={`+ Add task to "Hello Mobile", press Enter to save.`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                ></input>
                <span className="h-[24px] cursor-pointer">
                    <Icon name="calendar_month" customClass={"text-color-gray-100 !text-[20px]"} onClick={() => setIsTooltipCalendarVisible(!isTooltipCalendarVisible)} />
                    <TooltipCalendar isVisible={isTooltipCalendarVisible} setIsVisible={setIsTooltipCalendarVisible} dueDate={dueDate} setDueDate={setDueDate} />
                </span>
                <span className="h-[24px] cursor-pointer">
                    <Icon name="expand_more" customClass={"text-color-gray-100 !text-[22px]"} />
                </span>
            </form>
        </>
    );
};

const TaskListPage = () => {
    const allTasks = useSelector((state) => state.tasks.tasks);

    return (
        <div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
            <div className="p-4 h-full border-l border-r border-color-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex gap-1 items-center">
                        <Icon name="menu_open" customClass={"text-white !text-[24px]"} />
                        <h3 className="text-[20px] font-[600]">Hello Mobile</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <Icon name="swap_vert" customClass={"text-white !text-[24px]"} />
                        <Icon name="more_horiz" customClass={"text-white !text-[24px]"} />
                    </div>
                </div>

                <AddTaskInput />

                <div className="mt-4 space-y-4">
                    <TaskListByCategory tasks={allTasks} />
                </div>
            </div>
        </div>
    );
};

export default TaskListPage;
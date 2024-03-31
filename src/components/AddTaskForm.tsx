import { useState } from "react";
import { useDispatch } from "react-redux";
import Icon from "./Icon.component";
import DropdownCalendar from "./Dropdown/DropdownCalendar";
import TextareaAutosize from 'react-textarea-autosize';
import DropdownPriorities from "./Dropdown/DropdownPriorities";
import { PRIORITIES } from "../utils/priorities.utils";
import { addTask } from "../slices/tasksSlice";

interface AddTaskFormProps {
    setShowAddTaskForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ setShowAddTaskForm }) => {
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [focused, setFocused] = useState(false);
    const [dueDate, setDueDate] = useState(null);
    const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);
    const [isDropdownPrioritiesVisible, setIsDropdownPrioritiesVisible] = useState(false);
    const [tempSelectedPriority, setTempSelectedPriority] = useState('none');
    const [description, setDescription] = useState('');

    const priority = PRIORITIES[tempSelectedPriority];

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
                backendValue: 'none',
                flagColor: '#7B7B7B'
            });
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <>
            <form
                className={"mt-3 gap-1 bg-color-gray-600 rounded-lg border" + (focused ? ' border-blue-500' : ' border-transparent')}
                onSubmit={handleAddTask}
            >
                <div className="p-3 pb-1">
                    <TextareaAutosize className="text-[14px] placeholder:text-[#7C7C7C] font-bold mb-0 bg-transparent w-full outline-none resize-none" placeholder="Task name" value={title} onChange={(e) => setTitle(e.target.value)}></TextareaAutosize>
                    <TextareaAutosize className="text-[14px] placeholder:text-[#7C7C7C] bg-transparent w-full outline-none resize-none" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></TextareaAutosize>

                    <div className="flex gap-2 mt-3">
                        <div
                            className="text-[14px] flex items-center gap-1 text-color-gray-100 p-1 border border-color-gray-100 rounded-md cursor-pointer" onClick={() => setIsDropdownCalendarVisible(!isDropdownCalendarVisible)}>
                            <Icon name="calendar_month" customClass={"!text-[16px] hover:text-white"} />
                            Due Date
                        </div>

                        <DropdownCalendar isVisible={isDropdownCalendarVisible} setIsVisible={setIsDropdownCalendarVisible} dueDate={dueDate} setDueDate={setDueDate} />

                        <div
                            className="text-[14px] text-color-gray-100 p-1 border border-color-gray-100 rounded-md cursor-pointer" onClick={() => setIsDropdownPrioritiesVisible(!isDropdownPrioritiesVisible)}>
                            {tempSelectedPriority === 'none' ? (
                                <div className="flex items-center gap-1">
                                    <Icon name="calendar_month" customClass={"!text-[16px] hover:text-white"} />
                                    Priority
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Icon name="flag" customClass={`${priority.textFlagColor} !text-[22px] cursor-pointer`} />
                                    {priority.name}
                                </div>
                            )}

                            <DropdownPriorities
                                isVisible={isDropdownPrioritiesVisible}
                                setIsVisible={setIsDropdownPrioritiesVisible}
                                tempSelectedPriority={tempSelectedPriority}
                                setTempSelectedPriority={setTempSelectedPriority}
                            />

                        </div>
                    </div>
                </div>

                <hr className="border-color-gray-200 my-1" />

                <div className="p-2 pt-1 flex justify-between items-center">
                    <div className="flex items-center gap-1 font-bold text-[12px] cursor-pointer">
                        Hello Mobile
                        <Icon name="expand_more" customClass={"!text-[16px] hover:text-white"} />
                    </div>

                    <div className="space-x-2">
                        <button className="border border-color-gray-200 rounded-md py-1 cursor-pointer hover:bg-color-gray-200 p-3" onClick={() => setShowAddTaskForm(false)}>Cancel</button>
                        <button className="bg-blue-500 rounded-md py-1 cursor-pointer hover:bg-blue-600 p-3">Add task</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddTaskForm;
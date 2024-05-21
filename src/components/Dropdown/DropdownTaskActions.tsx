import Dropdown from "./Dropdown";
import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import DropdownTime from "./DropdownTIme";
import DropdownReminder from "./DropdownReminder";
import DropdownRepeat from "./DropdownRepeat";
import SelectCalendar from "../SelectCalendar";
import { DropdownProps, TaskObj } from "../../interfaces/interfaces";
import useDebouncedEditTask from "../../hooks/useDebouncedEditTask";
import { useEditTaskMutation } from "../../services/api";
import { PRIORITIES } from "../../utils/priorities.utils";
import classNames from "classnames";

interface BigDateIconOptionProps {
    iconName: string;
    DropdownText: string;
    onClick?: () => void;
}

const BigDateIconOption: React.FC<BigDateIconOptionProps> = ({ iconName, DropdownText, onClick }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    return (
        <div className="relative">
            <Icon toggleRef={dropdownRef} name={iconName} fill={0} customClass="text-color-gray-50 !text-[22px] hover:text-white hover:bg-color-gray-200 rounded cursor-pointer" onClick={onClick} onMouseOver={() => setIsDropdownVisible(true)} onMouseLeave={() => setIsDropdownVisible(false)} />
            <Dropdown toggleRef={dropdownRef} isVisible={isDropdownVisible} setIsVisible={setIsDropdownVisible} customClasses={' !bg-black'}>
                <div className="p-2 text-[12px] text-nowrap">
                    {DropdownText}
                </div>
            </Dropdown>
        </div>
    );
};

interface CalendarProps {
    dueDate: Date | null;
    setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const BigDateIconOptionList: React.FC<CalendarProps> = ({ dueDate, setDueDate }) => {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return (
        <div className="flex justify-between items-center gap-1 my-2">
            <BigDateIconOption iconName="sunny" DropdownText="Today" onClick={() => {
                setDueDate(today);
            }} />
            <BigDateIconOption iconName="wb_twilight" DropdownText="Tomorrow" onClick={() => {
                setDueDate(tomorrow);
            }} />
            <BigDateIconOption iconName="event_upcoming" DropdownText="Next Week" onClick={() => {
                setDueDate(nextWeek);
            }} />
            <BigDateIconOption iconName="clear_night" DropdownText="Next Month" onClick={() => {
                setDueDate(nextMonth);
            }} />
        </div>
    );
};

interface DropTaskActionsProps extends DropdownProps {
    task: TaskObj;
    currDueDate: Date | null;
    setCurrDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DropdownTaskActions: React.FC<DropTaskActionsProps> = ({ toggleRef, isVisible, setIsVisible, task, currDueDate, setCurrDueDate, customClasses, customStyling }) => {
    const [editTask] = useEditTaskMutation();

    console.log(task);

    interface ITaskAction {
        iconName: string;
        title: string;
    }

    const TaskAction: React.FC<ITaskAction> = ({ iconName, title }) => {
        return (
            <div className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer rounded text-[13px]">
                <Icon name={iconName} customClass={"text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer"} fill={0} />
                <div>{title}</div>
            </div>
        );
    };

    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' shadow-2xl' + (customClasses ? ` ${customClasses}` : '')} customStyling={customStyling ? customStyling : null}>
            <div className="w-[200px]">
                <div className="p-4 pb-0">
                    Date
                    <BigDateIconOptionList dueDate={currDueDate} setDueDate={setCurrDueDate} />
                </div>

                <div className="p-4 pt-0">
                    Priority

                    <div className="flex justify-between items-center gap-1 mt-2">
                        {Object.values(PRIORITIES).map((priority) => {

                            return (
                                <Icon name="flag" customClass={classNames(
                                    "!text-[22px] cursor-pointer p-1 rounded",
                                    priority.textFlagColor,
                                    task.priority === priority.backendValue ? "bg-gray-700" : ""
                                )} />
                            );
                        })}
                    </div>
                </div>

                <hr className="border-color-gray-200" />

                <div className="p-1">
                    <TaskAction iconName="add_task" title="Add Subtask" />
                    <TaskAction iconName="pin_drop" title="Pin" />
                    <TaskAction iconName="disabled_by_default" title="Won't Do" />
                    <TaskAction iconName="move_to_inbox" title="Move to" />
                    <TaskAction iconName="sell" title="Tags" />
                </div>

                <hr className="border-color-gray-200" />

                <div className="p-1">
                    <TaskAction iconName="content_copy" title="Duplicate" />
                    <TaskAction iconName="link" title="Copy Link" />
                    <TaskAction iconName="edit_note" title="Convert to Note" />
                    <TaskAction iconName="delete" title="Delete" />
                </div>










                {/* <div className="grid grid-cols-2 gap-2 px-3 pb-4">
                    <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200" onClick={() => {
                        setCurrDueDate(null);
                        setIsVisible(false);

                        if (task) {
                            editTask({ taskId: task._id, payload: { dueDate: null } });
                        }

                    }}>Clear</button>
                    <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600" onClick={() => {
                        if (task) {
                            editTask({ taskId: task._id, payload: { dueDate: currDueDate } });
                        }

                        setIsVisible(false);
                    }}>Ok</button>
                </div> */}
            </div>
        </Dropdown>
    );
};

export default DropdownTaskActions;
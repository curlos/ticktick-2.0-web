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

interface BigDateIconOptionProps {
    iconName: string;
    DropdownText: string;
    onClick?: () => void;
}

const BigDateIconOption: React.FC<BigDateIconOptionProps> = ({ iconName, DropdownText, onClick }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    return (
        <div>
            <Icon toggleRef={dropdownRef} name={iconName} fill={0} customClass="text-color-gray-50 !text-[24px] hover:text-white hover:bg-color-gray-200 p-1 rounded cursor-pointer" onClick={onClick} onMouseOver={() => setIsDropdownVisible(true)} onMouseLeave={() => setIsDropdownVisible(false)} />
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
        <div className="my-5 flex justify-between">
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

interface DropdownPrioritiesProps extends DropdownProps {
    task: TaskObj;
    currDueDate: Date | null;
    setCurrDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
    customClasses?: string;
}

const DropdownCalendar: React.FC<DropdownPrioritiesProps> = ({ toggleRef, isVisible, setIsVisible, task, currDueDate, setCurrDueDate, customClasses }) => {
    const [editTask] = useEditTaskMutation();

    const [selectedView, setSelectedView] = useState('date');
    const [isDropdownTimeVisible, setIsDropdownTimeVisible] = useState(false);
    const [isDropdownReminderVisible, setIsDropdownReminderVisible] = useState(false);
    const [isDropdownRepeatVisible, setIsDropdownRepeatVisible] = useState(false);
    const [reminder, setReminder] = useState('');
    const [repeat, setRepeat] = useState('');

    const dropdownTimeRef = useRef(null);
    const dropdownReminderRef = useRef(null);
    const dropdownRepeatRef = useRef(null);

    interface TimeOptionProps {
        name: string;
        iconName: string;
        onClick?: () => void;
        toggleRef: React.MutableRefObject<null>;
    }

    const TimeOption: React.FC<TimeOptionProps> = ({ name, iconName, onClick, toggleRef }) => (
        <div ref={toggleRef} className="flex items-center justify-between h-[40px] px-2 text-[13px] text-color-gray-25 hover:bg-color-gray-200 rounded cursor-pointer" onClick={onClick}>
            <div className="flex items-center gap-1">
                <Icon name={iconName} fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                <div>{name}</div>
            </div>

            <Icon name="chevron_right" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
        </div>
    );


    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' shadow-2xl' + (customClasses ? ` ${customClasses}` : '')}>
            <div className="w-[260px]">
                <div className="p-4">
                    <div className="grid grid-cols-2 bg-color-gray-700 rounded-md p-1 text-center">
                        <div className={"rounded-md p-[2px]" + (selectedView === 'date' ? ' bg-color-gray-600' : '')} onClick={() => setSelectedView('date')}>Date</div>
                        <div className={"rounded-md p-[2px]" + (selectedView === 'duration' ? ' bg-color-gray-600' : '')} onClick={() => setSelectedView('duration')}>Duration</div>
                    </div>

                    <BigDateIconOptionList dueDate={currDueDate} setDueDate={setCurrDueDate} />
                </div>

                <SelectCalendar dueDate={currDueDate} setDueDate={setCurrDueDate} />

                <div className="px-1 mb-4">
                    {/* Time */}
                    <DropdownTime toggleRef={dropdownTimeRef} isVisible={isDropdownTimeVisible} setIsVisible={setIsDropdownTimeVisible} />
                    <TimeOption toggleRef={dropdownTimeRef} name="Time" iconName="schedule" onClick={() => {
                        setIsDropdownTimeVisible(!isDropdownTimeVisible);
                    }} />

                    {/* Reminder */}
                    <DropdownReminder toggleRef={dropdownReminderRef} isVisible={isDropdownReminderVisible} setIsVisible={setIsDropdownReminderVisible} reminder={reminder} setReminder={setReminder} />
                    <TimeOption
                        toggleRef={dropdownReminderRef}
                        name="Reminder"
                        iconName="alarm"
                        onClick={() => setIsDropdownReminderVisible(!isDropdownReminderVisible)}
                    />

                    {/* Repeat */}
                    <DropdownRepeat toggleRef={dropdownRepeatRef} isVisible={isDropdownRepeatVisible} setIsVisible={setIsDropdownRepeatVisible} repeat={repeat} setRepeat={setRepeat} />
                    <TimeOption
                        toggleRef={dropdownRepeatRef}
                        name="Repeat"
                        iconName="repeat"
                        onClick={() => setIsDropdownRepeatVisible(!isDropdownRepeatVisible)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 px-3 pb-4">
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
                </div>
            </div>
        </Dropdown>
    );
};

export default DropdownCalendar;
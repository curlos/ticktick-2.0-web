import Dropdown from "./Dropdown";
import { useEffect, useRef, useState } from "react";
import Icon from "../Icon.component";
import { areDatesEqual, debounce } from "../../utils/helpers.utils";
import CustomRadioButton from "../CustomRadioButton";
import Fuse from 'fuse.js';
import DropdownTimeZoneSelector from "./DropdownTimeZoneSelector";
import DropdownFixedOrFloatingTimeZone from "./DropdownFixedOrFloatingTimeZone";
import DropdownTime from "./DropdownTIme";
import DropdownReminder from "./DropdownReminder";
import DropdownRepeat from "./DropdownRepeat";

interface BigDateIconOptionProps {
    iconName: string;
    DropdownText: string;
    onClick?: () => void;
}

const BigDateIconOption: React.FC<BigDateIconOptionProps> = ({ iconName, DropdownText, onClick }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    return (
        <div>
            <Icon name={iconName} fill={0} customClass="text-color-gray-50 !text-[24px] hover:text-white hover:bg-color-gray-200 p-1 rounded cursor-pointer" onClick={onClick} onMouseOver={() => setIsDropdownVisible(true)} onMouseLeave={() => setIsDropdownVisible(false)} />
            <Dropdown isVisible={isDropdownVisible} setIsVisible={setIsDropdownVisible} customClasses={' !bg-black'}>
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

const Calendar: React.FC<CalendarProps> = ({ dueDate, setDueDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (dueDate) {
            setCurrentDate(dueDate);
        }
    }, [dueDate]);

    function getCalendarMonth(year, month) {
        const calendar = [];
        const firstDayOfMonth = new Date(year, month, 1);
        let currentDay = new Date(firstDayOfMonth);
        const dayOfWeek = currentDay.getDay();
        currentDay.setDate(currentDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        // This will ensure we always start the calendar with 7 rows of 7 days
        const weeksInCalendar = 6; // The number of weeks you want to show

        for (let week = 0; week < weeksInCalendar; week++) {
            const days = [];
            for (let i = 0; i < 7; i++) { // 7 days per week
                days.push(new Date(currentDay));
                currentDay.setDate(currentDay.getDate() + 1);
            }
            calendar.push(days);
        }

        return calendar;
    }

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const calendarMonth = getCalendarMonth(currentDate.getFullYear(), currentDate.getMonth());
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    return (
        <div>
            <div className="flex items-center justify-between px-4">
                <div>{monthName} {currentDate.getFullYear()}</div>
                <div className="flex items-center">
                    <Icon name="chevron_left" fill={0} customClass={"text-color-gray-50 !text-[18px] hover:text-white cursor-pointer"} onClick={goToPreviousMonth} />
                    <Icon name="fiber_manual_record" fill={0} customClass={"text-color-gray-50 !text-[14px] hover:text-white cursor-pointer"} />
                    <Icon name="chevron_right" fill={0} customClass={"text-color-gray-50 !text-[18px] hover:text-white cursor-pointer"} onClick={goToNextMonth} />
                </div>
            </div>

            <div className="w-full text-[12px] p-3">
                <div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
                            <div key={day + i} className="py-1">{day}</div>
                        ))}
                    </div>
                </div>
                <div className="text-center">
                    {calendarMonth.map((week, index) => (
                        <div key={`week-${index}`} className="mb-1 grid grid-cols-7 gap-1">
                            {week.map((day, index) => {
                                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                                const isDayToday = areDatesEqual(new Date(), day);
                                const isChosenDay = areDatesEqual(dueDate, day);
                                let appliedStyles = [];

                                if (isCurrentMonth) {
                                    if (isChosenDay) {
                                        appliedStyles.push('bg-blue-500 text-white');
                                    } else if (isDayToday) {
                                        appliedStyles.push('bg-color-gray-200 text-blue-500');
                                    } else {
                                        appliedStyles.push('text-white bg-transparent hover:bg-color-gray-20');
                                    }
                                } else {
                                    appliedStyles.push('text-color-gray-100 bg-transparent hover:bg-color-gray-20');
                                }

                                const handleClick = () => {
                                    setCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));
                                    setDueDate(day);
                                };

                                return (
                                    <div
                                        key={`day-${index}`}
                                        className={`py-1 cursor-pointer rounded-full ${appliedStyles}`}
                                        onClick={handleClick}
                                    >
                                        {day.getDate()}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface DropdownPrioritiesProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    dueDate: Date | null;
    setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
    customClasses?: string;
}

const DropdownCalendar: React.FC<DropdownPrioritiesProps> = ({ isVisible, setIsVisible, dueDate, setDueDate, customClasses }) => {
    const [selectedView, setSelectedView] = useState('date');
    const [isTimeDropdownVisibile, setIsTimeDropdownVisible] = useState(false);
    const [isDropdownReminderVisible, setIsDropdownReminderVisible] = useState(false);
    const [isDropdownRepeatVisible, setIsDropdownRepeatVisible] = useState(false);
    const [reminder, setReminder] = useState('');
    const [repeat, setRepeat] = useState('');

    interface TimeOptionProps {
        name: string;
        iconName: string;
        onClick?: () => void;
    }

    const TimeOption: React.FC<TimeOptionProps> = ({ name, iconName, onClick }) => (
        <div className="flex items-center justify-between h-[40px] px-2 text-[13px] text-color-gray-25 hover:bg-color-gray-200 rounded cursor-pointer" onClick={onClick}>
            <div className="flex items-center gap-1">
                <Icon name={iconName} fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                <div>{name}</div>
            </div>

            <Icon name="chevron_right" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
        </div>
    );


    return (
        <div className={`${isVisible ? '' : 'hidden'} custom-Dropdown-position`}>
            <Dropdown isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' ml-[-70px] shadow-2xl' + (customClasses ? ` ${customClasses}` : '')}>
                <div className="w-[260px]">
                    <div className="p-4">
                        <div className="grid grid-cols-2 bg-color-gray-700 rounded-md p-1 text-center">
                            <div className={"rounded-md p-[2px]" + (selectedView === 'date' ? ' bg-color-gray-600' : '')} onClick={() => setSelectedView('date')}>Date</div>
                            <div className={"rounded-md p-[2px]" + (selectedView === 'duration' ? ' bg-color-gray-600' : '')} onClick={() => setSelectedView('duration')}>Duration</div>
                        </div>

                        <BigDateIconOptionList dueDate={dueDate} setDueDate={setDueDate} />
                    </div>

                    <Calendar dueDate={dueDate} setDueDate={setDueDate} />

                    <div className="px-1 mb-4">
                        {/* Time */}
                        <DropdownTime isTimeDropdownVisibile={isTimeDropdownVisibile} setIsTimeDropdownVisible={setIsTimeDropdownVisible} />
                        <TimeOption name="Time" iconName="schedule" onClick={() => {
                            setIsTimeDropdownVisible(!isTimeDropdownVisibile);
                        }} />

                        {/* Reminder */}
                        <DropdownReminder isVisible={isDropdownReminderVisible} setIsVisible={setIsDropdownReminderVisible} reminder={reminder} setReminder={setReminder} />
                        <TimeOption
                            name="Reminder"
                            iconName="alarm"
                            onClick={() => setIsDropdownReminderVisible(!isDropdownReminderVisible)}
                        />

                        {/* Repeat */}
                        <DropdownRepeat isVisible={isDropdownRepeatVisible} setIsVisible={setIsDropdownRepeatVisible} repeat={repeat} setRepeat={setRepeat} />
                        <TimeOption
                            name="Repeat"
                            iconName="repeat"
                            onClick={() => setIsDropdownRepeatVisible(!isDropdownRepeatVisible)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 px-3 pb-4">
                        <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200" onClick={() => {
                            setIsVisible(false);
                        }}>Clear</button>
                        <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600" onClick={() => {
                            setIsVisible(false);
                        }}>Ok</button>
                    </div>
                </div>
            </Dropdown>
        </div>
    );
};

export default DropdownCalendar;
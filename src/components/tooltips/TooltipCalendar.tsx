import Tooltip from "./Tooltip";
import { useEffect, useState } from "react";
import Icon from "../Icon.component";
import { areDatesEqual } from "../../utils/helpers.utils";
import CustomRadioButton from "../CustomRadioButton";

interface BigDateIconOptionProps {
    iconName: string;
    tooltipText: string;
    onClick?: () => void;
}

const BigDateIconOption: React.FC<BigDateIconOptionProps> = ({ iconName, tooltipText, onClick }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    return (
        <div>
            <Icon name={iconName} fill={0} customClass="text-color-gray-50 !text-[24px] hover:text-white hover:bg-color-gray-200 p-1 rounded cursor-pointer" onClick={onClick} onMouseOver={() => setIsTooltipVisible(true)} onMouseLeave={() => setIsTooltipVisible(false)} />
            <Tooltip isVisible={isTooltipVisible} customClasses={' !bg-black'}>
                <div className="p-2 text-[12px] text-nowrap">
                    {tooltipText}
                </div>
            </Tooltip>
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
            <BigDateIconOption iconName="sunny" tooltipText="Today" onClick={() => {
                setDueDate(today);
            }} />
            <BigDateIconOption iconName="wb_twilight" tooltipText="Tomorrow" onClick={() => {
                setDueDate(tomorrow);
            }} />
            <BigDateIconOption iconName="event_upcoming" tooltipText="Next Week" onClick={() => {
                setDueDate(nextWeek);
            }} />
            <BigDateIconOption iconName="clear_night" tooltipText="Next Month" onClick={() => {
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

interface TooltipTimeProps {
    isTimeTooltipVisibile: boolean;
}

const getTimesArray = () => {
    let timesArray = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let min = 0; min < 60; min += 30) {
            let time =
                `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            timesArray.push(time);
        }
    }

    return timesArray;
};

const TooltipTime: React.FC<TooltipTimeProps> = ({ isTimeTooltipVisibile }) => {
    const timesArray = getTimesArray();
    const [selectedTime, setSelectedTime] = useState('14:00');
    const [isTimezoneTooltipVisible, setIsTimezoneTooltipVisible] = useState(true);
    const [isTooltipFixedOrFloatingTimeZone, setIsTooltipFixedOrFloatingTimeZone] = useState(true);

    console.log(timesArray);

    return (
        <Tooltip isVisible={isTimeTooltipVisibile} customClasses={' mt-[-280px] ml-[-5px] shadow-2xl border border-color-gray-200 rounded-[4px]'}>
            <div className="w-[260px] p-1">
                <div className="overflow-auto gray-scrollbar h-[240px]">
                    {timesArray.map((time) => {
                        const isTimeSelected = selectedTime == time;

                        return (
                            <div
                                key={time}
                                className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg"
                                onClick={() => setSelectedTime(time)}
                            >
                                <div className={isTimeSelected ? 'text-blue-500' : ''}>{time}</div>
                                {isTimeSelected && <Icon name="check" fill={0} customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'} />}
                            </div>
                        );
                    })}
                </div>

                {/* TODO: Possibly add a button that lets you choose the specific Timezone. I think it'd be interesting but NOT required at the moment. */}
                <div className="p-2 mt-2">
                    <div className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500" onClick={() => {
                        setIsTimezoneTooltipVisible(!isTimezoneTooltipVisible);
                    }}>
                        <TooltipFixedOrFloatingTimeZone isVisible={isTooltipFixedOrFloatingTimeZone} setIsVisible={setIsTooltipFixedOrFloatingTimeZone} />
                        <div>New York, GMT-4</div>
                        <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                    </div>
                </div>
            </div>
        </Tooltip>
    );
};

interface TooltipFixedOrFloatingTimeZoneProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const TooltipFixedOrFloatingTimeZone: React.FC<TooltipFixedOrFloatingTimeZoneProps> = ({ isVisible, setIsVisible }) => {
    const [tempSelectedZone, setTempSelectedZone] = useState('New York, GMT-4');
    const [selectedTimeTrackingType, setSelectedTimeTrackingType] = useState('Fixed Time Zone');

    const handleRadioChange = (e) => {
        console.log(e.target.value);
        setSelectedTimeTrackingType(e.target.value);
    };

    return (
        <Tooltip isVisible={isVisible} customClasses={' mt-[-290px] ml-[-22px] shadow-2xl border border-color-gray-200 rounded-lg'}>
            <div className="w-[260px] p-3 rounded" onClick={(e) => e.stopPropagation()}>
                <CustomRadioButton
                    label="Fixed Time Zone"
                    name="Fixed Time Zone"
                    checked={selectedTimeTrackingType === 'Fixed Time Zone'}
                    onChange={handleRadioChange}
                />

                {/* selectedTimeTrackingType === 'Fixed Time Zone' */}

                <div className="border border-color-gray-200 rounded p-[2px] px-2 flex justify-between items-center hover:border-blue-500 mt-2 mb-5">
                    {/* {isTimezoneTooltipVisible && (
                        <Tooltip isVisible={isTimezoneTooltipVisible} customClasses={' mt-[-280px] ml-[-20px] shadow-2xl border border-color-gray-200 rounded-[4px]'}>
                            <div className="w-[260px]">
                                Fixed Time Zone
                            </div>
                        </Tooltip>
                    )} */}
                    <div className="text-[12px]">New York, GMT-4</div>
                    <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                </div>

                <CustomRadioButton
                    label="Floating Time"
                    name="Floating Time"
                    checked={selectedTimeTrackingType === 'Floating Time'}
                    onChange={handleRadioChange}
                />
                <div className="text-[12px] mt-1 text-color-gray-100">When time zone changes, time remains the same.</div>

                <div className="mt-5 mb-4 text-center text-color-gray-100 underline text-[12px]">Learn More</div>

                <div className="grid grid-cols-2 gap-2">
                    <button className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200" onClick={() => {
                        setIsVisible(false);
                    }}>Cancel</button>
                    <button className="bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600" onClick={() => {
                        setIsVisible(false);
                    }}>Ok</button>
                </div>
            </div>
        </Tooltip>
    );
};

interface TooltipPrioritiesProps {
    isTooltipVisible: boolean;
    dueDate: Date | null;
    setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const TooltipCalendar: React.FC<TooltipPrioritiesProps> = ({ isTooltipVisible, dueDate, setDueDate }) => {
    const [selectedView, setSelectedView] = useState('date');
    const [isTimeTooltipVisibile, setIsTimeTooltipVisible] = useState(true);
    interface TimeOptionProps {
        name: string;
        iconName: string;
        onClick?: () => void;
    }

    const TimeOption: React.FC<TimeOptionProps> = ({ name, iconName, onClick }) => (
        <div className="flex items-center justify-between h-[40px] px-2 text-[13px] text-color-gray-25 hover:bg-color-gray-200 rounded" onClick={onClick}>
            <div className="flex items-center gap-1">
                <Icon name={iconName} fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                <div>{name}</div>
            </div>

            <Icon name="chevron_right" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
        </div>
    );


    return (
        <div className={`${isTooltipVisible ? '' : 'hidden'} custom-tooltip-position`}>
            <Tooltip isVisible={isTooltipVisible} customClasses={' ml-[-70px] shadow-2xl'}>
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
                        <TooltipTime isTimeTooltipVisibile={isTimeTooltipVisibile} />
                        <TimeOption name="Time" iconName="schedule" onClick={() => {
                            setIsTimeTooltipVisible(true);
                        }} />
                        <TimeOption name="Reminder" iconName="alarm" />
                        {/* TODO: Could add this in the future but I haven't personally used this feature too much, so will leave it for later as I don't actually fully understand it quite yet. */}
                        {/* <TimeOption name="Repeat" iconName="repeat" /> */}
                    </div>

                    <div className="grid grid-cols-2 gap-2 px-3 pb-4">
                        <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200">Clear</button>
                        <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600">Ok</button>
                    </div>
                </div>
            </Tooltip>
        </div>
    );
};

export default TooltipCalendar;
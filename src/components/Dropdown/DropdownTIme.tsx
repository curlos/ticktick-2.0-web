import { useState } from "react";
import Dropdown from "./Dropdown";
import Icon from "../Icon.component";
import DropdownFixedOrFloatingTimeZone from "./DropdownFixedOrFloatingTimeZone";

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

interface DropdownTimeProps {
    isTimeDropdownVisibile: boolean;
}

const DropdownTime: React.FC<DropdownTimeProps> = ({ isTimeDropdownVisibile }) => {
    const timesArray = getTimesArray();
    const [selectedTime, setSelectedTime] = useState('14:00');
    const [isDropdownFixedOrFloatingTimeZone, setIsDropdownFixedOrFloatingTimeZone] = useState(false);
    const [timeZone, setTimeZone] = useState('New York, EDT');

    return (
        <Dropdown isVisible={isTimeDropdownVisibile} customClasses={' mt-[-280px] ml-[-5px] shadow-2xl border border-color-gray-200 rounded-[4px]'}>
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

                <div className="p-2 mt-2">
                    <div className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500" onClick={() => {
                        setIsDropdownFixedOrFloatingTimeZone(!isDropdownFixedOrFloatingTimeZone);
                    }}>
                        <DropdownFixedOrFloatingTimeZone isVisible={isDropdownFixedOrFloatingTimeZone} setIsVisible={setIsDropdownFixedOrFloatingTimeZone} setTimeZone={setTimeZone} />
                        <div>{timeZone}</div>
                        <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                    </div>
                </div>
            </div>
        </Dropdown>
    );
};

export default DropdownTime;
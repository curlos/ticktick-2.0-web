import { useState } from "react";
import Tooltip from "./Tooltip";
import Icon from "../Icon.component";

const BASIC_REMINDER_OPTIONS = {
    'On the day (09:00)': {
        checked: false,
    },
    '1 days ahead (09:00)': {
        checked: false,
    },
    '2 days ahead (09:00)': {
        checked: false,
    },
    '3 days ahead (09:00)': {
        checked: false,
    },
    '1 week ahead (09:00)': {
        checked: false,
    },
};

interface TooltipReminderProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    reminder: string;
    setReminder: React.Dispatch<React.SetStateAction<string>>;
}

const TooltipReminder: React.FC<TooltipReminderProps> = ({ isVisible, setIsVisible, reminder, setReminder }) => {
    const [basicReminderOptions, setBasicReminderOptions] = useState(BASIC_REMINDER_OPTIONS);
    const [isTooltipAdvancedReminderVisible, setIsTooltipAdvancedReminderVisible] = useState(false);

    console.log(basicReminderOptions);

    return (
        <Tooltip isVisible={isVisible} customClasses={' mt-[-290px] ml-[-22px] shadow-2xl border border-color-gray-200 rounded-lg'}>
            <div className="w-[260px] rounded" onClick={(e) => e.stopPropagation()}>
                <div className="p-1">
                    {Object.keys(basicReminderOptions).map((name: string) => (
                        <div
                            className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg"
                            onClick={() => {
                                console.log({
                                    ...basicReminderOptions, [name]: {
                                        ...basicReminderOptions[name], checked: !basicReminderOptions[name].checked
                                    }
                                });
                                setBasicReminderOptions({
                                    ...basicReminderOptions, [name]: {
                                        ...basicReminderOptions[name], checked: !basicReminderOptions[name].checked
                                    }
                                });
                                // setIsVisible(false);
                            }}
                        >
                            <div>{name}</div>
                            {basicReminderOptions[name].checked && (
                                <Icon name="check" fill={0} customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'} />
                            )}
                        </div>
                    ))}
                </div>

                <hr className="border-color-gray-200" />


                <TooltipAdvancedReminder isVisible={isTooltipAdvancedReminderVisible} setIsVisible={setIsTooltipAdvancedReminderVisible} reminder={reminder} setReminder={setReminder} />

                <div className="p-1">
                    <div className="p-2 mb-2 flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg" onClick={() => setIsTooltipAdvancedReminderVisible(!isTooltipAdvancedReminderVisible)}>Custom</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-4 px-3">
                    <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200" onClick={() => setIsVisible(false)}>Cancel</button>
                    <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600" onClick={() => setIsVisible(false)}>Ok</button>
                </div>

            </div>
        </Tooltip>
    );
};

interface TooltipAdvancedReminderProps extends TooltipReminderProps {

}

const TooltipAdvancedReminder: React.FC<TooltipAdvancedReminderProps> = ({ isVisible, setIsVisible, reminder, setReminder }) => {
    const [selectedUnitOfTime, setSelectedUnitOfTime] = useState('Day');
    const [isTooltipUnitOfTimeVisible, setIsTooltipUnitOfTimeVisible] = useState(false);
    const [unitsInAdvance, setUnitsInAdvance] = useState(1);
    const [remindAt, setRemindAt] = useState();

    return (
        <Tooltip isVisible={isVisible} customClasses={' mt-[-210px] ml-[0px] shadow-2xl border border-color-gray-200 rounded-lg'}>
            <div className="w-[260px] p-3 rounded" onClick={(e) => e.stopPropagation()}>
                <div className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500" onClick={() => {
                    setIsTooltipUnitOfTimeVisible(!isTooltipUnitOfTimeVisible);
                }}>
                    <TooltipUnitOfTime
                        isVisible={isTooltipUnitOfTimeVisible}
                        setIsVisible={setIsTooltipUnitOfTimeVisible}
                        selectedUnitOfTime={selectedUnitOfTime}
                        setSelectedUnitOfTime={setSelectedUnitOfTime}
                    />
                    <div>{selectedUnitOfTime}</div>
                    <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                </div>

                <div className="my-3 space-y-[10px]">
                    <div className="grid grid-cols-2 items-center gap-2">
                        <div>Days in advance</div>
                        <CustomInput value={unitsInAdvance} setValue={setUnitsInAdvance} />
                    </div>

                    <div className="grid grid-cols-2 items-center gap-2">
                        <div>Remind me at</div>
                        <CustomInput value={unitsInAdvance} setValue={setUnitsInAdvance} />
                    </div>
                </div>

                <div className="text-color-gray-100 mb-2">Remind at 09:00 on Mar 15, 2024.</div>

                <div className="grid grid-cols-2 gap-2 pb-4">
                    <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200" onClick={() => setIsVisible(false)}>Clear</button>
                    <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600" onClick={() => setIsVisible(false)}>Ok</button>
                </div>

            </div>
        </Tooltip>
    );
};

interface CustomInputProps {
    type?: string;
    value: any;
    setValue: React.Dispatch<React.SetStateAction<any>>;
}

const CustomInput: React.FC<CustomInputProps> = ({ type, value, setValue }) => (
    <input
        type={type || "text"}
        className="text-center text-[14px] p-[2px] bg-color-gray-200 placeholder:text-[#7C7C7C] mb-0 w-full resize-none outline-none rounded focus:outline-blue-500"
        placeholder={`+ Add task to "Hello Mobile", press Enter to save.`}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
    />
);

interface TooltipUnitOfTimeProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedUnitOfTime: string;
    setSelectedUnitOfTime: React.Dispatch<React.SetStateAction<string>>;
}

const TooltipUnitOfTime: React.FC<TooltipUnitOfTimeProps> = ({ isVisible, setIsVisible, selectedUnitOfTime, setSelectedUnitOfTime }) => {
    const UNITS_OF_TIME = ['Day', 'Week'];
    return (
        <Tooltip isVisible={isVisible} customClasses={' mb-[-115px] ml-[-10px] p-1 shadow-2xl border border-color-gray-200 rounded-lg'}>
            {UNITS_OF_TIME.map((unitOfTime) => (
                <div
                    className="w-[230px] flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg"
                    onClick={() => {
                        setSelectedUnitOfTime(unitOfTime);
                        setIsVisible(false);
                    }}
                >
                    <div>{unitOfTime}</div>
                    {selectedUnitOfTime === unitOfTime && (
                        <Icon name="check" fill={0} customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'} />
                    )}
                </div>
            ))}
        </Tooltip>
    );
};

export default TooltipReminder;
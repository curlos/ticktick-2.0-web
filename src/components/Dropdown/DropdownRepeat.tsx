import { useRef, useState } from "react";
import Dropdown from "./Dropdown";
import Icon from "../Icon";
import { getDateWithOrdinalAndMonth } from "../../utils/helpers.utils";

const BASIC_REMINDER_OPTIONS = {
    'Daily': {
        getContent: () => (
            <div>Daily</div>
        ),
        checked: false,
    },
    'Weekly': {
        getContent: () => {
            const today = new Date();
            const dayName = today.toLocaleString('en-US', { weekday: 'long' });

            return (
                <div>
                    Weekly <span className="text-color-gray-100">({dayName})</span>
                </div>
            );
        },
        checked: false,
    },
    'Monthly': {
        getContent: () => (
            <div>
                Weekly <span className="text-color-gray-100">({getDateWithOrdinalAndMonth(new Date())})</span>
            </div>
        ),
        checked: false,
    },
    'Yearly': {
        getContent: () => (
            <div>
                Yearly <span className="text-color-gray-100">({getDateWithOrdinalAndMonth(new Date(), true)})</span>
            </div>
        ),
        checked: false,
    },
};

interface DropdownRepeatProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    repeat: string;
    setRepeat: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownRepeat: React.FC<DropdownRepeatProps> = ({ isVisible, setIsVisible, repeat, setRepeat }) => {
    const [basicOptions, setBasicOptions] = useState(BASIC_REMINDER_OPTIONS);
    const [isDropdownCustomRepeatVisible, setIsDropdownCustomRepeatVisible] = useState(false);

    return (
        <Dropdown isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' mt-[-250px] ml-[-5px] shadow-2xl border border-color-gray-200 rounded-lg'}>
            <div className="w-[260px] rounded" onClick={(e) => e.stopPropagation()}>
                <div className="p-1">
                    {Object.keys(basicOptions).map((name: string) => {
                        const values = basicOptions[name];
                        const { getContent, checked } = basicOptions[name];

                        return (
                            <div
                                key={name}
                                className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
                                onClick={() => {
                                    setBasicOptions({
                                        ...basicOptions, [name]: {
                                            ...values, checked: checked
                                        }
                                    });
                                }}
                            >
                                <div>{getContent()}</div>
                                {checked && (
                                    <Icon name="check" fill={0} customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <hr className="border-color-gray-200" />


                <DropdownCustomRepeat isVisible={isDropdownCustomRepeatVisible} setIsVisible={setIsDropdownCustomRepeatVisible} repeat={repeat} setRepeat={setRepeat} />

                <div className="p-1">
                    <div className="p-2 mb-2 flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer" onClick={() => setIsDropdownCustomRepeatVisible(!isDropdownCustomRepeatVisible)}>Custom</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-4 px-3">
                    <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200" onClick={() => setIsVisible(false)}>Cancel</button>
                    <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600" onClick={() => setIsVisible(false)}>Ok</button>
                </div>

            </div>
        </Dropdown>
    );
};

interface DropdownAdvancedReminderProps extends DropdownRepeatProps {

}

const DropdownCustomRepeat: React.FC<DropdownAdvancedReminderProps> = ({ isVisible, setIsVisible, repeat, setRepeat }) => {
    const [selectedUnitOfTime, setSelectedUnitOfTime] = useState('By Due Dates');
    const [isDropdownUnitOfTimeVisible, setIsDropdownUnitOfTimeVisible] = useState(false);
    const [everyUnit, setEveryUnit] = useState(1);
    const [remindAt, setRemindAt] = useState();

    return (
        <Dropdown isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' mt-[-210px] ml-[0px] shadow-2xl border border-color-gray-200 rounded-lg'}>
            <div className=" w-[260px] p-3 rounded" onClick={(e) => e.stopPropagation()}>
                <div className="border border-color-gray-200 rounded py-1 px-[6px] flex justify-between items-center hover:border-blue-500 cursor-pointer" onClick={() => {
                    setIsDropdownUnitOfTimeVisible(!isDropdownUnitOfTimeVisible);
                }}>
                    <CustomDropdown
                        isVisible={isDropdownUnitOfTimeVisible}
                        setIsVisible={setIsDropdownUnitOfTimeVisible}
                        selectedValue={selectedUnitOfTime}
                        setSelectedValue={setSelectedUnitOfTime}
                    />
                    <div>{selectedUnitOfTime}</div>
                    <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                </div>

                <div className="my-3 space-y-[10px]">
                    <div className="grid grid-cols-2 items-center gap-2">
                        <div className="flex justify-between items-center gap-1 text-center text-[14px] rounded w-100 bg-color-gray-200 py-1 px-[6px]">
                            Every
                            <input
                                type="text"
                                className="text-right bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full resize-none outline-none"
                                placeholder={`+ Add task to "Hello Mobile", press Enter to save.`}
                                value={everyUnit}
                                onChange={(e) => setEveryUnit(Number(e.target.value))}
                            />
                        </div>

                        <div className="flex justify-between items-center gap-1 text-center text-[14px] rounded w-100 bg-color-gray-200 py-1 px-[6px]">
                            Week
                        </div>


                    </div>
                </div>

                <div className="text-color-gray-100 mb-2">Remind at 09:00 on Mar 15, 2024.</div>

                <div className="grid grid-cols-2 gap-2 pb-4">
                    <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200" onClick={() => setIsVisible(false)}>Clear</button>
                    <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600" onClick={() => setIsVisible(false)}>Ok</button>
                </div>

            </div>
        </Dropdown>
    );
};

interface DropdownProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedValue: string;
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
}

const CustomDropdown: React.FC<DropdownProps> = ({ isVisible, setIsVisible, selectedValue, setSelectedValue }) => {
    const values = ['By Due Dates', 'By Completion Date', 'By Specific Dates'];

    return (
        <Dropdown isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' w-[100%] mb-[-150px] ml-[-10px] p-1 shadow-2xl border border-color-gray-200 rounded-lg'}>
            {values.map((value) => (
                <div
                    className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
                    onClick={() => {
                        setSelectedValue(value);
                        setIsVisible(false);
                    }}
                >
                    <div>{value}</div>
                    {selectedValue === value && (
                        <Icon name="check" fill={0} customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'} />
                    )}
                </div>
            ))}
        </Dropdown>
    );
};

export default DropdownRepeat;
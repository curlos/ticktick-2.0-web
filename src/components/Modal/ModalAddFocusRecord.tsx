import { useRef, useState } from "react";
import Icon from "../Icon";
import Modal from "./Modal";
import TextareaAutosize from 'react-textarea-autosize';
import Dropdown from "../Dropdown/Dropdown";
import CustomInput from "../CustomInput";
import SelectCalendar from "../SelectCalendar";
import DropdownTime from "../Dropdown/DropdownTIme";
import { useSelector } from "react-redux";
import TaskListByCategory from "../TaskListByCategory";
import { DropdownProps } from "../../interfaces/interfaces";

interface ModalAddFocusRecordProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddFocusRecord: React.FC<ModalAddFocusRecordProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [isDropdownSetTaskVisible, setIsDropdownSetTaskVisible] = useState(false);
    const [isDropdownStartTimeVisible, setIsDropdownStartTimeVisible] = useState(false);
    const [isDropdownEndTimeVisible, setIsDropdownEndTimeVisible] = useState(false);
    const [isDropdownSetFocusTypeAndAmountVisible, setIsDropdownSetFocusTypeAndAmountVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Object | null>(null);
    const [focusNote, setFocusNote] = useState('');

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const dropdownSetTaskRef = useRef(null);
    const dropdownStartTimeCalendarRef = useRef(null);
    const dropdownEndTimeCalendarRef = useRef(null);
    const dropdownSetFocusTypeAndAmountRef = useRef(null);

    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position="top-center">
            <div className="rounded-xl shadow-lg bg-color-gray-650 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[16px]">Add Focus Record</h3>
                    <Icon name="close" customClass={"!text-[20px] text-color-gray-100 hover:text-white cursor-pointer"} onClick={() => setIsModalOpen(false)} />
                </div>

                <div className="space-y-2">
                    {/* Task */}
                    <div className="flex items-center gap-2">
                        <div className="w-[100px]">Task</div>
                        <div
                            ref={dropdownSetTaskRef}
                            className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
                            onClick={() => {
                                setIsDropdownSetTaskVisible(!isDropdownSetTaskVisible);
                            }}>
                            <div className="text-color-gray-100">{selectedTask ? 'Task Selected' : 'Set Task'}</div>
                            <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                        </div>
                    </div>

                    <div className="ml-[115px]">
                        <DropdownSetTask
                            toggleRef={dropdownSetTaskRef}
                            isVisible={isDropdownSetTaskVisible}
                            setIsVisible={setIsDropdownSetTaskVisible}
                            selectedTask={selectedTask}
                            setSelectedTask={setSelectedTask}
                        />
                    </div>

                    {/* Start Time */}
                    <div className="flex items-center gap-2">
                        <div className="w-[100px]">Start Time</div>
                        <div
                            ref={dropdownStartTimeCalendarRef}
                            className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
                            onClick={() => {
                                setIsDropdownStartTimeVisible(!isDropdownStartTimeVisible);
                            }}>
                            <div className="text-color-gray-100">{selectedTask ? 'Task Selected' : '20:30'}</div>
                            <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                        </div>
                    </div>

                    <div className="ml-[115px]">
                        <DropdownTimeCalendar
                            toggleRef={dropdownStartTimeCalendarRef}
                            isVisible={isDropdownStartTimeVisible}
                            setIsVisible={setIsDropdownStartTimeVisible}
                            time={startTime}
                            setTime={setStartTime}
                        />
                    </div>

                    {/* End Time */}
                    <div className="flex items-center gap-2">
                        <div className="w-[100px]">End Time</div>
                        <div
                            ref={dropdownEndTimeCalendarRef}
                            className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
                            onClick={() => {
                                setIsDropdownEndTimeVisible(!isDropdownEndTimeVisible);
                            }}>
                            <div className="text-color-gray-100">{selectedTask ? 'Task Selected' : '21:00'}</div>
                            <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                        </div>
                    </div>

                    <div className="ml-[115px]">
                        <DropdownTimeCalendar
                            toggleRef={dropdownEndTimeCalendarRef}
                            isVisible={isDropdownEndTimeVisible}
                            setIsVisible={setIsDropdownEndTimeVisible}
                            time={endTime}
                            setTime={setEndTime}
                        />
                    </div>

                    {/* Type */}
                    <div className="flex items-center gap-2">
                        <div className="w-[100px]">Type</div>
                        <div
                            ref={dropdownSetFocusTypeAndAmountRef}
                            className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
                            onClick={() => {
                                setIsDropdownSetFocusTypeAndAmountVisible(!isDropdownSetFocusTypeAndAmountVisible);
                            }}
                        >
                            <div className="text-color-gray-100">{selectedTask ? 'Task Selected' : 'Pomo: 0 Pomo'}</div>
                            <Icon name="expand_more" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'} />
                        </div>
                    </div>

                    <div className="ml-[115px]">
                        <DropdownSetFocusTypeAndAmount
                            toggleRef={dropdownSetFocusTypeAndAmountRef}
                            isVisible={isDropdownSetFocusTypeAndAmountVisible}
                            setIsVisible={setIsDropdownSetFocusTypeAndAmountVisible}
                            selectedTask={selectedTask}
                            setSelectedTask={setSelectedTask}
                        />
                    </div>

                    {/* Focus Note */}
                    <div className="flex gap-2">
                        <div className="w-[100px] mt-3">Focus Note</div>

                        <TextareaAutosize className="flex-1 text-[13px] placeholder:text-[#7C7C7C] mt-2 mb-4 bg-transparent outline-none resize-none border border-color-gray-200 rounded p-2 hover:border-blue-500 min-h-[120px]" placeholder="What do you have in mind?" value={focusNote} onChange={(e) => setFocusNote(e.target.value)}></TextareaAutosize>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]" onClick={() => {
                        setIsModalOpen(false);
                    }}>Close</button>
                    <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]" onClick={() => {
                        setIsModalOpen(false);
                    }}>Ok</button>
                </div>
            </div>
        </Modal>
    );
};

interface DropdownSetFocusTypeAndAmountProps extends DropdownProps {
    selectedTask: Object | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Object | null>>;
}

const DropdownSetFocusTypeAndAmount: React.FC<DropdownSetFocusTypeAndAmountProps> = ({ toggleRef, isVisible, setIsVisible, selectedTask, setSelectedTask }) => {
    const [selectedButton, setSelectedButton] = useState('pomo');
    const sharedButtonStyle = `text-[12px] py-1 px-3 rounded-3xl cursor-pointer`;
    const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
    const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666] bg-color-gray-300`;

    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' w-[250px] mb-[-155px] ml-[-10px] p-1 shadow-2xl border border-color-gray-200 rounded-lg p-2'}>
            <div className="flex justify-center gap-1">
                <div className={selectedButton === 'pomo' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('pomo')}>Pomo</div>
                <div className={selectedButton === 'stopwatch' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('stopwatch')}>Stopwatch</div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
                {selectedButton === 'pomo' ? (
                    <div className="flex items-end gap-2">
                        <CustomInput value={0} customClasses="w-[60px]" />
                        <div>pomos</div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-end gap-2">
                            <CustomInput value={0} customClasses="w-[60px]" />
                            <div>hours</div>
                        </div>
                        <div className="flex items-end gap-2">
                            <CustomInput value={0} customClasses="w-[60px]" />
                            <div>mins</div>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200" onClick={() => {
                    setIsVisible(false);
                }}>Cancel</button>
                <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600" onClick={() => {
                    setIsVisible(false);
                }}>Ok</button>
            </div>
        </Dropdown>
    );
};

interface DropdownTimeCalendarProps extends DropdownProps {
    time: Date | null;
    setTime: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DropdownTimeCalendar: React.FC<DropdownTimeCalendarProps> = ({ toggleRef, isVisible, setIsVisible, time, setTime }) => {

    const [isDropdownTimeVisible, setIsDropdownTimeVisible] = useState(false);
    const dropdownTimeRef = useRef(null);

    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' w-[250px] mb-[-155px] ml-[-10px] p-1 shadow-2xl border border-color-gray-200 rounded-lg'}>

            <div className="pt-2">
                <SelectCalendar dueDate={time} setDueDate={setTime} />
            </div>

            <div className="mb-2 px-2">
                <div
                    ref={dropdownTimeRef}
                    className="text-center text-[14px] p-1 bg-color-gray-200 placeholder:text-[#7C7C7C] mb-0 w-full resize-none outline-none rounded hover:outline-blue-500 cursor-pointer"
                    onClick={() => setIsDropdownTimeVisible(!isDropdownTimeVisible)}
                >
                    20:30
                </div>
            </div>

            <DropdownTime toggleRef={dropdownTimeRef} isVisible={isDropdownTimeVisible} setIsVisible={setIsDropdownTimeVisible} showTimeZoneOption={false} customClasses="mt-[-295px] !ml-[-11px]" />

            <div className="grid grid-cols-2 gap-2 p-2">
                <button className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200" onClick={() => {
                    setIsVisible(false);
                }}>Cancel</button>
                <button className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600" onClick={() => {
                    setIsVisible(false);
                }}>Ok</button>
            </div>
        </Dropdown>
    );
};

interface DropdownSetTaskProps extends DropdownProps {
    selectedTask: Object | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Object | null>>;
}

const DropdownSetTask: React.FC<DropdownSetTaskProps> = ({ toggleRef, isVisible, setIsVisible, selectedTask, setSelectedTask }) => {
    const allTasks = useSelector((state) => state.tasks.tasksById);

    const [selectedButton, setSelectedButton] = useState('Recent');
    const [selectedFocusRecordTask, setSelectedFocusRecordTask] = useState(null);
    const [isDropdownTimeVisible, setIsDropdownTimeVisible] = useState(false);

    const sharedButtonStyle = `text-[12px] py-1 px-3 rounded-3xl cursor-pointer`;
    const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
    const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666] bg-color-gray-300`;

    return (
        <Dropdown toggleRef={toggleRef} isVisible={isVisible} setIsVisible={setIsVisible} customClasses={' w-[300px] mb-[-155px] ml-[-10px] p-1 shadow-2xl border border-color-gray-200 rounded-lg p-3'}>
            <div className="flex justify-center gap-1">
                <div className={selectedButton === 'Recent' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('Recent')}>Recent</div>
                <div className={selectedButton === 'Task' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('Task')}>Task</div>
            </div>

            <div className="bg-color-gray-200 rounded flex items-center gap-2 p-[6px] my-2">
                <Icon name="search" customClass={"!text-[20px] text-color-gray-100 hover:text-white cursor-pointer"} />

                <input placeholder="Search" className="bg-transparent outline-none" />
            </div>

            <div className="flex items-center gap-[2px] mt-4 mb-3">
                <Icon name="today" customClass={"!text-[20px] text-color-gray-100 hover:text-white cursor-pointer"} />
                <div>Today</div>
                <Icon name="chevron_right" customClass={"!text-[20px] text-color-gray-100 hover:text-white cursor-pointer"} />
            </div>

            <div className="space-y-2 h-[300px] gray-scrollbar overflow-auto">
                <TaskListByCategory tasks={allTasks} selectedFocusRecordTask={selectedFocusRecordTask} setSelectedFocusRecordTask={setSelectedFocusRecordTask} />
            </div>

            {/* <div className="mb-2 px-2">
                <div className="text-center text-[14px] p-1 bg-color-gray-200 placeholder:text-[#7C7C7C] mb-0 w-full resize-none outline-none rounded hover:outline-blue-500 cursor-pointer" onClick={() => setIsDropdownTimeVisible(!isDropdownTimeVisible)}>
                    20:30
                </div>
            </div>

            <DropdownTime isTimeDropdownVisibile={isDropdownTimeVisible} setIsTimeDropdownVisible={setIsDropdownTimeVisible} showTimeZoneOption={false} customClasses="mt-[-295px]" /> */}
        </Dropdown>
    );
};

export default ModalAddFocusRecord;
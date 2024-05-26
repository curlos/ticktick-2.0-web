import { useState } from 'react';
import { DropdownProps } from '../../../interfaces/interfaces';
import { useGetTasksQuery } from '../../../services/api';
import Icon from '../../Icon';
import TaskListByCategory from '../../TaskListByCategory';
import Dropdown from '../Dropdown';

interface DropdownSetTaskProps extends DropdownProps {
	selectedTask: Object | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<Object | null>>;
}

const DropdownSetTask: React.FC<DropdownSetTaskProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedTask,
	setSelectedTask,
}) => {
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	const [selectedButton, setSelectedButton] = useState('Recent');
	const [selectedFocusRecordTask, setSelectedFocusRecordTask] = useState(null);
	const [isDropdownTimeVisible, setIsDropdownTimeVisible] = useState(false);

	const sharedButtonStyle = `text-[12px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
	const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666] bg-color-gray-300`;

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={
				' w-[300px] mb-[-155px] ml-[-10px] p-1 shadow-2xl border border-color-gray-200 rounded-lg p-3'
			}
		>
			<div className="flex justify-center gap-1">
				<div
					className={selectedButton === 'Recent' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setSelectedButton('Recent')}
				>
					Recent
				</div>
				<div
					className={selectedButton === 'Task' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setSelectedButton('Task')}
				>
					Task
				</div>
			</div>

			<div className="bg-color-gray-200 rounded flex items-center gap-2 p-[6px] my-2">
				<Icon name="search" customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'} />

				<input placeholder="Search" className="bg-transparent outline-none" />
			</div>

			<div className="flex items-center gap-[2px] mt-4 mb-3">
				<Icon name="today" customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'} />
				<div>Today</div>
				<Icon
					name="chevron_right"
					customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
				/>
			</div>

			<div className="space-y-2 h-[300px] gray-scrollbar overflow-auto">
				<TaskListByCategory
					tasks={tasks}
					selectedFocusRecordTask={selectedFocusRecordTask}
					setSelectedFocusRecordTask={setSelectedFocusRecordTask}
				/>
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

export default DropdownSetTask;

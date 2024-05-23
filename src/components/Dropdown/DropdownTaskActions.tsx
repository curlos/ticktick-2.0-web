import Dropdown from './Dropdown';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import { DropdownProps, TaskObj } from '../../interfaces/interfaces';
import { useEditTaskMutation } from '../../services/api';
import { PRIORITIES } from '../../utils/priorities.utils';
import classNames from 'classnames';
import { isInXDaysUTC, isTodayUTC, isTomorrowUTC } from '../../utils/date.utils';
import DropdownCalendar from './DropdownCalendar';

interface IDateIconOption {
	iconName: string;
	tooltipText: string;
	selected: boolean;
	onClick?: () => void;
	task: TaskObj;
	dueDate: Date | null;
	setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
	showDropdownCalendar?: boolean;
	onCloseContextMenu?: () => void;
}

const DateIconOption: React.FC<IDateIconOption> = ({
	iconName,
	tooltipText,
	selected,
	onClick,
	task,
	dueDate,
	setDueDate,
	showDropdownCalendar,
	onCloseContextMenu,
}) => {
	// useState
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);
	const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);

	// useRef
	const tooltipRef = useRef(null);
	const dropdownCalendarToggleRef = useRef(null);

	useEffect(() => {
		setIsDropdownCalendarVisible(false);
	}, [task]);

	const handleOnClick = () => {
		if (onClick && tooltipText !== 'Custom') {
			onClick();
		}

		// TODO: Add functionality for "Custom" icon.
		setIsDropdownCalendarVisible(!isDropdownCalendarVisible);
	};

	const mergeRefs = (...refs) => {
		const filteredRefs = refs.filter(Boolean);
		return (inst) => {
			for (const ref of filteredRefs) {
				if (typeof ref === 'function') {
					ref(inst);
				} else if (ref) {
					ref.current = inst;
				}
			}
		};
	};

	const combinedRef = useCallback(mergeRefs(tooltipRef, dropdownCalendarToggleRef), []);

	return (
		<div className={classNames('relative')}>
			<Icon
				toggleRef={combinedRef}
				name={iconName}
				fill={0}
				customClass={classNames(
					'text-color-gray-50 !text-[22px] hover:text-white hover:bg-color-gray-200 rounded cursor-pointer p-1',
					selected ? 'bg-gray-700' : ''
				)}
				onClick={handleOnClick}
				onMouseOver={() => setIsTooltipVisible(true)}
				onMouseLeave={() => setIsTooltipVisible(false)}
			/>
			<Dropdown
				toggleRef={tooltipRef}
				isVisible={isTooltipVisible}
				setIsVisible={setIsTooltipVisible}
				customClasses={' !bg-black'}
			>
				<div className="p-2 text-[12px] text-nowrap">{tooltipText}</div>
			</Dropdown>

			{showDropdownCalendar && (
				<DropdownCalendar
					toggleRef={dropdownCalendarToggleRef}
					isVisible={isDropdownCalendarVisible}
					setIsVisible={setIsDropdownCalendarVisible}
					task={task}
					currDueDate={dueDate}
					setCurrDueDate={setDueDate}
					customClasses=" !ml-[0px] mt-[15px]"
					showDateIcons={false}
					onCloseContextMenu={onCloseContextMenu}
				/>
			)}
		</div>
	);
};

interface IDateIconOptionList {
	dueDate: Date | null;
	setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
	handleEditDate: (dateToEdit: Date | null) => void;
	task: TaskObj;
	onCloseContextMenu?: () => void;
}

const DateIconOptionList: React.FC<IDateIconOptionList> = ({
	dueDate,
	setDueDate,
	handleEditDate,
	task,
	onCloseContextMenu,
}) => {
	const today = new Date();

	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const sevenDaysFromNow = new Date(today);
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

	const isDueDateToday = isTodayUTC(dueDate);
	const isDueDateTomorrow = isTomorrowUTC(dueDate);
	const isDueDateIn7Days = isInXDaysUTC(dueDate, 7);

	return (
		<div className="flex justify-between items-center gap-1 my-2">
			<DateIconOption
				iconName="sunny"
				tooltipText="Today"
				selected={isDueDateToday}
				onClick={() => handleEditDate(today)}
				task={task}
			/>
			<DateIconOption
				iconName="wb_twilight"
				tooltipText="Tomorrow"
				selected={isDueDateTomorrow}
				onClick={() => handleEditDate(tomorrow)}
				task={task}
			/>
			<DateIconOption
				iconName="event_upcoming"
				tooltipText="Next Week"
				selected={isDueDateIn7Days}
				onClick={() => handleEditDate(sevenDaysFromNow)}
				task={task}
			/>
			<DateIconOption
				iconName="calendar_month"
				tooltipText="Custom"
				task={task}
				dueDate={dueDate}
				setDueDate={setDueDate}
				showDropdownCalendar={true}
				onCloseContextMenu={onCloseContextMenu}
			/>
			{dueDate && (
				<DateIconOption
					iconName="event_busy"
					tooltipText="Clear"
					onClick={() => {
						handleEditDate(null);
					}}
					task={task}
				/>
			)}
		</div>
	);
};

interface DropdownTaskActionsProps extends DropdownProps {
	task: TaskObj;
	currDueDate: Date | null;
	setCurrDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
	onCloseContextMenu: () => void;
}

const DropdownTaskActions: React.FC<DropdownTaskActionsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	task,
	currDueDate,
	setCurrDueDate,
	customClasses,
	customStyling,
	onCloseContextMenu,
}) => {
	const [editTask] = useEditTaskMutation();

	if (!task) {
		return null;
	}

	const handleEditDate = (newDueDate: Date | null) => {
		setCurrDueDate(newDueDate);
		editTask({ taskId: task._id, payload: { dueDate: newDueDate } });
		onCloseContextMenu();
	};

	interface ITaskAction {
		iconName: string;
		title: string;
	}

	const TaskAction: React.FC<ITaskAction> = ({ iconName, title }) => {
		return (
			<div className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer rounded text-[13px]">
				<Icon
					name={iconName}
					customClass={'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'}
					fill={0}
				/>
				<div>{title}</div>
			</div>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={' shadow-2xl' + (customClasses ? ` ${customClasses}` : '')}
			customStyling={customStyling ? customStyling : null}
		>
			<div className="w-[200px]">
				<div className="p-4 pb-0">
					Date
					<DateIconOptionList
						dueDate={currDueDate}
						setDueDate={setCurrDueDate}
						handleEditDate={handleEditDate}
						task={task}
						onCloseContextMenu={onCloseContextMenu}
					/>
				</div>

				<div className="p-4 pt-0">
					Priority
					<div className="flex justify-between items-center gap-1 mt-2">
						{Object.values(PRIORITIES).map((priority) => {
							return (
								<span key={priority.backendValue}>
									<Icon
										name="flag"
										customClass={classNames(
											'!text-[22px] cursor-pointer p-1 rounded',
											priority.textFlagColor,
											task.priority === priority.backendValue ? 'bg-gray-700' : ''
										)}
									/>
								</span>
							);
						})}
					</div>
				</div>

				<hr className="border-color-gray-200" />

				<div className="p-1">
					<TaskAction iconName="add_task" title="Add Subtask" />
					<TaskAction iconName="disabled_by_default" title="Won't Do" />
					<TaskAction iconName="move_to_inbox" title="Move to" />
				</div>

				<hr className="border-color-gray-200" />

				<div className="p-1">
					<TaskAction iconName="link" title="Copy Link" />
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

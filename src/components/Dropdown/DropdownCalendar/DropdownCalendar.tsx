import Dropdown from '../Dropdown';
import { useEffect, useRef, useState } from 'react';
import Icon from '../../Icon';
import DropdownTime from './DropdownTime';
import DropdownReminder from './DropdownReminder';
import DropdownRepeat from './DropdownRepeat';
import SelectCalendar from '../../SelectCalendar';
import { DropdownProps, TaskObj } from '../../../interfaces/interfaces';
import { useEditTaskMutation } from '../../../services/api';
import classNames from 'classnames';

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
			<Icon
				toggleRef={dropdownRef}
				name={iconName}
				fill={0}
				customClass="text-color-gray-50 !text-[24px] hover:text-white hover:bg-color-gray-200 p-1 rounded cursor-pointer"
				onClick={onClick}
				onMouseOver={() => setIsDropdownVisible(true)}
				onMouseLeave={() => setIsDropdownVisible(false)}
			/>
			<Dropdown
				toggleRef={dropdownRef}
				isVisible={isDropdownVisible}
				setIsVisible={setIsDropdownVisible}
				customClasses={'!bg-black'}
			>
				<div className="p-2 text-[12px] text-nowrap">{DropdownText}</div>
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
		<div className="mt-3 flex justify-between">
			<BigDateIconOption
				iconName="sunny"
				DropdownText="Today"
				onClick={() => {
					setDueDate(today);
				}}
			/>
			<BigDateIconOption
				iconName="wb_twilight"
				DropdownText="Tomorrow"
				onClick={() => {
					setDueDate(tomorrow);
				}}
			/>
			<BigDateIconOption
				iconName="event_upcoming"
				DropdownText="Next Week"
				onClick={() => {
					setDueDate(nextWeek);
				}}
			/>
			<BigDateIconOption
				iconName="clear_night"
				DropdownText="Next Month"
				onClick={() => {
					setDueDate(nextMonth);
				}}
			/>
		</div>
	);
};

const getInitialTime = (currDueDate) => {
	if (currDueDate) {
		const parsedDate = new Date(currDueDate);
		const formattedTime = parsedDate.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});

		return formattedTime;
	}

	return null;
};

interface DropdownPrioritiesProps extends DropdownProps {
	task: TaskObj;
	currDueDate: Date | null;
	setCurrDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
	customClasses?: string;
	showDateIcons?: boolean;
	onCloseContextMenu?: () => void;
}

const DropdownCalendar: React.FC<DropdownPrioritiesProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	task,
	currDueDate,
	setCurrDueDate,
	customClasses,
	customStyling,
	showDateIcons = true,
	onCloseContextMenu,
}) => {
	const [editTask] = useEditTaskMutation();

	const [selectedView, setSelectedView] = useState('date');
	// TODO: Get time from curr due Date - Don't use useEffect
	const [selectedTime, setSelectedTime] = useState(getInitialTime(currDueDate));
	const [isDropdownTimeVisible, setIsDropdownTimeVisible] = useState(false);
	const [isDropdownReminderVisible, setIsDropdownReminderVisible] = useState(false);
	const [isDropdownRepeatVisible, setIsDropdownRepeatVisible] = useState(false);
	const [reminder, setReminder] = useState('');
	const [repeat, setRepeat] = useState('');

	const dropdownTimeRef = useRef(null);
	const dropdownReminderRef = useRef(null);
	const dropdownRepeatRef = useRef(null);

	useEffect(() => {
		const dueDate = currDueDate ? currDueDate : new Date();
		const newDateObject = setTimeOnDateString(dueDate, selectedTime);
		console.log(newDateObject);
		setCurrDueDate(newDateObject);
	}, [selectedTime]);

	console.log(currDueDate);

	interface TimeOptionProps {
		name: string;
		iconName: string;
		onClick?: () => void;
		toggleRef: React.MutableRefObject<null>;
		selectedValue: any;
		setSelectedValue: any;
	}

	const TimeOption: React.FC<TimeOptionProps> = ({
		name,
		iconName,
		onClick,
		toggleRef,
		selectedValue,
		setSelectedValue,
	}) => {
		const [isHovering, setIsHovering] = useState(false);

		return (
			<div
				ref={toggleRef}
				className={classNames(
					'flex items-center justify-between h-[40px] px-2 text-[13px] hover:bg-color-gray-200 rounded cursor-pointer',
					selectedValue ? 'text-blue-500' : 'text-color-gray-25'
				)}
				onClick={onClick}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				<div className="flex items-center gap-1">
					<Icon
						name={iconName}
						fill={0}
						customClass={classNames(
							'!text-[18px] cursor-pointer',
							selectedValue ? 'text-blue-500' : 'text-color-gray-50'
						)}
					/>
					<div>{name}</div>
				</div>

				{isHovering && selectedValue ? (
					<Icon
						name="close"
						fill={0}
						customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						onClick={(e) => {
							e.stopPropagation();
							setSelectedValue(null);
						}}
					/>
				) : (
					<Icon
						name="chevron_right"
						fill={0}
						customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
					/>
				)}
			</div>
		);
	};

	const setTimeOnDateString = (dateString, timeString) => {
		// Parse the existing date string to get a Date object
		const date = new Date(dateString);

		// Function to check if the date is in DST for Eastern Time
		const isDST = (date) => {
			const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
			const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
			return date.getTimezoneOffset() < Math.max(jan, jul);
		};

		if (timeString) {
			// Extract hours and minutes from the time string (formatted as "HH:mm AM/PM")
			const [time, period] = timeString.split(' ');
			let [hours, minutes] = time.split(':');
			hours = parseInt(hours);
			minutes = parseInt(minutes);

			// Convert 12-hour format to 24-hour if necessary
			if (period === 'PM' && hours !== 12) {
				hours += 12;
			} else if (period === 'AM' && hours === 12) {
				hours = 0;
			}

			// Set the desired time on the existing date object
			date.setHours(hours, minutes, 0, 0);
		} else {
			// Determine if DST is in effect for the date
			const dstActive = isDST(date);
			const utcOffset = dstActive ? 4 : 5; // DST: UTC-4, otherwise UTC-5

			// Set time to 12:00 AM EST/EDT, adjusted for DST
			date.setUTCHours(0 + utcOffset, 0, 0, 0); // Sets to 12:00 AM EST
		}

		return date;
	};

	console.log(currDueDate);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl select-none', customClasses)}
			customStyling={customStyling ? customStyling : null}
		>
			<div className="w-[260px]">
				<div className="p-4 pb-3">
					<div className="grid grid-cols-2 bg-color-gray-700 rounded-md p-1 text-center">
						<div
							className={'rounded-md p-[2px]' + (selectedView === 'date' ? ' bg-color-gray-600' : '')}
							onClick={() => setSelectedView('date')}
						>
							Date
						</div>
						<div
							className={'rounded-md p-[2px]' + (selectedView === 'duration' ? ' bg-color-gray-600' : '')}
							onClick={() => setSelectedView('duration')}
						>
							Duration
						</div>
					</div>

					{showDateIcons && <BigDateIconOptionList dueDate={currDueDate} setDueDate={setCurrDueDate} />}
				</div>

				<SelectCalendar dueDate={currDueDate} setDueDate={setCurrDueDate} />

				<div className="px-1 mb-4">
					{/* Time */}
					<div className="relative">
						<DropdownTime
							toggleRef={dropdownTimeRef}
							isVisible={isDropdownTimeVisible}
							setIsVisible={setIsDropdownTimeVisible}
							selectedTime={selectedTime}
							setSelectedTime={setSelectedTime}
							currDueDate={currDueDate}
							setCurrDueDate={setCurrDueDate}
						/>
						<TimeOption
							toggleRef={dropdownTimeRef}
							name={selectedTime ? selectedTime : 'Time'}
							iconName="schedule"
							selectedValue={selectedTime}
							setSelectedValue={setSelectedTime}
							onClick={() => {
								setIsDropdownTimeVisible(!isDropdownTimeVisible);
							}}
						/>
					</div>

					{/* Reminder */}
					<div className="relative">
						<DropdownReminder
							toggleRef={dropdownReminderRef}
							isVisible={isDropdownReminderVisible}
							setIsVisible={setIsDropdownReminderVisible}
							reminder={reminder}
							setReminder={setReminder}
						/>
						<TimeOption
							toggleRef={dropdownReminderRef}
							name="Reminder"
							iconName="alarm"
							onClick={() => setIsDropdownReminderVisible(!isDropdownReminderVisible)}
						/>
					</div>

					{/* Repeat */}
					<div className="relative">
						<DropdownRepeat
							toggleRef={dropdownRepeatRef}
							isVisible={isDropdownRepeatVisible}
							setIsVisible={setIsDropdownRepeatVisible}
							repeat={repeat}
							setRepeat={setRepeat}
						/>
						<TimeOption
							toggleRef={dropdownRepeatRef}
							name="Repeat"
							iconName="repeat"
							onClick={() => setIsDropdownRepeatVisible(!isDropdownRepeatVisible)}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2 px-3 pb-4">
					<button
						className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200"
						onClick={() => {
							setCurrDueDate(null);
							setSelectedTime(null);
							setIsVisible(false);

							if (task) {
								editTask({ taskId: task._id, payload: { dueDate: null } });
							}

							if (onCloseContextMenu) {
								onCloseContextMenu();
							}
						}}
					>
						Clear
					</button>
					<button
						className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600"
						onClick={() => {
							if (task) {
								editTask({ taskId: task._id, payload: { dueDate: currDueDate } });
							}

							setIsVisible(false);

							if (onCloseContextMenu) {
								onCloseContextMenu();
							}
						}}
					>
						Ok
					</button>
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownCalendar;

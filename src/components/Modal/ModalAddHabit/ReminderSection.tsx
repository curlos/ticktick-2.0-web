import { useRef, useState } from 'react';
import Icon from '../../Icon';
import { getCurrentTimeString, setTimeOnDateString } from '../../../utils/date.utils';
import DropdownTime from '../../Dropdown/DropdownCalendar/DropdownTime';
import classNames from 'classnames';

const ReminderSection = () => {
	const currentDate = new Date();
	const newDateObject = setTimeOnDateString(currentDate, getCurrentTimeString());

	const [reminderList, setReminderList] = useState([newDateObject, newDateObject]);

	const TimeOptionWithDropdown = ({ reminderTime }) => {
		const dropdownTimeRef = useRef(null);
		const [isDropdownTimeVisible, setIsDropdownTimeVisible] = useState(false);
		const [selectedTime, setSelectedTime] = useState(getCurrentTimeString());
		const [isHovering, setIsHovering] = useState(false);

		const TimeOption = () => {
			return (
				<div className="">
					<div
						ref={dropdownTimeRef}
						onClick={() => setIsDropdownTimeVisible(!isDropdownTimeVisible)}
						className={
							'flex items-center gap-1 border border-color-gray-200 hover:border-blue-500 rounded p-1 cursor-pointer'
						}
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}
					>
						<Icon
							name="alarm"
							fill={0}
							customClass={classNames(
								'!text-[18px] cursor-pointer',
								selectedTime ? 'text-blue-500' : 'text-color-gray-50'
							)}
						/>
						<div>{selectedTime}</div>

						<div
							onClick={() => {
								const newReminderList = reminderList.filter((reminder) => {
									return reminder !== reminderTime;
								});

								setReminderList(newReminderList);
							}}
							className={classNames(
								'absolute right-0 mt-[-20px] mr-[-6px]',
								isHovering ? 'visible' : 'invisible'
							)}
						>
							<Icon
								name="close"
								fill={0}
								customClass={
									'text-color-gray-50 bg-gray-600 rounded-full !text-[14px] bg-white cursor-pointer'
								}
							/>
						</div>
					</div>
				</div>
			);
		};

		return (
			<div className="relative">
				{reminderTime ? (
					<TimeOption
						name={selectedTime ? selectedTime : 'Time'}
						iconName="schedule"
						selectedValue={selectedTime}
						setSelectedValue={setSelectedTime}
						onClick={() => {
							setIsDropdownTimeVisible(!isDropdownTimeVisible);
						}}
					/>
				) : (
					<div
						ref={dropdownTimeRef}
						onClick={() => {
							const currentDate = new Date();
							const newDateObject = setTimeOnDateString(currentDate, selectedTime);

							setIsDropdownTimeVisible(!isDropdownTimeVisible);
							setReminderList([...reminderList, newDateObject]);
						}}
						className="border border-color-gray-200 hover:border-blue-500 p-1 px-4 flex items-center justify-center h-full cursor-pointer"
					>
						<Icon name="add" fill={0} customClass={classNames('!text-[18px] cursor-pointer')} />
					</div>
				)}

				<DropdownTime
					toggleRef={dropdownTimeRef}
					isVisible={isDropdownTimeVisible}
					setIsVisible={setIsDropdownTimeVisible}
					selectedTime={selectedTime}
					setSelectedTime={setSelectedTime}
				/>
			</div>
		);
	};

	return (
		<div>
			<div className="flex items-center">
				<div className="w-[96px]">Reminder</div>
				<div className="flex-1">
					<div className="grid grid-cols-3 gap-2">
						{reminderList.map((reminder) => (
							<TimeOptionWithDropdown reminderTime={reminder} />
						))}

						<TimeOptionWithDropdown />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReminderSection;

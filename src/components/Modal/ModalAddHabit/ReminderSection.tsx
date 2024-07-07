import { useEffect, useRef, useState } from 'react';
import Icon from '../../Icon';
import {
	areTimesEqual,
	getCurrentTimeString,
	getFormattedTimeString,
	setTimeOnDateString,
} from '../../../utils/date.utils';
import DropdownTime from '../../Dropdown/DropdownCalendar/DropdownTime';
import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setAlertState } from '../../../slices/alertSlice';

const ReminderSection = ({ reminderList, setReminderList }) => {
	const dispatch = useDispatch();

	const TimeOptionWithDropdown = ({ reminderTime }) => {
		const isNewReminder = !reminderTime;

		const dropdownTimeRef = useRef(null);
		const [isDropdownTimeVisible, setIsDropdownTimeVisible] = useState(false);
		const [dropdownTimeWasVisible, setDropdownTimeWasVisible] = useState(false);
		const [selectedTime, setSelectedTime] = useState(
			reminderTime ? getFormattedTimeString(reminderTime) : getCurrentTimeString()
		);
		const [isHovering, setIsHovering] = useState(false);
		const [showPlus, setShowPlus] = useState(isNewReminder);

		const TimeOption = () => {
			useEffect(() => {
				// If the user is adding a NEW reminder and the dropdown time was just closed (I know it's just closed if "isDropdownTimeVisible" === false and dropdownTimeWasVisible === true because "dropdownTimeWasVisible" is one state behind "isDropdownTimeVisible".) I have to do it this way in the useEffect because the dropdown is only closed when the user clicks outside of it, not by clicking a button. So, unless I go into the "Dropdown" code itself where it's detecting outside clicks, that'll be impossible.
				if (isNewReminder && !isDropdownTimeVisible && dropdownTimeWasVisible) {
					const newDate = new Date();
					const newDateObject = setTimeOnDateString(newDate, selectedTime);
					const isDuplicate = reminderList.find((reminder) => areTimesEqual(reminder, newDateObject));

					if (isDuplicate) {
						setReminderList([...reminderList]);

						dispatch(
							setAlertState({
								alertId: 'AlertGeneralMessage',
								isOpen: true,
								props: {
									message: "You've set a reminder for this time already.",
								},
							})
						);
					} else {
						// If not a duplicate reminder, then, add it to the list.
						setReminderList([...reminderList, newDateObject]);
					}
				} else if (isNewReminder && isDropdownTimeVisible) {
					setDropdownTimeWasVisible(true);
				}
			}, [isDropdownTimeVisible]);

			return (
				<div className="h-full">
					<div
						ref={dropdownTimeRef}
						onClick={() => {
							setIsDropdownTimeVisible(!isDropdownTimeVisible);

							if (showPlus) {
								setShowPlus(false);
							}
						}}
						className="flex justify-center items-center gap-1 border border-color-gray-200 hover:border-blue-500 rounded p-1 cursor-pointer h-full"
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}
					>
						{!showPlus ? (
							<React.Fragment>
								<Icon
									name="alarm"
									fill={0}
									customClass={classNames(
										'!text-[18px] cursor-pointer',
										selectedTime ? 'text-blue-500' : 'text-color-gray-50'
									)}
								/>
								<div>{selectedTime}</div>
							</React.Fragment>
						) : (
							<Icon name="add" fill={0} customClass={classNames('!text-[18px] cursor-pointer')} />
						)}

						<div
							onClick={() => {
								const newReminderList = reminderList.filter((reminder) => {
									return reminder !== reminderTime;
								});

								setReminderList(newReminderList);
							}}
							className={classNames(
								'absolute right-0 mt-[-20px] mr-[-6px]',
								isHovering && reminderTime ? 'visible' : 'invisible'
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
				<TimeOption
					name={selectedTime ? selectedTime : 'Time'}
					iconName="schedule"
					selectedValue={selectedTime}
					setSelectedValue={setSelectedTime}
					onClick={() => {
						setIsDropdownTimeVisible(!isDropdownTimeVisible);
					}}
				/>

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
							<TimeOptionWithDropdown key={reminder.toLocaleDateString()} reminderTime={reminder} />
						))}

						{/* New Reminder with "+" icon. */}
						<TimeOptionWithDropdown />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReminderSection;

import { useState, useRef, useEffect } from 'react';
import { DropdownProps } from '../../../interfaces/interfaces';
import SelectCalendar from '../../SelectCalendar';
import Dropdown from '../Dropdown';
import DropdownTime from '../DropdownCalendar/DropdownTime';
import { getTimeString, setTimeOnDateString } from '../../../utils/date.utils';

interface DropdownTimeCalendarProps extends DropdownProps {
	date: Date | null;
	setDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DropdownTimeCalendar: React.FC<DropdownTimeCalendarProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	date,
	setDate,
	showTime = true,
}) => {
	// TODO: Get default date of today
	const [selectedTime, setSelectedTime] = useState(getTimeString(date));
	const [selectedDate, setSelectedDate] = useState(null);
	const [isDropdownTimeVisible, setIsDropdownTimeVisible] = useState(false);
	const dropdownTimeRef = useRef(null);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'w-[250px] p-1 shadow-2xl border border-color-gray-200 rounded-lg'}
		>
			<div className="pt-2">
				<SelectCalendar dueDate={selectedDate} setDueDate={setSelectedDate} time={selectedTime} />
			</div>

			{showTime && (
				<div className="relative">
					<div className="mb-2 px-2">
						<div
							ref={dropdownTimeRef}
							className="text-center text-[14px] p-1 bg-color-gray-200 placeholder:text-[#7C7C7C] mb-0 w-full resize-none outline-none rounded hover:outline-blue-500 cursor-pointer"
							onClick={() => setIsDropdownTimeVisible(!isDropdownTimeVisible)}
						>
							{selectedTime}
						</div>
					</div>

					<DropdownTime
						toggleRef={dropdownTimeRef}
						isVisible={isDropdownTimeVisible}
						setIsVisible={setIsDropdownTimeVisible}
						selectedTime={selectedTime}
						setSelectedTime={setSelectedTime}
						showTimeZoneOption={false}
						customClasses="mt-[10px]"
					/>
				</div>
			)}

			<div className="grid grid-cols-2 gap-2 p-2">
				<button
					className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200"
					onClick={() => {
						setIsVisible(false);
					}}
				>
					Cancel
				</button>
				<button
					className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600"
					onClick={() => {
						let newDueDate = selectedDate ? selectedDate : new Date();

						if (selectedTime) {
							const newDateObject = setTimeOnDateString(newDueDate, selectedTime);
							newDueDate = newDateObject;
						}

						setDate(newDueDate);
						setIsVisible(false);
					}}
				>
					Ok
				</button>
			</div>
		</Dropdown>
	);
};

export default DropdownTimeCalendar;

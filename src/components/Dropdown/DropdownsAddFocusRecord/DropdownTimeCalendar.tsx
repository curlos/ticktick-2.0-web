import { useState, useRef } from 'react';
import { DropdownProps } from '../../../interfaces/interfaces';
import SelectCalendar from '../../SelectCalendar';
import Dropdown from '../Dropdown';
import DropdownTime from '../DropdownCalendar/DropdownTime';

interface DropdownTimeCalendarProps extends DropdownProps {
	time: Date | null;
	setTime: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DropdownTimeCalendar: React.FC<DropdownTimeCalendarProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	time,
	setTime,
}) => {
	const [selectedTime, setSelectedTime] = useState(null);
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
				<SelectCalendar dueDate={time} setDueDate={setTime} />
			</div>

			<div className="relative">
				<div className="mb-2 px-2">
					<div
						ref={dropdownTimeRef}
						className="text-center text-[14px] p-1 bg-color-gray-200 placeholder:text-[#7C7C7C] mb-0 w-full resize-none outline-none rounded hover:outline-blue-500 cursor-pointer"
						onClick={() => setIsDropdownTimeVisible(!isDropdownTimeVisible)}
					>
						20:30
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

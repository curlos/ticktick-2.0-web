import { useRef, useState } from 'react';
import Icon from '../../Icon';
import DropdownTimeIntervals from './DropdownTimeIntervals';

const TimeIntervalsButtonAndDropdown = () => {
	const dropdownTimeIntervalRef = useRef(null);
	const [isDropdownTimeIntervalsVisible, setIsDropdownTimeIntervalsVisible] = useState(false);
	const [selectedTimeInterval, setSelectedTimeInterval] = useState('Day');

	return (
		<div className="relative">
			<div
				className="flex gap-[2px] items-center px-2 py-[2px] pl-3 border border-color-gray-100 rounded-full bg-color-gray-300 text-color-gray-50 cursor-pointer hover:text-blue-500 hover:border-blue-500"
				onClick={() => setIsDropdownTimeIntervalsVisible(!isDropdownTimeIntervalsVisible)}
			>
				<div>{selectedTimeInterval}</div>
				<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
			</div>

			<DropdownTimeIntervals
				toggleRef={dropdownTimeIntervalRef}
				isVisible={isDropdownTimeIntervalsVisible}
				setIsVisible={setIsDropdownTimeIntervalsVisible}
				selectedTimeInterval={selectedTimeInterval}
				setSelectedTimeInterval={setSelectedTimeInterval}
			/>
		</div>
	);
};

export default TimeIntervalsButtonAndDropdown;

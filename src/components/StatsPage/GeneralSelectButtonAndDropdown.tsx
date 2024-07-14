import { useRef, useState } from 'react';
import Icon from '../Icon';
import DropdownGeneralSelect from './DropdownGeneralSelect';

const GeneralSelectButtonAndDropdown = ({ selected, setSelected, selectedOptions }) => {
	const dropdownTimeIntervalRef = useRef(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);

	return (
		<div className="relative">
			<div
				className="flex gap-[2px] items-center px-2 py-[2px] pl-3 border border-color-gray-100 rounded-full bg-color-gray-300 text-color-gray-50 cursor-pointer hover:text-blue-500 hover:border-blue-500"
				onClick={() => setIsDropdownVisible(!isDropdownVisible)}
			>
				<div>{selected}</div>
				<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
			</div>

			<DropdownGeneralSelect
				toggleRef={dropdownTimeIntervalRef}
				isVisible={isDropdownVisible}
				setIsVisible={setIsDropdownVisible}
				selected={selected}
				setSelected={setSelected}
				selectedOptions={selectedOptions}
			/>
		</div>
	);
};

export default GeneralSelectButtonAndDropdown;

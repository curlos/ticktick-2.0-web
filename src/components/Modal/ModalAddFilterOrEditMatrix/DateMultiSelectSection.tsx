import { useState, useRef } from 'react';
import DropdownDates from '../../Dropdown/DropdownDates';
import Icon from '../../Icon';

const DateMultiSelectSection = ({ dateOptions, setDateOptions }) => {
	const [isDropdownDatesVisible, setIsDropdownDatesVisible] = useState(false);
	const dropdownDatesRef = useRef(null);

	const selectedDatesNames =
		dateOptions &&
		Object.values(dateOptions)
			.reduce((accumulator, current) => {
				if (current.selected) {
					accumulator.push(current.name);
				}
				return accumulator;
			}, [])
			.join(', ');

	return (
		<div>
			<div className="flex items-center">
				<div className="text-color-gray-100 w-[96px]">Date</div>
				<div className="flex-1 relative">
					<div
						ref={dropdownDatesRef}
						className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
						onClick={() => {
							setIsDropdownDatesVisible(!isDropdownDatesVisible);
						}}
					>
						<div className="max-w-[300px] truncate">{selectedDatesNames}</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownDates
						toggleRef={dropdownDatesRef}
						isVisible={isDropdownDatesVisible}
						setIsVisible={setIsDropdownDatesVisible}
						dateOptions={dateOptions}
						setDateOptions={setDateOptions}
						customClasses="w-full ml-[0px]"
						showSmartLists={true}
					/>
				</div>
			</div>
		</div>
	);
};

export default DateMultiSelectSection;

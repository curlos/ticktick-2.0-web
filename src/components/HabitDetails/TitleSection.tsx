import { useRef, useState } from 'react';
import Icon from '../Icon';
import DropdownHabitOptions from '../Dropdown/DropdownHabitOptions/DropdownHabitOptions';

const TitleSection = ({ habit }) => {
	const dropdownHabitOptionsRef = useRef(null);
	const [isDropdownHabitOptionsVisible, setIsDropdownHabitOptionsVisible] = useState(false);

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-1">
				<Icon
					name="no_drinks"
					fill={1}
					customClass={'text-color-gray-50 !text-[30px] hover:text-white cursor-pointer'}
				/>

				<h2 className="text-[18px] font-medium">{habit.name}</h2>
			</div>

			<div className="relative">
				<Icon
					toggleRef={dropdownHabitOptionsRef}
					name="more_horiz"
					fill={1}
					customClass={'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer'}
					onClick={() => setIsDropdownHabitOptionsVisible(!isDropdownHabitOptionsVisible)}
				/>

				<DropdownHabitOptions
					toggleRef={dropdownHabitOptionsRef}
					isVisible={isDropdownHabitOptionsVisible}
					setIsVisible={setIsDropdownHabitOptionsVisible}
					habit={habit}
				/>
			</div>
		</div>
	);
};

export default TitleSection;

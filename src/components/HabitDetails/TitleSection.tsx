import { useRef, useState } from 'react';
import Icon from '../Icon';
import DropdownHabitOptions from '../Dropdown/DropdownHabitOptions/DropdownHabitOptions';

const TitleSection = ({ habit }) => {
	const dropdownHabitOptionsRef = useRef(null);
	const [isDropdownHabitOptionsVisible, setIsDropdownHabitOptionsVisible] = useState(false);

	const { name, icon } = habit;

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<img src={icon ? icon : '/Food.webp'} className="w-[60px]" />

				<h2 className="text-[18px] font-medium">{name}</h2>
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

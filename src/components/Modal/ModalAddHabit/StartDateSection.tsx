import { useRef, useState } from 'react';
import Icon from '../../Icon';
import DropdownTimeCalendar from '../../Dropdown/DropdownsAddFocusRecord/DropdownTimeCalendar';
import { formatDateBasedOnYear } from '../../../utils/date.utils';

const StartDateSection = ({ startDate, setStartDate }) => {
	const dropdownTimeCalenderRef = useRef(null);
	const [isDropdownTimeCalendarVisible, setIsDropdownTimeCalendarVisible] = useState(false);

	return (
		<div>
			<div className="flex items-center">
				<div className="w-[96px]">Start Date</div>
				<div className="flex-1 relative">
					<div
						ref={dropdownTimeCalenderRef}
						className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
						onClick={() => {
							setIsDropdownTimeCalendarVisible(!isDropdownTimeCalendarVisible);
						}}
					>
						<div style={{ wordBreak: 'break-word' }}>{formatDateBasedOnYear(startDate)}</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownTimeCalendar
						toggleRef={dropdownTimeCalenderRef}
						isVisible={isDropdownTimeCalendarVisible}
						setIsVisible={setIsDropdownTimeCalendarVisible}
						date={startDate}
						setDate={setStartDate}
						showTime={false}
					/>
				</div>
			</div>
		</div>
	);
};

export default StartDateSection;

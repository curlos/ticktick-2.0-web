import classNames from 'classnames';
import DropdownTimeCalendar from '../../Dropdown/DropdownsAddFocusRecord/DropdownTimeCalendar';
import Icon from '../../Icon';
import { getDurationFromDates } from '../../../utils/date.utils';
import { formatTimeToHoursMinutesSeconds } from '../../../utils/helpers.utils';

const TimeOption = ({
	dropdownRef,
	isDropdownVisible,
	setIsDropdownVisible,
	time,
	setTime,
	name,
	startTime,
	endTime,
	setPomos,
	setHours,
	setMinutes,
	getDuration,
}) => {
	const handleSetDate = (newDate) => {
		setTime(newDate);

		const startTimeToUse = name === 'Start Time' ? newDate : startTime;
		const endTimeToUse = name === 'End Time' ? newDate : endTime;

		if (startTimeToUse && endTimeToUse) {
			const durationInSeconds = getDurationFromDates(startTimeToUse, endTimeToUse);
			const newPomos = getPomosFromDuration(durationInSeconds);

			console.log(durationInSeconds);
			console.log(newPomos);
			setPomos(newPomos);

			const { hours, minutes } = formatTimeToHoursMinutesSeconds(durationInSeconds);
			setHours(hours);
			setMinutes(minutes);
		}
	};

	const getPomosFromDuration = (durationInSeconds) => {
		const defaultPomoLength = 2700; // 2700 seconds = 45 minutes

		if (defaultPomoLength >= durationInSeconds) return 1;

		return Math.round(durationInSeconds / defaultPomoLength);
	};

	console.log(time);

	return (
		<div className="flex items-center gap-2">
			<div className="w-[100px]">{name}</div>
			<div className="relative flex-1">
				<div
					ref={dropdownRef}
					className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
					onClick={() => {
						setIsDropdownVisible(!isDropdownVisible);
					}}
				>
					<div className={classNames(time ? 'text-white' : 'text-color-gray-100')}>
						{time
							? time.toLocaleString('en-US', {
									year: 'numeric', // Full year
									month: 'long', // Full month name
									day: 'numeric', // Day of the month
									hour: 'numeric', // Hour (in 12-hour AM/PM format)
									minute: '2-digit', // Minute with leading zeros
									hour12: true, // Use AM/PM
								})
							: 'Select time'}
					</div>
					<Icon
						name="expand_more"
						fill={0}
						customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
					/>
				</div>

				<DropdownTimeCalendar
					toggleRef={dropdownRef}
					isVisible={isDropdownVisible}
					setIsVisible={setIsDropdownVisible}
					date={time}
					setDate={handleSetDate}
					showTime={true}
				/>
			</div>
		</div>
	);
};

export default TimeOption;

import React, { useEffect, useRef, useState } from 'react';
import Dropdown from '../Dropdown';
import Icon from '../../Icon';
import DropdownFixedOrFloatingTimeZone from '../DropdownFixedOrFloatingTimeZone';
import { DropdownProps } from '../../../interfaces/interfaces';
import classNames from 'classnames';

const getTimesArray = () => {
	let timesArray = [];
	for (let hour = 0; hour < 24; hour++) {
		for (let min = 0; min < 60; min += 30) {
			let time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
			timesArray.push(time);
		}
	}
	return timesArray;
};

const convertTimesToTimeZone = (timesArray, timeZone) => {
	return timesArray.map((time) => {
		let [hour, minute] = time.split(':');
		let date = new Date(
			Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), hour, minute)
		);
		let formatter = new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: timeZone,
			hour12: true,
		});
		return formatter.format(date);
	});
};

const DropdownTime = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedTime,
	setSelectedTime,
	currDueDate,
	setCurrDueDate,
	showTimeZoneOption = true,
	customClasses,
}) => {
	const [timeZone, setTimeZone] = useState('America/New_York');
	const timesArray = getTimesArray();
	const timesInEST = convertTimesToTimeZone(timesArray, timeZone);

	timesInEST.sort((a, b) => {
		const timePattern = /(\d+):(\d+) (\wM)/;
		const [, hoursA, minutesA, periodA] = a.match(timePattern);
		const [, hoursB, minutesB, periodB] = b.match(timePattern);
		const adjustHours = (hours, period) => (period === 'PM' ? (parseInt(hours) % 12) + 12 : parseInt(hours) % 12);
		const adjustedHoursA = adjustHours(hoursA, periodA);
		const adjustedHoursB = adjustHours(hoursB, periodB);
		return adjustedHoursA - adjustedHoursB || parseInt(minutesA) - parseInt(minutesB);
	});

	const timeRefs = useRef(timesInEST.map(() => React.createRef()));

	useEffect(() => {
		if (isVisible && !selectedTime) {
			const currentESTTime = getCurrentTimeInESTInterval();
			setSelectedTime(currentESTTime);
		}
	}, [isVisible]);

	useEffect(() => {
		// Ensure that the selected time is scrolled into view when component updates
		const index = timesInEST.indexOf(selectedTime);
		if (index !== -1 && timeRefs.current[index] && timeRefs.current[index].current) {
			timeRefs.current[index].current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	}, [selectedTime, isVisible]);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('ml-[-5px] shadow-2xl border border-color-gray-200 rounded-[4px]', customClasses)}
		>
			<div className="w-[260px] p-1">
				<div className="overflow-auto gray-scrollbar h-[240px]">
					{timesInEST.map((time, index) => {
						const isTimeSelected = selectedTime === time;
						return (
							<div
								key={time}
								ref={timeRefs.current[index]}
								className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
								onClick={() => {
									setSelectedTime(time);
									setIsVisible(false);
								}}
							>
								<div className={isTimeSelected ? 'text-blue-500' : ''}>{time}</div>
								{isTimeSelected && (
									<Icon
										name="check"
										fill={0}
										customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
									/>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownTime;

const getCurrentTimeInESTInterval = () => {
	const now = new Date();
	const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
	const minutes = estTime.getMinutes();
	const nearest30 = minutes >= 30 ? 30 : 0;
	estTime.setMinutes(nearest30, 0, 0);
	const formatter = new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'America/New_York',
		hour12: true,
	});
	return formatter.format(estTime);
};

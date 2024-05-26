import React, { useEffect, useRef, useState } from 'react';
import Dropdown from '../Dropdown';
import Icon from '../../Icon';
import DropdownFixedOrFloatingTimeZone from '../DropdownFixedOrFloatingTimeZone';
import { DropdownProps } from '../../../interfaces/interfaces';
import classNames from 'classnames';
import InfiniteScrollSelector from '../../InfiniteScrollSelector';

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
	showTimeZoneOption = true,
	customClasses,
}) => {
	const [timeZone, setTimeZone] = useState('America/New_York');
	const timesArray = getTimesArray();
	const timesInEST = convertTimesToTimeZone(timesArray, timeZone);

	// useEffect(() => {
	// 	if (isVisible && !selectedTime) {
	// 		const currentESTTime = getCurrentTimeInESTInterval();
	// 		setSelectedTime(currentESTTime);
	// 	}
	// }, [isVisible]);

	// useEffect(() => {
	// 	// Ensure that the selected time is scrolled into view when component updates
	// 	const index = timesInEST.indexOf(selectedTime);
	// 	if (index !== -1 && timeRefs.current[index] && timeRefs.current[index].current) {
	// 		timeRefs.current[index].current.scrollIntoView({
	// 			behavior: 'smooth',
	// 			block: 'start',
	// 		});
	// 	}
	// }, [selectedTime, isVisible]);

	const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
	const minutes = Array.from({ length: 60 }, (_, i) => (i + 1).toString().padStart(2, '0'));
	const periods = ['AM', 'PM'];

	const [selectedHour, setSelectedHour] = useState('12');
	const [selectedMinute, setSelectedMinute] = useState('00');
	const [selectedPeriod, setSelectedPeriod] = useState('AM');

	const handleTimeSelection = () => {
		const time = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
		setSelectedTime(time);
		setIsVisible(false);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('ml-[-5px] shadow-2xl border border-color-gray-200 rounded-[4px]', customClasses)}
		>
			<div className="w-[260px] p-1">
				{/* <div className="overflow-auto gray-scrollbar h-[240px]">
					
				</div> */}

				<div className="grid grid-cols-3">
					<InfiniteScrollSelector items={hours} unit="hour" setSelected={setSelectedHour} />
					<InfiniteScrollSelector items={minutes} unit="minute" setSelected={setSelectedMinute} />
					<div className="flex flex-col">
						<div
							className="text-center py-2 cursor-pointer hover:bg-gray-200"
							onClick={() => setSelectedPeriod('AM')}
							style={{ backgroundColor: selectedPeriod === 'AM' ? 'lightblue' : 'transparent' }}
						>
							AM
						</div>
						<div
							className="text-center py-2 cursor-pointer hover:bg-gray-200"
							onClick={() => setSelectedPeriod('PM')}
							style={{ backgroundColor: selectedPeriod === 'PM' ? 'lightblue' : 'transparent' }}
						>
							PM
						</div>
					</div>
				</div>
				{/* <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded" onClick={handleTimeSelection}>
					Set Time
				</button> */}
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

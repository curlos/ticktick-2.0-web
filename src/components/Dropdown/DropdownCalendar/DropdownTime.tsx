import { useEffect, useState } from 'react';
import Dropdown from '../Dropdown';
import classNames from 'classnames';
import InfiniteScrollSelector from '../../InfiniteScrollSelector';

function extractTimeDetails(timeStr) {
	if (!timeStr) {
		return {
			hours: '',
			minutes: '',
			period: '',
		};
	}

	const [time, period] = timeStr.split(' ');
	const [hours, minutes] = time.split(':');

	return {
		hours: String(hours),
		minutes: minutes ? String(minutes).padStart(2, '0') : '',
		period: period,
	};
}

const DropdownTime = ({ toggleRef, isVisible, setIsVisible, selectedTime, setSelectedTime, customClasses }) => {
	const defaultTime = extractTimeDetails(selectedTime);

	const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
	const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
	const periods = ['AM', 'PM'];

	const [selectedHour, setSelectedHour] = useState(defaultTime.hours);
	const [selectedMinute, setSelectedMinute] = useState(defaultTime.minutes);
	const [selectedPeriod, setSelectedPeriod] = useState(defaultTime.period);

	useEffect(() => {
		handleTimeSelection();
	}, [selectedHour, selectedMinute, selectedPeriod]);

	// useEffect(() => {
	// 	const time = extractTimeDetails(selectedTime);
	// 	setSelectedHour(time.hours);
	// 	setSelectedMinute(time.minutes);
	// 	setSelectedPeriod(time.period);
	// }, [selectedTime, isVisible]);

	const handleTimeSelection = () => {
		let time = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;

		if (!selectedHour || !selectedMinute || !selectedPeriod) {
			time = '';
		}

		console.log();
		console.log(time);

		// TODO: Fix
		// if (time === '12:00 AM') {
		// 	setSelectedHour('');
		// 	setSelectedMinute('');
		// 	setSelectedPeriod('');
		// } else {
		// 	setSelectedTime(time);
		// }

		setSelectedTime(time);
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
					<InfiniteScrollSelector
						items={hours}
						unit="hour"
						selectedValue={selectedHour}
						setSelectedValue={setSelectedHour}
					/>
					<InfiniteScrollSelector
						items={minutes}
						unit="minute"
						selectedValue={selectedMinute}
						setSelectedValue={setSelectedMinute}
					/>
					<div className="flex flex-col">
						{periods.map((period) => (
							<div
								key={period}
								className={classNames(
									'text-center py-2 rounded cursor-pointer',
									selectedPeriod === period ? 'bg-blue-500' : 'bg-transparent hover:bg-color-gray-200'
								)}
								onClick={() => setSelectedPeriod(period)}
							>
								{period}
							</div>
						))}
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

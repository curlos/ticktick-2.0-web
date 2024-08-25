import { useEffect, useState } from 'react';
import Icon from './Icon';
import { areDatesEqual, formatCheckedInDayDate, getAllDaysInWeekFromDate, getCalendarMonth } from '../utils/date.utils';
import { setTimeOnDateString } from '../utils/date.utils';
import classNames from 'classnames';

interface CalendarProps {
	dueDate: Date | null;
	setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const SelectCalendar: React.FC<CalendarProps> = ({
	dueDate,
	setDueDate,
	time,
	connectedCurrentDate,
	setConnectedCurrentDate,
	selectedInterval,
	outerCurrentDate,
}) => {
	const [localCurrentDate, setLocalCurrentDate] = useState(new Date());
	const [allDaysInWeekFromDate, setAllDaysInWeekFromDate] = useState(null);

	useEffect(() => {
		if (dueDate) {
			let newDueDate = dueDate;

			if (time) {
				newDueDate = dueDate ? dueDate : new Date();
				const newDateObject = setTimeOnDateString(newDueDate, time);
				newDueDate = newDateObject;
			}

			setLocalCurrentDate(newDueDate);
		}
	}, [dueDate]);

	useEffect(() => {
		if (connectedCurrentDate) {
			setLocalCurrentDate(connectedCurrentDate);
		}
	}, [connectedCurrentDate]);

	const goToPreviousMonth = () => {
		setLocalCurrentDate(new Date(localCurrentDate.getFullYear(), localCurrentDate.getMonth() - 1, 1));
	};

	const goToNextMonth = () => {
		setLocalCurrentDate(new Date(localCurrentDate.getFullYear(), localCurrentDate.getMonth() + 1, 1));
	};

	const calendarMonth = getCalendarMonth(localCurrentDate.getFullYear(), localCurrentDate.getMonth());
	const monthName = localCurrentDate.toLocaleString('default', { month: 'long' });

	useEffect(() => {
		if (selectedInterval === 'Week') {
			const newAllDaysInWeekFromDate = {};

			getAllDaysInWeekFromDate(outerCurrentDate).forEach((day) => {
				const dateKey = formatCheckedInDayDate(day);
				newAllDaysInWeekFromDate[dateKey] = day;
			});

			setAllDaysInWeekFromDate(newAllDaysInWeekFromDate);
		} else {
			setAllDaysInWeekFromDate(null);
		}
	}, [selectedInterval, outerCurrentDate]);

	return (
		<div>
			<div className="flex items-center justify-between px-4">
				<div>
					{monthName} {localCurrentDate.getFullYear()}
				</div>
				<div className="flex items-center">
					<Icon
						name="chevron_left"
						fill={0}
						customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						onClick={goToPreviousMonth}
					/>
					<Icon
						name="fiber_manual_record"
						fill={0}
						customClass={'text-color-gray-50 !text-[14px] hover:text-white cursor-pointer'}
					/>
					<Icon
						name="chevron_right"
						fill={0}
						customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						onClick={goToNextMonth}
					/>
				</div>
			</div>

			<div className="w-full text-[12px] p-3">
				<div>
					<div className="grid grid-cols-7 gap-1 text-center">
						{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
							<div key={day + i} className="py-1">
								{day}
							</div>
						))}
					</div>
				</div>
				<div className="text-center">
					{calendarMonth.map((week, index) => {
						let isSelectedWeek = false;

						if (allDaysInWeekFromDate) {
							const firstDayOfThisWeekKey = formatCheckedInDayDate(week[0]);
							isSelectedWeek = allDaysInWeekFromDate[firstDayOfThisWeekKey];
						}

						return (
							<div
								key={`week-${index}`}
								className={classNames(
									'mb-1 grid grid-cols-7 gap-1',
									isSelectedWeek && 'bg-color-gray-200 rounded-full'
								)}
							>
								{week.map((day, index) => {
									const isCurrentMonth = day.getMonth() === localCurrentDate.getMonth();
									const isDayToday = areDatesEqual(new Date(), day);
									const isChosenDay = areDatesEqual(dueDate, day);
									let appliedStyles = [];

									if (isCurrentMonth) {
										if (isChosenDay) {
											appliedStyles.push('bg-blue-500 text-white');
										} else if (isDayToday) {
											appliedStyles.push(
												'bg-color-gray-200 hover:bg-color-gray-200 text-blue-500'
											);
										} else {
											appliedStyles.push('text-white bg-transparent hover:bg-color-gray-300');
										}
									} else {
										appliedStyles.push('text-color-gray-100 bg-transparent hover:bg-color-gray-20');
									}

									const handleClick = () => {
										setLocalCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));

										if (setConnectedCurrentDate) {
											setConnectedCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));
										}

										let newDueDate = day ? day : new Date();

										if (time) {
											const newDateObject = setTimeOnDateString(newDueDate, time);
											newDueDate = newDateObject;
										}

										setDueDate(newDueDate);
									};

									return (
										<div
											key={`day-${index}`}
											className={`py-1 cursor-pointer rounded-full ${appliedStyles}`}
											onClick={handleClick}
										>
											{day.getDate()}
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default SelectCalendar;

import { useEffect, useState } from 'react';
import { areDatesEqual, formatCheckedInDayDate } from '../../utils/date.utils';
import Icon from '../Icon';
import classNames from 'classnames';
import { useEditHabitMutation } from '../../services/resources/habitsApi';
import useHandleError from '../../hooks/useHandleError';

const HabitCalendar = ({ habit, currentDate, setCurrentDate }) => {
	const handleError = useHandleError();
	const [editHabit] = useEditHabitMutation();

	function getCalendarMonth(year, month) {
		const calendar = [];
		const firstDayOfMonth = new Date(year, month, 1);
		let currentDay = new Date(firstDayOfMonth);
		const dayOfWeek = currentDay.getDay();
		currentDay.setDate(currentDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

		// This will ensure we always start the calendar with 7 rows of 7 days
		const weeksInCalendar = 6; // The number of weeks you want to show

		for (let week = 0; week < weeksInCalendar; week++) {
			const days = [];
			for (let i = 0; i < 7; i++) {
				// 7 days per week
				days.push(new Date(currentDay));
				currentDay.setDate(currentDay.getDate() + 1);
			}
			calendar.push(days);
		}

		return calendar;
	}

	const goToPreviousMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
	};

	const goToNextMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	};

	const calendarMonth = getCalendarMonth(currentDate.getFullYear(), currentDate.getMonth());
	const monthName = currentDate.toLocaleString('default', { month: 'long' });

	const DayCircle = ({ day, index }) => {
		// TODO: Currently, this does work on the Frontend but changed this "checked" to also check for the backend first to see if it's been initially checked.
		const checkedInDayKey = formatCheckedInDayDate(day);
		const checkedInDay = habit.checkedInDays[checkedInDayKey];
		const [isChecked, setIsChecked] = useState(checkedInDay && checkedInDay.isAchieved ? true : false);

		const isCurrentMonth = day.getMonth() === currentDate.getMonth();
		const isDayToday = areDatesEqual(new Date(), day);
		let dayNumberStyle = [];
		let dayCircleStyle = [];

		if (isCurrentMonth) {
			if (isDayToday) {
				dayNumberStyle.push('text-blue-500');
				dayCircleStyle.push('bg-color-gray-100/50 hover:bg-color-gray-100/60');
			} else {
				dayNumberStyle.push('text-color-gray-100');
				dayCircleStyle.push('bg-color-gray-100/20 hover:bg-color-gray-100/30');
			}
		} else {
			dayNumberStyle.push('text-color-gray-100/50');
			dayCircleStyle.push('bg-color-gray-100/5 hover:bg-color-gray-100/15');
		}

		const handleClick = () => {
			// If it's currently checked, then we need to uncheck it (set it to null)
			if (isChecked) {
				const currentCheckedInDay = habit.checkedInDays[checkedInDayKey];

				payload = {
					checkedInDays: {
						...habit.checkedInDays,
						[checkedInDayKey]: currentCheckedInDay
							? { ...currentCheckedInDay, isAchieved: null }
							: { isAchieved: new Date() },
					},
				};
			}

			const currentCheckedInDay = habit.checkedInDays[checkedInDayKey];
			const newAchievedValue = isChecked ? null : new Date();

			const payload = {
				checkedInDays: {
					...habit.checkedInDays,
					[checkedInDayKey]: currentCheckedInDay
						? { ...currentCheckedInDay, isAchieved: newAchievedValue }
						: { isAchieved: new Date() },
				},
			};

			// setCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));
			// TODO: Make API Call to check or uncheck the habit for the chosen day.
			setIsChecked(!isChecked);

			console.log(payload);
			debugger;

			handleError(async () => {
				await editHabit({ habitId: habit._id, payload }).unwrap();
			});
		};

		return (
			<div className="flex flex-col justify-center items-center">
				<div key={`day-${index}`} className={classNames('py-1 cursor-pointer rounded-full', dayNumberStyle)}>
					{day.getDate()}
				</div>

				<div
					className={classNames(
						'w-[30px] h-[30px] rounded-full cursor-pointer flex items-center justify-center',
						dayCircleStyle,
						isChecked ? '!bg-blue-500' : ''
					)}
					onClick={handleClick}
				>
					<Icon
						name="check"
						fill={0}
						customClass={classNames(
							'text-white !text-[22px] cursor-pointer',
							!isChecked ? 'invisible' : ''
						)}
					/>
				</div>
			</div>
		);
	};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg">
			<div className="flex justify-between items-center">
				<Icon
					name="chevron_left"
					fill={0}
					customClass={'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer'}
					onClick={goToPreviousMonth}
				/>
				<div>
					{monthName} {currentDate.getFullYear()}
				</div>
				<Icon
					name="chevron_right"
					fill={0}
					customClass={'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer'}
					onClick={goToNextMonth}
				/>
			</div>

			<div className="w-full text-[12px] my-3">
				<div>
					<div className="grid grid-cols-7 gap-1 text-center">
						{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
							<div key={day + i} className="py-1 text-color-gray-100">
								{day}
							</div>
						))}
					</div>
				</div>
				<div className="text-center">
					{calendarMonth.map((week, index) => (
						<div key={`week-${index}`} className="mb-1 grid grid-cols-7 gap-1">
							{week.map((day, index) => (
								<DayCircle key={`${day} ${index}`} day={day} index={index} />
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HabitCalendar;

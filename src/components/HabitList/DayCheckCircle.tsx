import classNames from 'classnames';
import { useState, useRef } from 'react';
import useHandleError from '../../hooks/useHandleError';
import { useEditHabitMutation } from '../../services/resources/habitsApi';
import AlertTooltip from '../Alert/AlertTooltip';
import Dropdown from '../Dropdown/Dropdown';
import Icon from '../Icon';

const DayCheckCircle = ({ isChecked, day, habit, type = 'small' }) => {
	const handleError = useHandleError();
	const [editHabit] = useEditHabitMutation();
	const checkedInDayKey = day;
	const [isTooltipDayVisible, setIsTooltipDayVisible] = useState(false);
	const [isAlertTooltipOpen, setIsAlertTooltipOpen] = useState(false);

	const tooltipDayRef = useRef(null);

	const handleClick = () => {
		let payload = null;
		// If it's currently checked, then we need to uncheck it (set it to null)
		if (isChecked) {
			const currentCheckedInDay = habit.checkedInDays[checkedInDayKey];

			payload = {
				checkedInDays: {
					...habit.checkedInDays,
					[checkedInDayKey]: currentCheckedInDay
						? { ...currentCheckedInDay, isAchieved: null }
						: { isAchieved: new Date().toISOString() },
				},
			};
		}

		const currentCheckedInDay = habit.checkedInDays[checkedInDayKey];
		const newAchievedValue = isChecked ? null : new Date().toISOString();

		payload = {
			checkedInDays: {
				...habit.checkedInDays,
				[checkedInDayKey]: currentCheckedInDay
					? { ...currentCheckedInDay, isAchieved: newAchievedValue }
					: { isAchieved: new Date().toISOString() },
			},
		};

		if (!isChecked) {
			setIsAlertTooltipOpen(true);
		}

		handleError(async () => {
			await editHabit({ habitId: habit._id, payload }).unwrap();
		});
	};

	return (
		<div>
			<AlertTooltip
				isOpen={isAlertTooltipOpen}
				setIsOpen={setIsAlertTooltipOpen}
				customTopClasses={type === 'medium' ? 'ml-[-6px]' : ''}
			>
				Done!
			</AlertTooltip>

			<div className="relative">
				<div
					ref={tooltipDayRef}
					key={`${habit._id} ${day}`}
					className={classNames(
						'rounded-full flex justify-center items-center cursor-pointer',
						isChecked ? 'bg-blue-500' : 'bg-color-gray-100/30',
						type === 'small' ? 'h-[20px] w-[20px]' : 'h-[30px] w-[30px]'
					)}
					onClick={handleClick}
					onMouseOver={() => setIsTooltipDayVisible(true)}
					onMouseLeave={() => setIsTooltipDayVisible(false)}
				>
					<Icon
						name="check"
						fill={1}
						customClass={classNames(
							'text-white !text-[18px] cursor-pointer',
							!isChecked ? 'invisible' : ''
						)}
					/>
				</div>

				<Dropdown
					toggleRef={tooltipDayRef}
					isVisible={isTooltipDayVisible}
					setIsVisible={setIsTooltipDayVisible}
					customClasses={'!bg-black'}
				>
					<div className="p-2 text-[12px] text-nowrap">
						{new Date(day).toLocaleDateString('en-US', {
							weekday: 'short', // "Mon" for Monday
							month: 'long', // "July"
							day: 'numeric', // "8"
						})}
					</div>
				</Dropdown>
			</div>
		</div>
	);
};

export default DayCheckCircle;

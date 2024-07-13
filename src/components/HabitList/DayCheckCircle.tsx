import classNames from 'classnames';
import { useState, useRef } from 'react';
import useHandleError from '../../hooks/useHandleError';
import { useEditHabitMutation } from '../../services/resources/habitsApi';
import AlertTooltip from '../Alert/AlertTooltip';
import Dropdown from '../Dropdown/Dropdown';
import Icon from '../Icon';
import ContextMenuGeneric from '../ContextMenu/ContextMenuGeneric';
import DropdownHabitDayActions from './DropdownHabitDayActions';
import { isFutureDate } from '../../utils/date.utils';

const DayCheckCircle = ({ isChecked, day, habit, type = 'small' }) => {
	const handleError = useHandleError();
	const [editHabit] = useEditHabitMutation();
	const checkedInDayKey = day;
	const checkedInDay = habit.checkedInDays[checkedInDayKey];
	const [contextMenu, setContextMenu] = useState(null);
	const [isTooltipDayVisible, setIsTooltipDayVisible] = useState(false);
	const [isAlertTooltipOpen, setIsAlertTooltipOpen] = useState(false);
	const [isDropdownHabitDayActionsVisible, setIsDropdownHabitDayActionsVisible] = useState(true);

	const tooltipDayRef = useRef(null);
	const dropdownHabitDayActionsRef = useRef(null);

	const dayHasNotHappenedYet = isFutureDate(day);
	const disableHabitActions = habit.isArchived || dayHasNotHappenedYet;

	const handleClick = () => {
		if (disableHabitActions) {
			return;
		}

		let payload = null;
		// If it's currently checked, then we need to uncheck it (set it to null)
		if (isChecked) {
			payload = {
				checkedInDays: {
					...habit.checkedInDays,
					[checkedInDayKey]: checkedInDay
						? { ...checkedInDay, isAchieved: null }
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

	const handleContextMenu = (event) => {
		event.preventDefault(); // Prevent the default context menu
		event.stopPropagation();

		if (disableHabitActions) {
			return;
		}

		setContextMenu({
			xPos: event.pageX, // X coordinate of the mouse pointer
			yPos: event.pageY, // Y coordinate of the mouse pointer
		});
	};

	const handleCloseContextMenu = () => {
		setContextMenu(null);
	};

	return (
		<div className={classNames('relative')}>
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
						'rounded-full flex justify-center items-center',
						isChecked ? 'bg-blue-500' : 'bg-color-gray-100/30',
						type === 'small' ? 'h-[20px] w-[20px]' : 'h-[30px] w-[30px]',
						disableHabitActions ? 'cursor-not-allowed' : 'cursor-pointer'
					)}
					onContextMenu={handleContextMenu}
					onClick={handleClick}
					onMouseOver={() => setIsTooltipDayVisible(true)}
					onMouseLeave={() => setIsTooltipDayVisible(false)}
				>
					{isChecked && <Icon name="check" fill={1} customClass={classNames('text-white !text-[18px]')} />}

					{checkedInDay && checkedInDay.isAchieved === false && (
						<Icon name="close" fill={1} customClass={classNames('text-red-500 !text-[18px] mr-[-1px]')} />
					)}
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

				{contextMenu && (
					<ContextMenuGeneric
						xPos={contextMenu.xPos}
						yPos={contextMenu.yPos}
						onClose={handleCloseContextMenu}
						isDropdownVisible={isDropdownHabitDayActionsVisible}
						setIsDropdownVisible={setIsDropdownHabitDayActionsVisible}
					>
						<DropdownHabitDayActions
							toggleRef={dropdownHabitDayActionsRef}
							isVisible={isDropdownHabitDayActionsVisible}
							setIsVisible={setIsDropdownHabitDayActionsVisible}
							customClasses=" !ml-[0px] mt-[15px]"
							customStyling={{
								position: 'absolute',
								top: `${contextMenu.yPos}px`,
								left: `${contextMenu.xPos}px`,
							}}
							onCloseContextMenu={handleCloseContextMenu}
							habit={habit}
							checkedInDayKey={checkedInDayKey}
						/>
					</ContextMenuGeneric>
				)}
			</div>
		</div>
	);
};

export default DayCheckCircle;

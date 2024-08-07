import { useRef, useState } from 'react';
import Icon from '../Icon';
import HeaderSection from './HeaderSection';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import classNames from 'classnames';
import { formatCheckedInDayDate, getDayNameAbbreviation, getLast7Days, getMonthAndDay } from '../../utils/date.utils';
import { areDatesEqual } from '../../utils/date.utils';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetHabitSectionsQuery } from '../../services/resources/habitSectionsApi';
import { useNavigate, useParams } from 'react-router';
import { getStreaks } from '../../utils/habits.util';
import Dropdown from '../Dropdown/Dropdown';
import DropdownHabitOptions from '../Dropdown/DropdownHabitOptions/DropdownHabitOptions';
import ContextMenuGeneric from '../ContextMenu/ContextMenuGeneric';
import DayCheckCircle from './DayCheckCircle';

const HabitList = () => {
	const lastSevenDays = getLast7Days();
	const formattedLastSevenDays = lastSevenDays.map((day) => formatCheckedInDayDate(day));
	const [selectedDay, setSelectedDay] = useState(null);
	// Can be "list" or "grid"
	const [viewType, setViewType] = useState('list');

	const monthAndDay = selectedDay && getMonthAndDay(selectedDay);

	// Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits, error: errorGetHabits } = useGetHabitsQuery();
	const { habits, habitsById } = fetchedHabits || {};

	// Habit Sections
	const {
		data: fetchedHabitSections,
		isLoading: isLoadingGetHabitSections,
		error: errorGetHabitSections,
	} = useGetHabitSectionsQuery();
	const { habitSections } = fetchedHabitSections || {};

	if (!habits || !habitSections || !habitsById) {
		return null;
	}

	const showOnlyArchivedHabits = location.pathname.includes('/habits/archived');

	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700 border-l border-r border-color-gray-200">
			<div className="p-4 h-full">
				<HeaderSection viewType={viewType} setViewType={setViewType} />

				{!showOnlyArchivedHabits && (
					<div className="grid grid-cols-7 gap-4 my-2">
						{lastSevenDays.map((day, index) => (
							<HabitDay
								key={index}
								day={day}
								selectedDay={selectedDay}
								setSelectedDay={setSelectedDay}
								habits={habits}
							/>
						))}
					</div>
				)}

				{!showOnlyArchivedHabits && selectedDay && (
					<div className="flex items-center gap-1 text-color-gray-100">
						<Icon
							name="filter_alt"
							fill={0}
							customClass={'text-color-gray-100 !text-[16px] hover:text-white cursor-pointer'}
						/>
						<div className="text-[14px]">{monthAndDay}</div>
						<Icon
							name="close"
							fill={0}
							customClass={'text-color-gray-100 hover:text-color-gray-50 !text-[16px] cursor-pointer'}
							onClick={() => setSelectedDay(null)}
						/>
					</div>
				)}

				{!showOnlyArchivedHabits &&
					habitSections.map((habitSection) => {
						const { habitIds } = habitSection;

						if (habitIds.length === 0) {
							return null;
						}

						const habitsForThisSection = habitIds.flatMap((habitId) => {
							const habit = habitsById[habitId];

							if (habit) {
								if (showOnlyArchivedHabits) {
									return habit.isArchived ? habitsById[habitId] : [];
								} else {
									return !habit.isArchived ? habitsById[habitId] : [];
								}
							}

							return [];
						});

						return (
							<HabitListByCategory
								key={habitSection._id}
								habitSection={habitSection}
								habitsForThisSection={habitsForThisSection}
								viewType={viewType}
								formattedLastSevenDays={formattedLastSevenDays}
								selectedDay={selectedDay}
							/>
						);
					})}

				{showOnlyArchivedHabits && (
					<div className={classNames('gap-3', viewType === 'grid' ? 'grid grid-cols-2' : 'grid')}>
						{habits.map((habit) => {
							if (!habit.isArchived || !habit) {
								return null;
							}

							return <HabitCard key={habit._id} habit={habit} />;
						})}
					</div>
				)}
			</div>
		</div>
	);
};

const HabitListByCategory = ({ habitSection, habitsForThisSection, viewType, formattedLastSevenDays, selectedDay }) => {
	const { name } = habitSection;

	return (
		<div>
			<div className="mt-5">
				<div className="flex items-center gap-1">
					<Icon
						name="expand_more"
						fill={0}
						customClass={'text-color-gray-100 hover:text-color-gray-50 !text-[16px] cursor-pointer'}
					/>
					<div className="font-bold">{name}</div>
					<div className="ml-1 text-color-gray-100">{habitsForThisSection.length}</div>
				</div>
			</div>

			<div className={classNames('mt-3 grid gap-3', viewType === 'grid' ? 'grid-cols-2' : '')}>
				{habitsForThisSection.map(
					(habit) =>
						habit && (
							<HabitCard
								key={habit._id}
								habit={habit}
								viewType={viewType}
								formattedLastSevenDays={formattedLastSevenDays}
								selectedDay={selectedDay}
							/>
						)
				)}
			</div>
		</div>
	);
};

const HabitCard = ({ habit, viewType, formattedLastSevenDays, selectedDay }) => {
	const navigate = useNavigate();
	const { habitId } = useParams();
	const { name, icon, checkedInDays } = habit;

	const [contextMenu, setContextMenu] = useState(null);
	const [isTooltipLongestStreakVisible, setIsTooltipLongestStreakVisible] = useState(false);
	const [isTooltipCurrentStreakVisible, setIsTooltipCurrentStreakVisible] = useState(false);
	const [isDropdownHabitOptionsVisible, setIsDropdownHabitOptionsVisible] = useState(true);

	const tooltipLongestStreakRef = useRef(null);
	const tooltipCurrentStreakRef = useRef(null);
	const dropdownTaskActionsToggleRef = useRef(null);

	const handleContextMenu = (event) => {
		event.preventDefault(); // Prevent the default context menu

		setContextMenu({
			xPos: event.pageX, // X coordinate of the mouse pointer
			yPos: event.pageY, // Y coordinate of the mouse pointer
		});

		// navigate(`/habits/${habit._id}`);
	};

	const handleClose = () => {
		setContextMenu(null);
	};

	const result = getStreaks(habit);
	const { longestStreak, currentStreak } = result;

	const formattedSelectedDay = selectedDay && formatCheckedInDayDate(selectedDay);
	const { xPos, yPos } = contextMenu || {};

	return (
		<div>
			<div
				onContextMenu={handleContextMenu}
				className={classNames(
					'bg-color-gray-600 rounded-lg p-3 cursor-pointer border-2',
					habitId && habit._id === habitId ? 'border-blue-500' : 'border-transparent',
					viewType === 'grid' && !selectedDay ? 'space-y-4' : 'flex justify-between items-center'
				)}
				onClick={() => {
					if (habit.isArchived) {
						navigate(`/habits/archived/${habit._id}`);
					} else {
						navigate(`/habits/${habit._id}`);
					}
				}}
			>
				<div className="flex items-center gap-2">
					<div>
						<img src={icon ? icon : '/Food.webp'} alt="" className="h-[40px]" />
					</div>

					<div>
						<div>{name}</div>
						<div className="flex items-center gap-2">
							<div className="relative">
								<div
									ref={tooltipCurrentStreakRef}
									className="flex gap-1"
									onMouseOver={() => setIsTooltipCurrentStreakVisible(true)}
									onMouseLeave={() => setIsTooltipCurrentStreakVisible(false)}
								>
									<Icon
										name="local_fire_department"
										fill={1}
										customClass={'text-orange-400 !text-[18px] cursor-pointer'}
									/>
									<div className="text-color-gray-100">
										{currentStreak} {currentStreak !== 1 ? 'Days' : 'Day'}
									</div>
								</div>

								<Dropdown
									toggleRef={tooltipCurrentStreakRef}
									isVisible={isTooltipCurrentStreakVisible}
									setIsVisible={setIsTooltipCurrentStreakVisible}
									customClasses={'!bg-black'}
								>
									<div className="p-2 text-[12px] text-nowrap">
										Current Streak: {currentStreak} {currentStreak !== 1 ? 'Days' : 'Day'}
									</div>
								</Dropdown>
							</div>

							<div className="relative">
								<div
									ref={tooltipLongestStreakRef}
									className="flex gap-1"
									onMouseOver={() => setIsTooltipLongestStreakVisible(true)}
									onMouseLeave={() => setIsTooltipLongestStreakVisible(false)}
								>
									<Icon
										name="sword_rose"
										fill={1}
										customClass={'text-purple-400 !text-[18px] cursor-pointer'}
									/>
									<div className="text-color-gray-100">
										{longestStreak} {longestStreak !== 1 ? 'Days' : 'Day'}
									</div>
								</div>

								<Dropdown
									toggleRef={tooltipLongestStreakRef}
									isVisible={isTooltipLongestStreakVisible}
									setIsVisible={setIsTooltipLongestStreakVisible}
									customClasses={'!bg-black'}
								>
									<div className="p-2 text-[12px] text-nowrap">
										Longest Streak: {longestStreak} {longestStreak !== 1 ? 'Days' : 'Day'}
									</div>
								</Dropdown>
							</div>
						</div>
					</div>
				</div>

				{!habit.isArchived && (
					<div
						className={classNames('flex items-center gap-2', viewType === 'grid' ? 'justify-between' : '')}
					>
						{selectedDay ? (
							<DayCheckCircle
								isChecked={checkedInDays[formattedSelectedDay]?.isAchieved}
								day={formattedSelectedDay}
								habit={habit}
							/>
						) : (
							formattedLastSevenDays.map((day, i) => {
								const isChecked = checkedInDays[day]?.isAchieved;

								return <DayCheckCircle key={day} isChecked={isChecked} day={day} habit={habit} />;
							})
						)}
					</div>
				)}
			</div>

			{contextMenu && (
				<ContextMenuGeneric
					xPos={xPos}
					yPos={yPos}
					onClose={handleClose}
					isDropdownVisible={isDropdownHabitOptionsVisible}
					setIsDropdownVisible={setIsDropdownHabitOptionsVisible}
				>
					<DropdownHabitOptions
						toggleRef={dropdownTaskActionsToggleRef}
						isVisible={isDropdownHabitOptionsVisible}
						setIsVisible={setIsDropdownHabitOptionsVisible}
						customClasses=" !ml-[0px] mt-[15px]"
						customStyling={{ position: 'absolute', top: `${yPos}px`, left: `${xPos}px` }}
						onCloseContextMenu={handleClose}
						habit={habit}
					/>
				</ContextMenuGeneric>
			)}
		</div>
	);
};

const HabitDay = ({ day, selectedDay, setSelectedDay, habits }) => {
	const formattedCheckedInDay = formatCheckedInDayDate(day);
	const activeHabits = habits.filter((habit) => !habit.isArchived);
	const habitsCheckedInForThisDay = activeHabits.filter(
		(habit) => habit.checkedInDays[formattedCheckedInDay]?.isAchieved
	);

	// I think the percentage on TickTick 1.0 is just the percentage of habits you completed in a day from all your habits. Implement real values later.
	const getPercentage = () => {
		return (habitsCheckedInForThisDay.length / activeHabits.length) * 100;
	};

	const dayName = getDayNameAbbreviation(day);
	const dayOfMonth = day.getDate();

	const isSelectedDay = areDatesEqual(selectedDay, day);
	const isDayToday = areDatesEqual(new Date(), day);

	return (
		<div
			className={classNames(
				'flex flex-col justify-center items-center p-2 rounded-lg cursor-pointer',
				isSelectedDay ? 'bg-blue-500/40' : 'bg-color-gray-300',
				isDayToday ? 'text-blue-500' : 'text-color-gray-100'
			)}
			onClick={() => {
				if (areDatesEqual(selectedDay, day)) {
					setSelectedDay(null);
				} else {
					setSelectedDay(day);
				}
			}}
		>
			<div>{dayName}</div>
			<div className={classNames('font-bold')}>{dayOfMonth}</div>
			<div className="w-[25px] h-[25px] mt-1">
				<CircularProgressbarWithChildren
					value={getPercentage()}
					strokeWidth={13}
					styles={buildStyles({
						textColor: '#4772F9',
						pathColor: '#4772F9', // Red when overtime, otherwise original color
						trailColor: '#737272',
					})}
					counterClockwise={false}
				/>
			</div>
		</div>
	);
};

export default HabitList;

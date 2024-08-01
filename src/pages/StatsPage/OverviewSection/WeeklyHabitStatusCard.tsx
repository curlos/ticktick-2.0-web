import classNames from 'classnames';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { useGetHabitsQuery } from '../../../services/resources/habitsApi';
import { areDatesEqual, formatCheckedInDayDate, getDayNameAbbreviation, getLast7Days } from '../../../utils/date.utils';

const WeeklyHabitStatusCard = () => {
	// Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits, error: errorGetHabits } = useGetHabitsQuery();
	const { habits, habitsById } = fetchedHabits || {};
	const lastSevenDays = getLast7Days();

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col">
			<h3 className="font-bold text-[16px]">Weekly Habit Status</h3>

			<div className="grid grid-cols-7 gap-4 my-2">
				{habits && lastSevenDays.map((day, index) => <HabitDay key={index} day={day} habits={habits} />)}
			</div>
		</div>
	);
};

const HabitDay = ({ day, habits }) => {
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
	const isDayToday = areDatesEqual(new Date(), day);

	return (
		<div
			className={classNames(
				'flex flex-col justify-center items-center p-2 rounded-lg cursor-pointer',
				isDayToday ? 'text-blue-500' : 'text-color-gray-100'
			)}
		>
			<div className="w-[45px] h-[45px] mt-1">
				<CircularProgressbarWithChildren
					value={getPercentage()}
					strokeWidth={13}
					styles={buildStyles({
						textColor: '#4772F9',
						pathColor: '#4772F9', // Red when overtime, otherwise original color
						trailColor: '#3a3a3a',
					})}
					counterClockwise={false}
				/>
			</div>

			<div>{dayName}</div>
			<div className={classNames('font-bold')}>{dayOfMonth}</div>
		</div>
	);
};

export default WeeklyHabitStatusCard;

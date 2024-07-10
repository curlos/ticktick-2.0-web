import classNames from 'classnames';
import { formatCheckedInDayDate, areDatesEqual } from '../../utils/date.utils';
import DayCheckCircle from '../HabitList/DayCheckCircle';

const DayCircle = ({ day, index, habit, currentDate }) => {
	const checkedInDayKey = formatCheckedInDayDate(day);
	const checkedInDay = habit.checkedInDays[checkedInDayKey];
	const isChecked = checkedInDay && checkedInDay.isAchieved ? true : false;

	const isCurrentMonth = day.getMonth() === currentDate.getMonth();
	const isDayToday = areDatesEqual(new Date(), day);
	const dayNumberStyle = [];
	const dayCircleStyle = [];

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

	return (
		<div className="flex flex-col justify-center items-center">
			<div key={`day-${index}`} className={classNames('py-1 cursor-pointer rounded-full', dayNumberStyle)}>
				{day.getDate()}
			</div>

			<DayCheckCircle isChecked={isChecked} day={checkedInDayKey} habit={habit} type="medium" />
		</div>
	);
};

export default DayCircle;

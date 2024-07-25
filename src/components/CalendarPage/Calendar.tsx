import classNames from 'classnames';
import { areDatesEqual, getCalendarMonth } from '../../utils/date.utils';

const Calendar = () => {
	const currentDate = new Date();
	const calendarMonth = getCalendarMonth(currentDate.getFullYear(), currentDate.getMonth());

	console.log(calendarMonth);

	return (
		<div className="h-full flex flex-col">
			{calendarMonth.map((week, index) => (
				<div
					key={`week-${index}`}
					className={classNames(
						'grid grid-cols-7 flex-1 border-b border-color-gray-200',
						index === 0 ? 'border-t' : ''
					)}
				>
					{week.map((day, index) => {
						const isCurrentMonth = day.getMonth() === currentDate.getMonth();
						const isDayToday = areDatesEqual(new Date(), day);
						const appliedStyles = [];

						if (isCurrentMonth) {
							if (isDayToday) {
								appliedStyles.push('text-blue-500');
							} else {
								appliedStyles.push('text-white bg-transparent hover:bg-color-gray-20');
							}
						} else {
							appliedStyles.push('text-color-gray-100 bg-transparent hover:bg-color-gray-20');
						}

						return (
							<div
								key={`day-${index}`}
								className={classNames(
									`p-1 cursor-pointer`,
									appliedStyles,
									index !== 0 ? 'border-l border-color-gray-200' : ''
								)}
							>
								{day.getDate()}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
};

export default Calendar;

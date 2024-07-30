import classNames from 'classnames';
import { areDatesEqual, getCalendarMonth } from '../../utils/date.utils';

const Calendar = () => {
	const currentDate = new Date();
	const calendarMonth = getCalendarMonth(currentDate.getFullYear(), currentDate.getMonth());
	const shownWeeks = calendarMonth.slice(0, 4);

	return (
		<div className="h-full flex flex-col">
			<div className="grid grid-cols-7 mb-1">
				{calendarMonth[0].map((day) => (
					<div className="text-center text-color-gray-100">
						{day.toLocaleString('en-us', { weekday: 'short' })}
					</div>
				))}
			</div>
			<div className="flex-1 flex flex-col">
				{shownWeeks.map((week, index) => (
					<div
						key={`week-${index}`}
						className={classNames(
							'grid grid-cols-7 flex-1 border-color-gray-200',
							index === 0 ? 'border-t' : '',
							index !== shownWeeks.length - 1 ? 'border-b' : ''
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
										`p-[1px] cursor-pointer`,
										appliedStyles,
										index !== 0 ? 'border-l border-color-gray-200' : ''
									)}
								>
									<span className="pl-1">{day.getDate()}</span>

									<div className="space-y-1 text-white text-[11px] mt-1">
										<div className="bg-emerald-600 rounded p-1 truncate">
											3592 - Provisioning and Completed: Review Lines (Setup multiple lines at
											once)
										</div>
										<div className="bg-emerald-600 rounded p-1 truncate">
											3592 - Provisioning and Completed: Review Lines (Setup multiple lines at
											once)
										</div>
										<div className="bg-red-500 rounded p-1 truncate">
											3592 - Provisioning and Completed: Review Lines (Setup multiple lines at
											once)
										</div>
									</div>
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};

export default Calendar;

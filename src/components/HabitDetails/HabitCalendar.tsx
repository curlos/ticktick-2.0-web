import { getCalendarMonth } from '../../utils/date.utils';
import Icon from '../Icon';
import DayCircle from './DayCircle';

const HabitCalendar = ({ habit, currentDate, setCurrentDate }) => {
	const goToPreviousMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
	};

	const goToNextMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	};

	const calendarMonth = getCalendarMonth(currentDate.getFullYear(), currentDate.getMonth());
	const monthName = currentDate.toLocaleString('default', { month: 'long' });

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
								<DayCircle
									key={`${day} ${index}`}
									day={day}
									index={index}
									habit={habit}
									currentDate={currentDate}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HabitCalendar;

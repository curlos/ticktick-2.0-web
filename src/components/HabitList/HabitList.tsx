import { useState } from 'react';
import Icon from '../Icon';
import HeaderSection from './HeaderSection';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import classNames from 'classnames';
import { getDayNameAbbreviation, getLast7Days, getMonthAndDay } from '../../utils/date.utils';
import { areDatesEqual } from '../../utils/date.utils';

const HabitList = () => {
	// TODO: Use last seven days to find which habits have been completed in those 7 days
	const lastSevenDays = getLast7Days();
	const [selectedDay, setSelectedDay] = useState(lastSevenDays[lastSevenDays.length - 1]);

	const monthAndDay = getMonthAndDay(selectedDay);

	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
			<div className="p-4 h-full border-l border-r border-color-gray-200">
				<HeaderSection />

				<div className="grid grid-cols-7 gap-4 my-2">
					{lastSevenDays.map((day, index) => (
						<HabitDay key={index} day={day} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
					))}
				</div>

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
					/>
				</div>
			</div>
		</div>
	);
};

const HabitDay = ({ day, selectedDay, setSelectedDay }) => {
	// I think the percentage on TickTick 1.0 is just the percentage of habits you completed in a day from all your habits. Implement real values later.
	const getPercentage = () => {
		return 30;
	};

	const dayName = getDayNameAbbreviation(day);
	const dayOfMonth = day.getDate();

	console.log(dayName);

	const isSelectedDay = areDatesEqual(selectedDay, day);
	const isDayToday = areDatesEqual(new Date(), day);

	return (
		<div
			className={classNames(
				'flex flex-col justify-center items-center p-2 rounded-lg cursor-pointer',
				isSelectedDay ? 'bg-blue-500/40' : 'bg-color-gray-300',
				isDayToday ? 'text-blue-500' : 'text-color-gray-100'
			)}
			onClick={() => setSelectedDay(day)}
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

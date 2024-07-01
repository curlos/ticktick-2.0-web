import classNames from 'classnames';
import Icon from '../Icon';
import { useState } from 'react';
import OverviewStatsSection from './OverviewStatsSection';
import HabitCalendar from './HabitCalendar';
import TitleSection from './TitleSection';
import HabitLogSection from './HabitLogSection';

// Should kind of be like TaskDetails but for Habits
const HabitDetails = () => {
	const [currentDate, setCurrentDate] = useState(new Date());

	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
			<div className="p-4 h-full">
				<div className="pb-4">
					<TitleSection />
				</div>
				<div className="flex flex-col gap-3 overflow-auto gray-scrollbar pb-10">
					<OverviewStatsSection />
					<HabitCalendar currentDate={currentDate} setCurrentDate={setCurrentDate} />
					<HabitLogSection currentDate={currentDate} />
				</div>
			</div>
		</div>
	);
};

export default HabitDetails;

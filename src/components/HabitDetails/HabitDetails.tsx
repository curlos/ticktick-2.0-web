import classNames from 'classnames';
import Icon from '../Icon';
import { useState } from 'react';
import OverviewStatsSection from './OverviewStatsSection';
import HabitCalendar from './HabitCalendar';
import TitleSection from './TitleSection';

// Should kind of be like TaskDetails but for Habits
const HabitDetails = () => {
	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
			<div className="p-4 h-full flex flex-col gap-3">
				<TitleSection />
				<OverviewStatsSection />
				<HabitCalendar />
			</div>
		</div>
	);
};

// const HabitLogSection = () => (
// 	<div>
// 		<div></div>
// 	</div>
// );

export default HabitDetails;

import classNames from 'classnames';
import Icon from '../Icon';
import { useEffect, useState } from 'react';
import OverviewStatsSection from './OverviewStatsSection';
import HabitCalendar from './HabitCalendar';
import TitleSection from './TitleSection';
import HabitLogSection from './HabitLogSection';
import { useGetHabitSectionsQuery } from '../../services/resources/habitSectionsApi';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useParams } from 'react-router';

// Should kind of be like TaskDetails but for Habits
const HabitDetails = () => {
	const { habitId } = useParams();

	const [habit, setHabit] = useState(null);
	const [currentDate, setCurrentDate] = useState(new Date());

	// Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits, error: errorGetHabits } = useGetHabitsQuery();
	const { habits, habitsById } = fetchedHabits || {};

	// Habit Sections
	const {
		data: fetchedHabitSections,
		isLoading: isLoadingGetHabitSections,
		error: errorGetHabitSections,
	} = useGetHabitSectionsQuery();

	useEffect(() => {
		if (!habitId) {
			setHabit(null);
			return;
		}

		if (!habits) {
			return;
		}

		const newHabit = habitsById[habitId];
		setHabit(newHabit);
	}, [habitId, habits, habitsById]);

	if (!habit) {
		return <EmptyHabit />;
	}

	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
			<div className="p-4 h-full">
				<div className="pb-4">
					<TitleSection habit={habit} />
				</div>
				<div className="flex flex-col gap-3 overflow-auto gray-scrollbar pb-10">
					<OverviewStatsSection habit={habit} />
					<HabitCalendar habit={habit} currentDate={currentDate} setCurrentDate={setCurrentDate} />
					<HabitLogSection currentDate={currentDate} habit={habit} />
				</div>
			</div>
		</div>
	);
};

const EmptyHabit = () => (
	<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700 flex justify-center items-center text-[18px] text-color-gray-100">
		<div className="text-center space-y-5">
			<Icon
				name="ads_click"
				customClass={'text-color-gray-100 text-blue-500 !text-[50px] hover:text-white cursor-pointer'}
			/>
			<div>Click habit to view the details</div>
		</div>
	</div>
);

export default HabitDetails;

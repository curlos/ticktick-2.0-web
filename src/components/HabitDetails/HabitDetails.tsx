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
			return;
		}

		if (isLoadingGetHabits || isLoadingGetHabitSections) {
			return;
		}

		const newHabit = habitsById[habitId];
		setHabit(newHabit);
	}, [habitId, isLoadingGetHabits, isLoadingGetHabitSections]);

	console.log(habitId);
	console.log(habit);

	if (!habit) {
		return 'Habit Details';
	}

	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
			<div className="p-4 h-full">
				<div className="pb-4">
					<TitleSection habit={habit} />
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

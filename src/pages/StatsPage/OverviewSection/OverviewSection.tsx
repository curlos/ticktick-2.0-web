import { useStatsContext } from '../../../contexts/useStatsContext';
import DailyHoursFocusGoal from '../../TickTick-1.0/DailyHoursFocusGoal';
import MyAchievementScoreCard from './MyAchievementScoreCard';
import OverviewCard from './OverviewCard';
import RecentCompletionCurveCard from './RecentCompletionCurveCard';
import RecentCompletionRateCurveCard from './RecentCompletionRateCurveCard';
import RecentFocusedDurationCurveCard from './RecentFocusedDurationCurveCard';
import RecentPomoCurveCard from './RecentPomoCurveCard';
import WeeklyHabitStatusCard from './WeeklyHabitStatusCard';

const OverviewSection = () => {
	const { total } = useStatsContext();

	return (
		<div>
			<div className="bg-color-gray-600 p-4 rounded-md">
				<div className="flex justify-between items-center">
					<div className="flex gap-6">
						<div>
							<span className="font-bold">{total.numOfAllTasks}</span> Tasks
						</div>

						<div>
							<span className="font-bold">{total.numOfCompletedTasks}</span> Completed
						</div>

						<div>
							<span className="font-bold">{total.numOfProjects}</span> Projects
						</div>

						{/* TODO: Populate with real user account data after TickTick 2.0 is done. Use the date the account was created in to do so. */}
						<div>
							<span className="font-bold">{total.numOfDaysSinceAccountCreated}</span> Days
						</div>
					</div>
				</div>
			</div>

			{/* <div className="flex">
				<DailyHoursFocusGoal />
			</div> */}

			<div className="grid grid-cols-2 gap-5 mt-3">
				<OverviewCard />
				{/* I will probably replace this with the medals. Will have to create a design of some sorts first though. */}
				{/* <MyAchievementScoreCard /> */}
				<RecentCompletionCurveCard />
				{/* <RecentCompletionRateCurveCard /> */}
				<RecentPomoCurveCard />
				<RecentFocusedDurationCurveCard />
				{/* TODO: Possibly bring back if I go any further with implementing habits on TickTick 2.0. I'll have ot think about it. */}
				{/* <WeeklyHabitStatusCard /> */}
			</div>
		</div>
	);
};

export default OverviewSection;

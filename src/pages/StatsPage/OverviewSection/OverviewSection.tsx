import useGetRelevantStats from '../../../hooks/useGetRelevantStats';
import MyAchievementScoreCard from './MyAchievementScoreCard';
import OverviewCard from './OverviewCard';
import RecentCompletionCurveCard from './RecentCompletionCurveCard';
import RecentCompletionRateCurveCard from './RecentCompletionRateCurveCard';
import RecentFocusedDurationCurveCard from './RecentFocusedDurationCurveCard';
import RecentPomoCurveCard from './RecentPomoCurveCard';
import WeeklyHabitStatusCard from './WeeklyHabitStatusCard';

const OverviewSection = () => {
	const { total } = useGetRelevantStats();

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

			<div className="grid grid-cols-2 gap-5 mt-3">
				<OverviewCard />
				<MyAchievementScoreCard />
				<RecentCompletionCurveCard />
				<RecentCompletionRateCurveCard />
				<RecentPomoCurveCard />
				<RecentFocusedDurationCurveCard />
				<WeeklyHabitStatusCard />
			</div>
		</div>
	);
};

export default OverviewSection;

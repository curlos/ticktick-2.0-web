import MyAchievementScoreCard from './MyAchievementScoreCard';
import OverviewCard from './OverviewCard';
import RecentCompletionCurveCard from './RecentCompletionCurveCard';
import RecentCompletionRateCurveCard from './RecentCompletionRateCurveCard';
import RecentFocusedDurationCurveCard from './RecentFocusedDurationCurveCard';
import RecentPomoCurveCard from './RecentPomoCurveCard';

const OverviewSection = () => {
	return (
		<div>
			<div className="bg-color-gray-600 p-4 rounded-md">
				<div className="flex justify-between items-center">
					<div className="flex gap-6">
						<div>
							<span className="font-bold">3135</span> Tasks
						</div>

						<div>
							<span className="font-bold">1095</span> Completed
						</div>

						<div>
							<span className="font-bold">74</span> Lists
						</div>

						<div>
							<span className="font-bold">1349</span> Days
						</div>
					</div>

					<div>
						You are more productive than <span className="text-yellow-500 font-medium">72%</span>
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
			</div>
		</div>
	);
};

export default OverviewSection;

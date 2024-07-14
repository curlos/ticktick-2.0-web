import ClassifiedCompletionStatisticsCard from './ClassifiedCompletionStatisticsCard';
import CompletionRateDistributionCard from './CompletionRateDistributionCard';
import OverviewCard from './OverviewCard';

const TaskSection = () => {
	return (
		<div>
			<div>a</div>

			<div className="grid grid-cols-2 gap-5 mt-3">
				<OverviewCard />
				<CompletionRateDistributionCard />
				<ClassifiedCompletionStatisticsCard />

				<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[280px]">
					<h3 className="font-bold text-[16px]">Completion Rate Distribution</h3>

					<div className="flex-1 flex flex-col justify-center gap-7"></div>
				</div>
			</div>
		</div>
	);
};

export default TaskSection;

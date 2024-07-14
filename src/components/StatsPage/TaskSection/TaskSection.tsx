import ClassifiedCompletionStatisticsCard from './ClassifiedCompletionStatisticsCard';
import CompletionDistributionCard from './CompletionDistributionCard';
import CompletionRateDistributionCard from './CompletionRateDistributionCard';
import OverviewCard from './OverviewCard';

const TaskSection = () => {
	return (
		<div>
			<div>a</div>

			<div className="grid grid-cols-2 gap-5 mt-3">
				<OverviewCard />

				<CompletionDistributionCard />

				<CompletionRateDistributionCard />
				<ClassifiedCompletionStatisticsCard />
			</div>
		</div>
	);
};

export default TaskSection;

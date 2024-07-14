import TimeIntervalsButtonAndDropdown from './TimeIntervalsButtonAndDropdown';

const RecentCompletionCurveCard = () => {
	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[300px]">
			<div className="flex justify-between items-center">
				<h3 className="font-medium text-[16px]">Recent Completion Curve</h3>

				<TimeIntervalsButtonAndDropdown />
			</div>
		</div>
	);
};

export default RecentCompletionCurveCard;

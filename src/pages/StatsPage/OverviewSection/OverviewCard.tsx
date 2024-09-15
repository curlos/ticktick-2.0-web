import { useStatsContext } from '../../../contexts/useStatsContext';
import { getFormattedDuration } from '../../../utils/helpers.utils';

const OverviewCard = () => {
	const { total, today } = useStatsContext();

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<h3 className="font-bold text-[16px]">Overview</h3>

			<div className="flex-1 flex flex-col justify-center gap-7">
				<div className="grid grid-cols-3 w-full">
					<div className="text-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">
							{today.numOfCompletedTasks.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Today's Completion</div>
					</div>

					<div className="text-center p-2 border-l border-r border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">
							{today.numOfFocusRecords.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium text-[13.5px]">Today's Focus Records</div>
					</div>

					<div className="text-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">
							{getFormattedDuration(today.focusDuration, false)}
						</div>
						<div className="text-color-gray-100 font-medium">Today's Focus</div>
					</div>
				</div>

				<div className="grid grid-cols-3 w-full">
					<div className="text-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">
							{total.numOfCompletedTasks.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Total Completion</div>
					</div>

					<div className="text-center p-2 border-l border-r border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">
							{total.numOfFocusRecords.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Total Focus Records</div>
					</div>

					<div className="text-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">
							{getFormattedDuration(total.focusDuration, false)}
						</div>
						<div className="text-color-gray-100 font-medium">Total Focus Duration</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;

import { useEffect, useState } from 'react';
import Icon from '../../../components/Icon';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { getFormattedLongDay } from '../../../utils/date.utils';

const OverviewCard = ({ selectedTimeInterval, selectedDates }) => {
	const { completedTasksGroupedByDate } = useStatsContext();
	const [numOfCompletedTasksForInterval, setNumOfCompletedTasksForInterval] = useState(0);

	useEffect(() => {
		if (!completedTasksGroupedByDate) {
			return;
		}

		setNumOfCompletedTasksForInterval(getNumOfCompletedTasksFromSelectedDates(selectedDates));
	}, [completedTasksGroupedByDate, selectedDates]);

	const getNumOfCompletedTasksFromSelectedDates = (selectedDates) => {
		let sum = 0;

		for (let date of selectedDates) {
			const dateKey = getFormattedLongDay(date);
			const completedTasksArr = completedTasksGroupedByDate[dateKey];
			sum += completedTasksArr?.length || 0;
		}

		return sum;
	};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[280px]">
			<h3 className="font-bold text-[16px]">Overview</h3>

			<div className="flex-1 flex flex-col justify-center gap-7">
				<div className="grid grid-cols-1 w-full">
					<div className="flex flex-col items-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">{numOfCompletedTasksForInterval}</div>
						<div className="text-color-gray-100 font-medium">Completed Task</div>
						<div className="text-color-gray-100 flex items-center gap-1">
							<div>1 from yesterday</div>
							<Icon name="arrow_upward" fill={1} customClass={'text-emerald-500 !text-[18px]'} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;

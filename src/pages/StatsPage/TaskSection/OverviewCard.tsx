import { useEffect, useState } from 'react';
import Icon from '../../../components/Icon';
import { useStatsContext } from '../../../contexts/useStatsContext';
import {
	getAllDaysInMonthFromDate,
	getAllDaysInWeekFromDate,
	getAllDaysInYearFromDate,
} from '../../../utils/date.utils';
import classNames from 'classnames';

const OverviewCard = ({ selectedTimeInterval, selectedDates }) => {
	const { completedTasksGroupedByDate, getCompletedTasksFromSelectedDates } = useStatsContext() || {};
	const [numOfCompletedTasksForInterval, setNumOfCompletedTasksForInterval] = useState(0);
	const [diffOfCompletedTasksFromPrevInterval, setDiffOfCompletedTasksFromPrevInterval] = useState({
		numDiff: 0,
		lessThanPrev: false,
	});

	useEffect(() => {
		if (!completedTasksGroupedByDate) {
			return;
		}

		const prevIntervalDates = getPrevIntervalDates();
		const currIntervalDates = selectedDates;
		const prevIntervalCompletedTasks = getCompletedTasksFromSelectedDates(prevIntervalDates).length;
		const currIntervalCompletedTasks = getCompletedTasksFromSelectedDates(currIntervalDates).length;

		setNumOfCompletedTasksForInterval(currIntervalCompletedTasks);
		setDiffOfCompletedTasksFromPrevInterval({
			numDiff: Math.abs(currIntervalCompletedTasks - prevIntervalCompletedTasks),
			lessThanPrev: currIntervalCompletedTasks < prevIntervalCompletedTasks,
		});
	}, [completedTasksGroupedByDate, selectedDates]);

	const getPrevIntervalDates = () => {
		const date = new Date(selectedDates[0]);

		switch (selectedTimeInterval) {
			case 'Day':
				date.setDate(date.getDate() - 1);
				return [date];
			case 'Week':
				date.setDate(date.getDate() - 7);
				return getAllDaysInWeekFromDate(date);
			case 'Month':
				date.setMonth(date.getMonth() + -1);
				return getAllDaysInMonthFromDate(date);
			case 'Year':
				date.setFullYear(date.getFullYear() + -1);
				return getAllDaysInYearFromDate(date);
			default:
				return [];
		}
	};

	const getPrevIntervalName = () => {
		switch (selectedTimeInterval) {
			case 'Day':
				return 'yesterday';
			case 'Week':
				return 'last week';
			case 'Month':
				return 'last month';
			case 'Year':
				return 'last year';
			default:
				return 'yesterday';
		}
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
							<div>
								{diffOfCompletedTasksFromPrevInterval.numDiff} from {getPrevIntervalName()}
							</div>
							<Icon
								name={
									diffOfCompletedTasksFromPrevInterval.lessThanPrev
										? 'arrow_downward'
										: 'arrow_upward'
								}
								fill={1}
								customClass={classNames(
									'!text-[18px]',
									diffOfCompletedTasksFromPrevInterval.lessThanPrev
										? 'text-red-500'
										: 'text-emerald-500'
								)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;

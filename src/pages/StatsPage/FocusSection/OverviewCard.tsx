import { useEffect, useState } from 'react';
import Icon from '../../../components/Icon';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { getFocusDurationFromArray, getFormattedDuration } from '../../../utils/helpers.utils';
import { getFormattedLongDay } from '../../../utils/date.utils';
import classNames from 'classnames';

const OverviewCard = () => {
	const { total, today, focusRecordsGroupedByDate } = useStatsContext();

	const [diffTodayFromYesterdayFocusRecords, setDiffTodayFromYesterdayFocusRecords] = useState({
		numDiff: 0,
		lessThanYesterday: false,
	});
	const [diffTodayFromYesterdayFocusDuration, setDiffTodayFromYesterdayFocusDuration] = useState({
		numDiff: 0,
		lessThanYesterday: false,
	});

	useEffect(() => {
		if (!focusRecordsGroupedByDate || !today) {
			return;
		}

		const yesterdayDate = new Date();
		yesterdayDate.setDate(yesterdayDate.getDate() - 1);
		const yesterdayDateKey = getFormattedLongDay(yesterdayDate);

		const yesterdayFocusRecords = focusRecordsGroupedByDate[yesterdayDateKey] || [];
		const yesterdayFocusDuration = getFocusDurationFromArray(yesterdayFocusRecords);

		setDiffTodayFromYesterdayFocusRecords({
			numDiff: Math.abs(today.numOfFocusRecords - yesterdayFocusRecords.length),
			lessThanYesterday: today.numOfFocusRecords < yesterdayFocusRecords.length,
		});

		setDiffTodayFromYesterdayFocusDuration({
			numDiff: Math.abs(today.focusDuration - yesterdayFocusDuration),
			lessThanYesterday: today.focusDuration < yesterdayFocusDuration,
		});
	}, [focusRecordsGroupedByDate, today]);

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col">
			<h3 className="font-bold text-[16px]">Overview</h3>

			<div className="flex-1 flex flex-col justify-center gap-7">
				<div className="grid grid-cols-4 w-full">
					<div className="flex flex-col items-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">{today.numOfFocusRecords}</div>
						<div className="text-color-gray-100 font-medium">Today's Focus Records</div>
						<div className="text-color-gray-100 flex items-center gap-1">
							<div>{diffTodayFromYesterdayFocusRecords.numDiff} from yesterday</div>
							<Icon
								name={classNames(
									diffTodayFromYesterdayFocusRecords.lessThanYesterday
										? 'arrow_downward'
										: 'arrow_upward'
								)}
								fill={1}
								customClass={classNames(
									'!text-[18px]',
									diffTodayFromYesterdayFocusRecords.lessThanYesterday
										? 'text-red-500'
										: 'text-emerald-500'
								)}
							/>
						</div>
					</div>

					<div className="flex flex-col items-center p-2 border-l border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">{total.numOfFocusRecords}</div>
						<div className="text-color-gray-100 font-medium">Total Focus Records</div>
					</div>

					<div className="flex flex-col items-center p-2 border-l border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">
							{getFormattedDuration(today.focusDuration, false)}
						</div>
						<div className="text-color-gray-100 font-medium">Today's Focus</div>
						<div className="text-color-gray-100 flex items-center gap-1">
							<div>
								{getFormattedDuration(diffTodayFromYesterdayFocusDuration.numDiff, false)} from
								yesterday
							</div>
							<Icon
								name={classNames(
									diffTodayFromYesterdayFocusDuration.lessThanYesterday
										? 'arrow_downward'
										: 'arrow_upward'
								)}
								fill={1}
								customClass={classNames(
									'!text-[18px]',
									diffTodayFromYesterdayFocusDuration.lessThanYesterday
										? 'text-red-500'
										: 'text-emerald-500'
								)}
							/>
						</div>
					</div>

					<div className="flex flex-col items-center p-2 border-l border-color-gray-150">
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

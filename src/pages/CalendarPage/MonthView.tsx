import classNames from 'classnames';
import { areDatesEqual, formatCheckedInDayDate, formatDateTime, getCalendarMonth } from '../../utils/date.utils';
import { useEffect, useRef, useState } from 'react';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../services/resources/tasksApi';
import DropdownDayFocusRecords from './DropdownDayFocusRecords';
import MiniFocusRecord from './MiniFocusRecord';
import useWindowSize from '../../hooks/useWindowSize';

const MonthView = () => {
	// RTK Query - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { sortedGroupedFocusRecordsAsc } = fetchedFocusRecords || {};

	const currentDate = new Date();
	const calendarMonth = getCalendarMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);
	const shownWeeks = calendarMonth;

	const [maxFocusRecords, setMaxFocusRecords] = useState(4);

	const { height } = useWindowSize();
	console.log(height);

	useEffect(() => {
		const newMaxFocusRecords = getMaxFocusRecordsFor6Weeks();
		setMaxFocusRecords(newMaxFocusRecords);
	}, [height]);

	// TODO: This works only for 6 weeks and has been tested on desktop only. For Mobile, this will of course be completely different and if there's less than 6 weeks (1 through 5 weeks), then we can show more of course. Needs to be added later.
	const getMaxFocusRecordsFor6Weeks = () => {
		console.log('a');
		console.log(height);
		if (height) {
			if (height >= 1080) return 5;
			if (height >= 820) return 4;
			if (height >= 670) return 3;
			if (height >= 530) return 2;
		}

		return 1;
	};

	console.log(maxFocusRecords);

	return (
		<div className="h-full max-h-screen flex-1 flex flex-col">
			<div className="grid grid-cols-7 mb-1">
				{calendarMonth[0].map((day) => (
					<div key={day.toLocaleDateString()} className="text-center text-color-gray-100">
						{day.toLocaleString('en-us', { weekday: 'short' })}
					</div>
				))}
			</div>
			<div className="flex-1 flex flex-col">
				{shownWeeks.map((week, index) => (
					<div
						key={`week-${index}`}
						className={classNames(
							'grid grid-cols-7 flex-1 border-color-gray-200',
							index === 0 ? 'border-t' : '',
							index !== shownWeeks.length - 1 ? 'border-b' : ''
						)}
					>
						{week.map((day, index) => {
							const isCurrentMonth = day.getMonth() === currentDate.getMonth();
							const isDayToday = areDatesEqual(new Date(), day);
							const appliedStyles = [];

							if (isCurrentMonth) {
								if (isDayToday) {
									appliedStyles.push('text-blue-500');
								} else {
									appliedStyles.push('text-white bg-transparent hover:bg-color-gray-20');
								}
							} else {
								appliedStyles.push('text-color-gray-100 bg-transparent hover:bg-color-gray-20');
							}

							const formattedDay = formatCheckedInDayDate(day);

							const focusRecordsForTheDay =
								sortedGroupedFocusRecordsAsc && sortedGroupedFocusRecordsAsc[formattedDay];

							const remainingRowsToBeFilled = focusRecordsForTheDay
								? focusRecordsForTheDay.slice(0, maxFocusRecords).length - maxFocusRecords
								: maxFocusRecords;
							const allRowsFilled = remainingRowsToBeFilled <= 0;
							const emptyRows =
								(!allRowsFilled &&
									Array.from({ length: remainingRowsToBeFilled }, (_, index) => index + 1)) ||
								[];

							// if (focusRecordsForTheDay) {
							// 	console.log(emptyRows);
							// }

							return (
								<div
									key={`day-${index}`}
									className={classNames(
										`p-[1px] w-full`,
										appliedStyles,
										index !== 0 ? 'border-l border-color-gray-200' : ''
									)}
								>
									<span className="pl-1">{day.getDate()}</span>

									<div className="space-y-1 text-white text-[11px] mt-1 px-[2px] w-full">
										<DayFocusRecordsList
											focusRecordsForTheDay={focusRecordsForTheDay}
											maxFocusRecords={maxFocusRecords}
										/>

										{emptyRows.map((row) => (
											<div
												key={row}
												className="bg-transparent rounded p-1 py-[2px] truncate h-[20px]"
											></div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};

const DayFocusRecordsList = ({ focusRecordsForTheDay, maxFocusRecords }) => {
	const shownFocusRecords = focusRecordsForTheDay?.slice(0, maxFocusRecords);

	return shownFocusRecords?.map((focusRecord, index) => (
		<MiniFocusRecord
			key={focusRecord._id}
			focusRecord={focusRecord}
			index={index}
			maxFocusRecords={maxFocusRecords}
			focusRecordsForTheDay={focusRecordsForTheDay}
			shownFocusRecords={shownFocusRecords}
		/>
	));
};

export default MonthView;

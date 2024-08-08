import classNames from 'classnames';
import { areDatesEqual, formatCheckedInDayDate, formatDateTime, getCalendarMonth } from '../../utils/date.utils';
import { useState } from 'react';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { useGetHabitsQuery } from '../../services/resources/habitsApi';
import { useGetTasksQuery } from '../../services/resources/tasksApi';

const MonthView = () => {
	// RTK Query - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { sortedGroupedFocusRecordsAsc } = fetchedFocusRecords || {};

	// RTK Query - Tasks
	const { data: fetchedTasks } = useGetTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - Habits
	const { data: fetchedHabits } = useGetHabitsQuery();
	const { habitsById } = fetchedHabits || {};

	const currentDate = new Date();
	const calendarMonth = getCalendarMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);
	const shownWeeks = calendarMonth;

	return (
		<div className="h-full flex-1 flex flex-col">
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

							const maxFocusRecords = 4;
							const remainingRowsToBeFilled = focusRecordsForTheDay
								? focusRecordsForTheDay.slice(0, maxFocusRecords).length - maxFocusRecords
								: maxFocusRecords;
							const allRowsFilled = remainingRowsToBeFilled <= 0;
							const emptyRows =
								(!allRowsFilled &&
									Array.from({ length: remainingRowsToBeFilled }, (_, index) => index + 1)) ||
								[];

							if (focusRecordsForTheDay) {
								console.log(emptyRows);
							}

							const thereAreLeftoverFocusRecords = focusRecordsForTheDay?.length > maxFocusRecords;
							const shownFocusRecords = focusRecordsForTheDay?.slice(0, maxFocusRecords);

							return (
								<div
									key={`day-${index}`}
									className={classNames(
										`p-[1px] cursor-pointer w-full`,
										appliedStyles,
										index !== 0 ? 'border-l border-color-gray-200' : ''
									)}
								>
									<span className="pl-1">{day.getDate()}</span>

									<div className="space-y-1 text-white text-[11px] mt-1 px-[2px] w-full">
										{shownFocusRecords?.map((focusRecord, i) => {
											const { taskId, habitId, startTime } = focusRecord;
											const task = tasksById[taskId];
											const habit = habitsById[habitId];
											const name = task?.title || habit?.name;
											const isLastFocusRecord = shownFocusRecords.length - 1 === i;

											return (
												<div className="flex items-center gap-1 w-full opacity-70">
													<div
														className={classNames(
															'bg-emerald-600 rounded p-1 py-[2px] h-[20px] flex justify-between flex-1',
															// Necessary for the focus records with "+X" at the end.
															'w-[88%]'
														)}
													>
														<span className="truncate">{name}</span>
														<span className="text-gray-200 min-w-[55px]">
															{formatDateTime(startTime).time}
														</span>
													</div>

													{isLastFocusRecord && thereAreLeftoverFocusRecords && (
														<div className="bg-gray-400/70 p-[2px] rounded">+X</div>
													)}
												</div>
											);
										})}

										{emptyRows.map((row) => (
											<div className="bg-transparent rounded p-1 py-[2px] truncate h-[20px]"></div>
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

export default MonthView;

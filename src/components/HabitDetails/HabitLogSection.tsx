import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getFormattedDuration } from '../../utils/helpers.utils';
import Icon from '../Icon';
import { useState } from 'react';
import classNames from 'classnames';
import { getMonthAndYear, getSortedObjectsByDate, groupByMonthAndYear } from '../../utils/date.utils';
import { useGetHabitLogsQuery, usePermanentlyDeleteHabitLogMutation } from '../../services/resources/habitLogsApi';
import { setModalState } from '../../slices/modalSlice';
import { useDispatch } from 'react-redux';
import useHandleError from '../../hooks/useHandleError';

const HabitLogSection = ({ currentDate, habit }) => {
	// RTK Query - Habit Logs
	const { data: fetchedHabitLogs } = useGetHabitLogsQuery();
	const { habitLogsById } = fetchedHabitLogs || {};

	const monthName = currentDate.toLocaleString('default', { month: 'long' });
	// TODO: Get list of habits from the backend and show that data instead.
	const { checkedInDays } = habit;

	const groupedByMonthYear = groupByMonthAndYear(checkedInDays);
	const monthAndYearKey = getMonthAndYear(currentDate);
	const checkedInDaysForTheMonth = groupedByMonthYear[monthAndYearKey];
	const sortedCheckedInDays = checkedInDaysForTheMonth && getSortedObjectsByDate(checkedInDaysForTheMonth);
	const habitLogsForTheMonth =
		sortedCheckedInDays && sortedCheckedInDays.filter((checkedInDay) => checkedInDay.habitLogId);

	return (
		<div className="bg-color-gray-600 rounded-lg p-3">
			<div className="mb-5 font-medium text-[14px]">Habit Log for {monthName}</div>
			{habitLogsById && habitLogsForTheMonth?.length > 0 ? (
				<div>
					{habitLogsForTheMonth.map((checkedInDay, index) => (
						<HabitLogDay
							key={index}
							checkedInDay={checkedInDay}
							isLastInList={index === habitLogsForTheMonth.length - 1}
							habitLogsById={habitLogsById}
							habit={habit}
						/>
					))}
				</div>
			) : (
				<div className="text-color-gray-100">No check-in thoughts to share this month yet.</div>
			)}
		</div>
	);
};

const HabitLogDay = ({ checkedInDay, isLastInList, habitLogsById, habit }) => {
	const dispatch = useDispatch();
	const handleError = useHandleError();
	const [permanentlyDeleteHabitLog] = usePermanentlyDeleteHabitLogMutation();

	const isChecked = checkedInDay.isAchieved;
	const { habitLogId, date, isAchieved } = checkedInDay;
	let habitLogContent = '';

	const habitLog = habitLogsById[habitLogId];

	if (habitLog) {
		habitLogContent = habitLog.content;
	}

	const iconStyleClass =
		'text-color-gray-100 hover:bg-color-gray-200 p-1 rounded !text-[18px] cursor-pointer mr-[-2px]';

	const handleShowEditHabitLogModal = (e) => {
		e.stopPropagation();

		dispatch(
			setModalState({
				modalId: 'ModalAddHabitLog',
				isOpen: true,
				props: { habit, checkedInDay, checkedInDayKey: date },
			})
		);
	};

	const handleDelete = (e) => {
		e.stopPropagation();

		if (habit.isArchived) {
			return;
		}

		handleError(async () => {
			await permanentlyDeleteHabitLog(habitLogId).unwrap();
		});
	};

	return (
		<li
			key={date}
			className="group relative m-0 list-none last:mb-[4px] mt-[12px] cursor-pointer"
			style={{ minHeight: '54px' }}
			onClick={handleShowEditHabitLogModal}
		>
			{!isLastInList && (
				<div
					className="absolute top-[28px] left-[11px] h-full border-solid border-l-[1px] border-blue-900"
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				<div
					className={classNames(
						'absolute left-[-40px] w-[24px] h-[24px] rounded-full flex items-center justify-center',
						isChecked ? 'bg-blue-500' : 'bg-transparent border border-blue-800'
					)}
				>
					{isChecked && <Icon name="check" fill={0} customClass={'text-white !text-[22px] cursor-pointer'} />}

					{isAchieved === false && (
						<Icon
							name="close"
							fill={0}
							customClass={'text-red-500 !text-[18px] cursor-pointer mr-[-2px]'}
						/>
					)}
				</div>

				<div className="flex justify-between">
					<div>
						<div className="font-medium">{date}</div>

						<div className="text-color-gray-100 max-w-[350px] break-words">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>{habitLogContent}</ReactMarkdown>
						</div>
					</div>

					<div
						className={classNames(
							'flex items-center gap-1 opacity-0',
							!habit.isArchived && 'group-hover:opacity-100 transition-opacity duration-100'
						)}
					>
						<Icon
							name="edit"
							fill={0}
							customClass={iconStyleClass}
							onClick={(e) => {
								e.stopPropagation();

								if (!habit.isArchived) {
									handleShowEditHabitLogModal(e);
								}
							}}
						/>

						<Icon name="delete" fill={0} customClass={iconStyleClass} onClick={handleDelete} />
					</div>
				</div>
			</div>
		</li>
	);
};

export default HabitLogSection;

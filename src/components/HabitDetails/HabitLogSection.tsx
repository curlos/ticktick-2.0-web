import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getFormattedDuration } from '../../utils/helpers.utils';
import Icon from '../Icon';
import { useState } from 'react';
import classNames from 'classnames';
import { getMonthAndYear, getSortedObjectsByDate, groupByMonthAndYear } from '../../utils/date.utils';
import { useGetHabitLogQuery } from '../../services/resources/habitLogsApi';

const HabitLogSection = ({ currentDate, habit }) => {
	const { data: fetchedHabitLogs } = useGetHabitLogQuery();
	const { habitLogsById } = fetchedHabitLogs || {};

	const monthName = currentDate.toLocaleString('default', { month: 'long' });
	// TODO: Get list of habits from the backend and show that data instead.
	const { checkedInDays } = habit;

	const groupedByMonthYear = groupByMonthAndYear(checkedInDays);
	const monthAndYearKey = getMonthAndYear(currentDate);
	const checkedInDaysForTheMonth = groupedByMonthYear[monthAndYearKey];
	const sortedCheckedInDays = getSortedObjectsByDate(checkedInDaysForTheMonth);

	const [habitLogsForTheMonth, setHabitLogsForTheMonth] = useState(sortedCheckedInDays);

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
						/>
					))}
				</div>
			) : (
				<div className="text-color-gray-100">No check-in thoughts to share this month yet.</div>
			)}
		</div>
	);
};

const HabitLogDay = ({ checkedInDay, isLastInList, habitLogsById }) => {
	// TODO: Get from backend!
	const isChecked = checkedInDay.isAchieved;
	const { habitLogId, date, isAchieved } = checkedInDay;
	let habitLogContent = '';

	if (habitLogId) {
		const habitLog = habitLogsById[habitLogId];

		if (habitLog) {
			habitLogContent = habitLog.content;
		}
	} else {
		return null;
	}

	console.log(checkedInDay);

	return (
		<li
			key={'June 30'}
			className="relative m-0 list-none last:mb-[4px] mt-[12px] cursor-pointer"
			style={{ minHeight: '54px' }}
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

				<div>
					<div className="font-medium">{date}</div>

					<div className="text-color-gray-100 max-w-[350px] break-words">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{habitLogContent}</ReactMarkdown>
					</div>
				</div>
			</div>
		</li>
	);
};

export default HabitLogSection;

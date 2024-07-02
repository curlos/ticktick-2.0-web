import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getFormattedDuration } from '../../utils/helpers.utils';
import Icon from '../Icon';
import { useState } from 'react';
import classNames from 'classnames';

const HabitLogSection = ({ currentDate }) => {
	const monthName = currentDate.toLocaleString('default', { month: 'long' });
	// TODO: Get list of habits from the backend and show that data instead.
	const [habitLogsForTheMonth, setHabitLogsForTheMonth] = useState(['hi', 'hi', 'hi', 'hi']);

	return (
		<div className="bg-color-gray-600 rounded-lg p-3">
			<div className="mb-5 font-medium text-[14px]">Habit Log on {monthName}</div>
			{habitLogsForTheMonth?.length > 0 ? (
				<div>
					{habitLogsForTheMonth.map((habitLogData, index) => (
						<HabitLogDay
							key={index}
							habitLogData={habitLogData}
							isLastInList={index === habitLogsForTheMonth.length - 1}
						/>
					))}
				</div>
			) : (
				<div className="text-color-gray-100">No check-in thoughts to share this month yet.</div>
			)}
		</div>
	);
};

const HabitLogDay = ({ habitLogData, isLastInList }) => {
	// TODO: Get from backend!
	const [isChecked, setIsChecked] = useState(true);

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
					<Icon
						name="check"
						fill={0}
						customClass={classNames(
							'text-white !text-[22px] cursor-pointer',
							!isChecked ? 'invisible' : ''
						)}
					/>
				</div>

				<div>
					<div className="font-medium">Sun, June 30</div>

					<div className="text-color-gray-100 max-w-[350px] break-words">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							Metroid Prime Remastered is a great game so far!
						</ReactMarkdown>
					</div>
				</div>
			</div>
		</li>
	);
};

export default HabitLogSection;

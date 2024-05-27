import classNames from 'classnames';
import { isTaskOverdue } from '../utils/helpers.utils';
import Icon from './Icon';

const TaskDueDateText = ({ dueDate, showCalendarIcon = false, showShortVersion }) => {
	const isOverdue = dueDate && isTaskOverdue(dueDate);

	function formatDueDate(dueDate) {
		const date = new Date(dueDate);

		// Since 'dueDate' is provided at '00:00:00' for the respective EST/EDT time zone,
		// and you want to show only the date if it is midnight, check this condition:
		const isMidnight = date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;

		const options = showShortVersion
			? {
					month: 'short', // Full month name
					day: 'numeric', // Day of the month
				}
			: isMidnight
				? {
						year: 'numeric', // Full year
						month: 'long', // Full month name
						day: 'numeric', // Day of the month
					}
				: {
						year: 'numeric', // Full year
						month: 'long', // Full month name
						day: 'numeric', // Day of the month
						hour: 'numeric', // Hour (in 12-hour AM/PM format)
						minute: '2-digit', // Minute with leading zeros
						hour12: true, // Use AM/PM
					};

		return date.toLocaleString('en-US', options);
	}

	return (
		<div className="flex items-center gap-1 cursor-pointer">
			{showCalendarIcon && (
				<Icon
					name="calendar_month"
					customClass={classNames(
						'!text-[20px] hover:text-white cursor-pointer',
						isOverdue ? 'text-red-500' : dueDate ? 'text-blue-500' : 'text-color-gray-100'
					)}
				/>
			)}

			{dueDate ? (
				<div className={isOverdue ? 'text-red-500' : 'text-blue-500'}>{formatDueDate(dueDate)}</div>
			) : (
				'Due Date'
			)}
		</div>
	);
};

export default TaskDueDateText;

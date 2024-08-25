import classNames from 'classnames';
import { isTimeWithin25Minutes } from '../../../utils/date.utils';

const SidebarHourBlockList = ({ allHours, dueDateIsToday, todayDateObj, fromWeekView }) => {
	return (
		<div className="py-1 px-2 w-[90px] text-right">
			<div>
				{allHours.map((hour) => {
					const isWithin25MinOfCurrentTime = dueDateIsToday && isTimeWithin25Minutes(hour, todayDateObj);

					return (
						<div
							key={hour}
							className={classNames(
								'text-color-gray-100 text-[12px]',
								isWithin25MinOfCurrentTime && 'invisible',
								fromWeekView ? 'h-[60px]' : 'h-[60px]'
							)}
						>
							{hour}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SidebarHourBlockList;

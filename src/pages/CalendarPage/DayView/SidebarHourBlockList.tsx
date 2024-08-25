import classNames from 'classnames';
import { isTimeWithin25Minutes } from '../../../utils/date.utils';

const SidebarHourBlockList = ({ allHours, dueDateIsToday, todayDateObj }) => {
	return (
		<div className="py-1 px-2 w-[90px] text-right">
			<div>
				{allHours.map((hour) => {
					const isWithin25MinOfCurrentTime = dueDateIsToday && isTimeWithin25Minutes(hour, todayDateObj);

					return (
						<div
							key={hour}
							className={classNames(
								'text-color-gray-100 text-[12px] h-[60px]',
								isWithin25MinOfCurrentTime && 'invisible'
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

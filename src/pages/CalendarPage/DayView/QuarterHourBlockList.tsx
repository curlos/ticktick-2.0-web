import classNames from 'classnames';
import DropdownAddNewTaskDetails from '../../../components/Dropdown/DropdownAddNewTaskDetails';
import useContextMenu from '../../../hooks/useContextMenu';
import { generateQuarterHourDates } from '../../../utils/date.utils';

const QuarterHourBlock = ({ date, fromWeekView }) => {
	// Format to local time string and remove minutes and seconds
	const formattedHour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	const contextMenuObj = useContextMenu();
	const { contextMenu, handleContextMenu } = contextMenuObj;

	return (
		<div
			className={classNames('h-[15px]')}
			onClick={(e) => {
				e.stopPropagation();
				handleContextMenu(e);
			}}
		>
			<div
				className={classNames(
					'text-[11px] w-full h-full bg-blue-500 text-white rounded px-1',
					!contextMenu && 'invisible'
				)}
			>
				{formattedHour}
			</div>

			<DropdownAddNewTaskDetails contextMenuObj={contextMenuObj} defaultDueDate={date} />
		</div>
	);
};

const QuarterHourBlockList = ({ allHours, currDueDate, fromWeekView }) => {
	return (
		<div>
			{allHours.map((hour) => {
				const quarterHours = generateQuarterHourDates(currDueDate, hour);

				return (
					<div
						key={hour}
						className={classNames(
							'text-color-gray-100 text-[12px] w-full border-l border-b border-color-gray-200',
							fromWeekView ? 'h-[60px]' : 'h-[60px]'
						)}
					>
						{quarterHours.map((quarterHourDate) => (
							<QuarterHourBlock
								key={quarterHourDate.toISOString()}
								date={quarterHourDate}
								fromWeekView={fromWeekView}
							/>
						))}
					</div>
				);
			})}
		</div>
	);
};

export default QuarterHourBlockList;

import useResizeObserver from '../../../hooks/useResizeObserver';
import classNames from 'classnames';
import { useRef } from 'react';
import DropdownAddNewTaskDetails from '../../../components/Dropdown/DropdownAddNewTaskDetails';
import useContextMenu from '../../../hooks/useContextMenu';
import MiniActionItem from '../MiniActionItem';
import { useCalendarContext } from '../../../contexts/useCalendarContext';
import { getMonthDayString } from '../../../utils/date.utils';

const StickyHeader = ({
	setMiniTopHeaderValues,
	setFormattedDayWidth,
	formattedDay,
	dueDateIsToday,
	safeTasks,
	actionItems,
	flattenedActionItems,
	currDueDate,
	fromWeekView,
}) => {
	const { selectedInterval, multiDays } = useCalendarContext();

	const contextMenuObj = useContextMenu();
	const { contextMenu, handleContextMenu } = contextMenuObj;

	const miniTopHeaderRef = useRef(null);
	// Observe changes in height for the miniTopHeaderRef element
	useResizeObserver(miniTopHeaderRef, setMiniTopHeaderValues, ['height', 'width']);

	const formattedDayRef = useRef(null);
	// Observe changes in width for the formattedDayRef element
	useResizeObserver(formattedDayRef, setFormattedDayWidth, 'width');

	const finalFormattedDay =
		selectedInterval === 'Multi-Day' && multiDays > 7 ? getMonthDayString(new Date(formattedDay)) : formattedDay;

	return (
		<div className="flex-1 flex">
			{!fromWeekView && <div className="w-[90px]" />}
			<div
				ref={miniTopHeaderRef}
				className={classNames(
					'border-l border-b border-color-gray-200 p-1 flex-1 max-h-[150px] overflow-auto gray-scrollbar',
					contextMenu && 'bg-color-gray-200'
				)}
				onClick={(e) => {
					e.stopPropagation();
					handleContextMenu(e);
				}}
			>
				<div ref={formattedDayRef} className={classNames('font-bold', dueDateIsToday && 'text-blue-500')}>
					{finalFormattedDay}
				</div>

				<div className="space-y-[2px] my-3 text-[13px]">
					{safeTasks.map((task, index) => (
						<MiniActionItem
							key={task._id}
							index={index}
							task={task}
							actionItems={actionItems}
							flattenedActionItems={flattenedActionItems}
							shownActionItems={flattenedActionItems}
							formattedDay={formattedDay}
						/>
					))}
				</div>
			</div>

			<DropdownAddNewTaskDetails contextMenuObj={contextMenuObj} defaultDueDate={currDueDate} />
		</div>
	);
};

export default StickyHeader;

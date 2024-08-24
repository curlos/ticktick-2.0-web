import { useEffect, useRef, useState } from 'react';
import {
	areDatesEqual,
	formatCheckedInDayDate,
	generateQuarterHourDates,
	getAllHours,
	getTimeString,
	isTimeWithin25Minutes,
} from '../../utils/date.utils';
import MiniActionItem from './MiniActionItem';
import DropdownAddNewTaskDetails from '../../components/Dropdown/DropdownAddNewTaskDetails';
import useContextMenu from '../../hooks/useContextMenu';
import classNames from 'classnames';
import useMaxHeight from '../../hooks/useMaxHeight';
import { useCalendarContext } from '../../contexts/useCalendarContext';
import { secondsToMinutes } from '../../utils/helpers.utils';
import useResizeObserver from '../../hooks/useResizeObserver';

const DayView = ({ groupedItemsByDateObj, currDueDate }) => {
	const { allItemsGroupedByDate } = groupedItemsByDateObj;

	const contextMenuObj = useContextMenu();
	const { contextMenu, handleContextMenu } = contextMenuObj;

	const formattedDayRef = useRef(null);
	const [formattedDayWidth, setFormattedDayWidth] = useState(0);

	const [miniTopHeaderHeight, setMiniTopHeaderHeight] = useState(0);
	const miniTopHeaderRef = useRef(null);

	const { headerHeight } = useCalendarContext();
	const maxHeight = useMaxHeight(headerHeight + miniTopHeaderHeight);

	const allHours = getAllHours();

	// Observe changes in width for the formattedDayRef element
	useResizeObserver(formattedDayRef, setFormattedDayWidth, 'width');

	// Observe changes in height for the miniTopHeaderRef element
	useResizeObserver(miniTopHeaderRef, setMiniTopHeaderHeight, 'height');

	const formattedDay = formatCheckedInDayDate(currDueDate);
	const actionItems = allItemsGroupedByDate[formattedDay] || {};
	const { tasks, focusRecords } = actionItems;
	const safeTasks = tasks ? tasks : [];
	const safeFocusRecords = focusRecords ? focusRecords : [];
	const flattenedActionItems = [...safeTasks, ...safeFocusRecords];

	const getTopPositioningFromTime = (date) => {
		// Extract the hours and minutes
		const hours = date.getHours();
		const minutes = date.getMinutes();

		// Calculate top position: each hour block is 60px, and each minute is 1px
		const topPosition = hours * 60 + minutes;

		return topPosition;
	};

	const getHeightValue = (focusRecord) => {
		let heightValue = 20;
		const { duration } = focusRecord;
		const durationInMinutes = secondsToMinutes(duration);

		if (durationInMinutes > 20) {
			heightValue = durationInMinutes;
		}

		return heightValue + 'px';
	};

	const QuarterHourBlock = ({ date }) => {
		// Format to local time string and remove minutes and seconds
		const formattedHour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

		const contextMenuObj = useContextMenu();
		const { contextMenu, handleContextMenu } = contextMenuObj;

		return (
			<div
				className="h-[15px]"
				onClick={(e) => {
					e.stopPropagation();
					handleContextMenu(e);
				}}
			>
				<div
					className={classNames(
						'text-[11px] w-full bg-blue-500 text-white rounded px-1',
						!contextMenu && 'invisible'
					)}
				>
					{formattedHour}
				</div>

				<DropdownAddNewTaskDetails contextMenuObj={contextMenuObj} defaultDueDate={date} />
			</div>
		);
	};

	const [todayDateObj, setTodayDateObj] = useState(new Date());
	const [todayDayTopValue, setTodayDayTopValue] = useState(getTopPositioningFromTime(todayDateObj));

	useEffect(() => {
		// Function to update both currentDateObj and currentDayTopValue
		const updateDateTime = () => {
			const newDate = new Date();
			setTodayDateObj(newDate);
			setTodayDayTopValue(getTopPositioningFromTime(newDate));
		};

		// Calculate how long to wait until the next minute starts
		const now = new Date();
		const msUntilNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

		// Update immediately at the next minute mark
		const timeoutId = setTimeout(() => {
			updateDateTime();
			// Then set an interval to continue updating every minute
			const intervalId = setInterval(updateDateTime, 60000);
			// Clear this interval on cleanup
			return () => {
				clearInterval(intervalId);
			};
		}, msUntilNextMinute);

		// Clean up the timeout and interval
		return () => {
			clearTimeout(timeoutId);
		};
	}, []); // Empty dependency array ensures this effect runs only once after initial render

	const dueDateIsToday = areDatesEqual(currDueDate, todayDateObj);

	return (
		<div>
			<div>
				<div className="flex">
					<div className="w-[90px]" />
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
						<div
							ref={formattedDayRef}
							className={classNames('font-bold', dueDateIsToday && 'text-blue-500')}
						>
							{formattedDay}
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

				<div className="flex overflow-auto gray-scrollbar" style={{ maxHeight }}>
					<div className="relative">
						{safeFocusRecords?.map((focusRecord, index) => {
							const { startTime } = focusRecord;
							// Create a Date object from the startTime
							const date = new Date(startTime);

							const topValue = getTopPositioningFromTime(date);
							const heightValue = getHeightValue(focusRecord);

							return (
								<MiniActionItem
									key={focusRecord._id}
									index={(tasks?.length ? tasks.length : 0) + index}
									focusRecord={focusRecord}
									actionItems={actionItems}
									flattenedActionItems={flattenedActionItems}
									shownActionItems={flattenedActionItems}
									formattedDay={formattedDay}
									customStyling={{
										width: formattedDayWidth - 10,
										position: 'absolute',
										zIndex: 1,
										top: topValue,
										height: heightValue,
										left: '95px',
										fontSize: '13px',
									}}
									dayViewHeightValue={heightValue}
								/>
							);
						})}

						{dueDateIsToday && (
							<div>
								<div
									className="bg-red-500/20 text-red-500 rounded text-[12px] w-[60px] flex items-center justify-center"
									style={{
										position: 'absolute',
										top: todayDayTopValue - 10,
										left: '20px',
										zIndex: 1,
									}}
								>
									{getTimeString(todayDateObj)}
								</div>

								<div
									className="bg-red-500 h-[10px] w-[10px] rounded-full"
									style={{
										position: 'absolute',
										top: todayDayTopValue - 5,
										left: '90px',
										zIndex: 1,
									}}
								></div>

								<div
									className="bg-red-500 h-[1px]"
									style={{
										position: 'absolute',
										top: todayDayTopValue,
										left: '90px',
										width: formattedDayWidth - 2,
										zIndex: 1,
									}}
								></div>
							</div>
						)}
					</div>
					{/* Sidebar thing */}
					<div className="py-1 px-2 w-[90px] text-right">
						<div>
							{allHours.map((hour) => {
								const isWithin25MinOfCurrentTime =
									dueDateIsToday && isTimeWithin25Minutes(hour, todayDateObj);

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

					<div className="flex-1 relative w-full">
						<div className="">
							<div>
								{allHours.map((hour) => {
									const quarterHours = generateQuarterHourDates(currDueDate, hour);

									return (
										<div
											key={currDueDate.toLocaleTimeString() + hour}
											className="text-color-gray-100 text-[12px] h-[60px] w-full border-l border-b border-color-gray-200"
										>
											{quarterHours.map((quarterHourDate) => (
												<QuarterHourBlock date={quarterHourDate} />
											))}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DayView;

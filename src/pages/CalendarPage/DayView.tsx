import { useEffect, useRef, useState } from 'react';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { formatCheckedInDayDate, getAllHours, isInSameHour, parseTimeStringAMorPM } from '../../utils/date.utils';
import MiniActionItem from './MiniActionItem';
import DropdownAddNewTaskDetails from '../../components/Dropdown/DropdownAddNewTaskDetails';
import useContextMenu from '../../hooks/useContextMenu';
import classNames from 'classnames';
import useMaxHeight from '../../hooks/useMaxHeight';
import { useCalendarContext } from '../../contexts/useCalendarContext';
import { secondsToMinutes } from '../../utils/helpers.utils';

const DayView = ({ groupedItemsByDateObj, currentDate, currDueDate }) => {
	const allHours = getAllHours();

	// RTK Query - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { sortedGroupedFocusRecordsAsc } = fetchedFocusRecords || {};
	const [focusRecordsForTheDay, setFocusRecordsForTheDay] = useState([]);

	const contextMenuObj = useContextMenu();

	const { contextMenu, isDropdownVisible, handleContextMenu } = contextMenuObj;

	const { allItemsGroupedByDate } = groupedItemsByDateObj;

	useEffect(() => {
		if (sortedGroupedFocusRecordsAsc) {
			const newFocusRecordsForTheDay = sortedGroupedFocusRecordsAsc['July 30, 2024'];
			setFocusRecordsForTheDay(newFocusRecordsForTheDay);
		}
	}, [sortedGroupedFocusRecordsAsc]);

	const currentFocusRecordIndex = 0;

	const formattedDay = formatCheckedInDayDate(currDueDate);
	const actionItems = allItemsGroupedByDate[formattedDay] || {};
	const { tasks, focusRecords } = actionItems;
	const safeTasks = tasks ? tasks : [];
	const safeFocusRecords = focusRecords ? focusRecords : [];

	const flattenedActionItems = [...safeTasks, ...safeFocusRecords];

	console.log(flattenedActionItems);

	const { headerHeight } = useCalendarContext();

	const maxHeight = useMaxHeight(headerHeight);

	console.log(headerHeight);
	console.log(maxHeight);

	const formattedDayRef = useRef(null);
	const [formattedDayWidth, setFormattedDayWidth] = useState(0);

	useEffect(() => {
		if (formattedDayRef.current && document.readyState === 'complete') {
			setFormattedDayWidth(formattedDayRef.current.getBoundingClientRect().width);
		}
	}, [formattedDayRef]);

	const getTopPositioning = (focusRecord) => {
		const { startTime } = focusRecord;

		// Create a Date object from the startTime
		const date = new Date(startTime);

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

	return (
		<div>
			<div className="overflow-auto gray-scrollbar" style={{ maxHeight }}>
				<div className="flex">
					<div className="w-[90px]" />
					<div
						className={classNames(
							'border-l border-color-gray-200 p-1 flex-1',
							contextMenu && 'bg-color-gray-200'
						)}
						onClick={(e) => {
							e.stopPropagation();
							handleContextMenu(e);
						}}
					>
						<div ref={formattedDayRef} className="font-bold">
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

							{safeFocusRecords?.map((focusRecord, index) => {
								const topValue = getTopPositioning(focusRecord);
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
											width: formattedDayWidth,
											position: 'absolute',
											zIndex: 1,
											top: topValue,
											height: heightValue,
										}}
									/>
								);
							})}
						</div>
					</div>

					<DropdownAddNewTaskDetails contextMenuObj={contextMenuObj} defaultDueDate={currDueDate} />
				</div>

				<div className="flex">
					{/* Sidebar thing */}
					<div className="py-1 px-2 w-[90px] text-right">
						<div>
							{allHours.map((hour) => (
								<div key={hour} className="text-color-gray-100 text-[12px] h-[60px]">
									{hour}
								</div>
							))}
						</div>
					</div>

					<div className="flex-1 relative w-full">
						<div className="">
							<div>
								{allHours.map((hour) => (
									<div
										key={hour}
										className="text-color-gray-100 text-[12px] h-[60px] w-full border-l border-b border-color-gray-200"
									></div>
								))}
							</div>
						</div>
						{focusRecordsForTheDay && focusRecordsForTheDay.length > 0 && (
							<div className="absolute top-[4px] left-[4px] text-[12px] w-[99%]">
								<div>
									{allHours.map((hour, i) => {
										const currentFocusRecord = focusRecordsForTheDay[currentFocusRecordIndex];

										const hourDate = new Date(
											parseTimeStringAMorPM(hour, currentFocusRecord.startTime)
										);
										const focusRecordDate = new Date(currentFocusRecord.startTime);

										const datesInSameHour = isInSameHour(hourDate, focusRecordDate);

										// TODO: Position this correctly. Probably will have to use absolute positioning to actually get it precisely positioned.
										if (!datesInSameHour) {
											return null;
										}

										return (
											<div
												key={hour}
												className="p-1 border border-red-500 bg-red-900 rounded opacity-50 w-full"
											>
												<div>Prepare for Marco Island</div>
												<div>12:00PM - 1:00PM</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DayView;

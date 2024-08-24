import { useEffect, useState } from 'react';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import {
	formatCheckedInDayDate,
	getAllHours,
	isInSameHour,
	parseTimeStringAMorPM,
	sortArrayByEndTime,
} from '../../utils/date.utils';
import MiniActionItem from './MiniActionItem';
import DropdownAddNewTaskDetails from '../../components/Dropdown/DropdownAddNewTaskDetails';
import useContextMenu from '../../hooks/useContextMenu';
import classNames from 'classnames';

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

	return (
		<div>
			<div className="text-center text-color-gray-100 border-b border-color-gray-200 pb-2">Tue</div>

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
					<div className="font-bold">{formattedDay}</div>
					<div className="space-y-[2px] my-3">
						{safeTasks.map((task, index) => (
							<MiniActionItem
								key={task._id}
								index={index}
								task={task}
								actionItems={actionItems}
								flattenedActionItems={flattenedActionItems}
								shownActionItems={flattenedActionItems}
								formattedDay={formattedDay}
								fromDayView={true}
							/>
						))}
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
			<div></div>
		</div>
	);
};

export default DayView;

import { useEffect } from 'react';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { getFocusDuration, getFormattedDuration, getGroupedFocusRecordsByDate } from '../../../utils/helpers.utils';
import FocusRecord from './FocusRecord';
import GroupedFocusRecordListByDate from './GroupedFocusRecordListByDate';

const MAX_SHOWN_FOCUS_RECORDS = 50;

const GroupedFocusRecordList = ({
	filteredFocusRecords,
	isLoadingGetFocusRecords,
	groupedBy,
	sortedBy,
	currentPage,
	setTotalPages,
}) => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	const groupedFocusRecordsByDate = filteredFocusRecords && getGroupedFocusRecordsByDate(filteredFocusRecords);
	// const groupedFocusRecordsByTask = filteredFocusRecords && getGroupedFocusRecordsByTask(filteredFocusRecords, tasksById);
	const groupedByFocusRecords = groupedFocusRecordsByDate;

	console.log(groupedByFocusRecords);

	useEffect(() => {
		if (isLoadingGetFocusRecords || !filteredFocusRecords) {
			return;
		}

		const newTotalPages = Math.ceil(filteredFocusRecords.length / MAX_SHOWN_FOCUS_RECORDS);
		setTotalPages(newTotalPages);
	}, [isLoadingGetFocusRecords, filteredFocusRecords]);

	const getInfoForGroup = (key, focusRecord, index) => {
		const infoForGroupedByDay = {
			title: key,
			focusRecordKey: focusRecord?.id,
		};

		switch (groupedBy) {
			case 'date':
				return infoForGroupedByDay;
			case 'tasks':
				return {
					title: tasksById[key].title,
					focusRecordKey: `${key} ${focusRecord?.id} ${index}`,
				};
			default:
				return infoForGroupedByDay;
		}
	};

	const getShownGroupedFocusRecords = () => {
		let currentShownFocusRecords = 0;
		const shownGroupedByFocusRecords = {};

		for (let key of Object.keys(groupedByFocusRecords)) {
			const focusRecordsForTheDay = groupedByFocusRecords[key];

			if (currentShownFocusRecords >= MAX_SHOWN_FOCUS_RECORDS) {
				break;
			}

			shownGroupedByFocusRecords[key] = focusRecordsForTheDay;
			currentShownFocusRecords += focusRecordsForTheDay.length;
		}

		return shownGroupedByFocusRecords;
	};

	const getShownUngroupedFocusRecords = () => {
		const endIndex = currentPage * MAX_SHOWN_FOCUS_RECORDS;
		const startIndex = endIndex - MAX_SHOWN_FOCUS_RECORDS;

		const noSearchText = sortedBy !== 'Most Relevant';

		const sortedFocusRecords = noSearchText
			? filteredFocusRecords.toSorted((focusRecordOne, focusRecordTwo) => {
					if (sortedBy === 'Newest' || sortedBy === 'Oldest') {
						const startTimeOne = new Date(focusRecordOne.startTime);
						const startTimeTwo = new Date(focusRecordTwo.startTime);

						if (sortedBy === 'Newest') {
							return startTimeTwo - startTimeOne;
						} else if (sortedBy === 'Oldest') {
							return startTimeOne - startTimeTwo;
						}
					} else if (sortedBy.startsWith('Focus Hours')) {
						const durationOne = getFocusDuration(focusRecordOne, groupedBy);
						const durationTwo = getFocusDuration(focusRecordTwo, groupedBy);

						if (sortedBy === 'Focus Hours: Most-Least') {
							return durationTwo - durationOne;
						} else if (sortedBy === 'Focus Hours: Least-Most') {
							return durationOne - durationTwo;
						}
					}
				})
			: filteredFocusRecords;

		return sortedFocusRecords.slice(startIndex, endIndex);
	};

	const isGrouped = groupedBy !== 'No Group';
	const shownGroupedFocusRecords = filteredFocusRecords && isGrouped && getShownGroupedFocusRecords();
	const shownUngroupedFocusRecords = filteredFocusRecords && !isGrouped && getShownUngroupedFocusRecords();

	return (
		<>
			{isLoadingGetFocusRecords || !filteredFocusRecords ? (
				<div className="flex w-full h-full bg-color-gray-700 flex items-center justify-center">
					<div>
						<img src="/cod-bo3-icons/Unstoppable_Medal_BO3.webp" className="h-[200px] animate-pulse" />
					</div>
				</div>
			) : (
				<>
					{filteredFocusRecords.length === 0 ? (
						<div>No Focus Records</div>
					) : isGrouped ? (
						Object.keys(shownGroupedFocusRecords).map((groupKey) => {
							const focusRecords = groupedByFocusRecords[groupKey];
							const totalFocusDuration = getTotalFocusDuration(focusRecords, groupedBy);
							const { title } = getInfoForGroup(groupKey);

							// TODO: If grouped by tasks, then we need to group those focus records for that task by date.
							// if (groupedBy === 'tasks') {
							// }

							return (
								<div key={groupKey} className="mb-[100px]">
									<div className="flex items-center gap-3 mb-5">
										<h2 className="text-[32px] font-bold border-b border-b-2">{title}</h2>
										<div className="text-[24px] text-color-gray-100">
											({getFormattedDuration(totalFocusDuration, false)})
										</div>
									</div>

									{groupedBy === 'tasks' ? (
										<GroupedFocusRecordListByDate
											{...{
												focusRecords: filteredFocusRecords,
												getInfoForGroup,
												groupedBy,
												groupKey,
											}}
										/>
									) : (
										<FocusRecordList
											{...{
												focusRecords: filteredFocusRecords,
												getInfoForGroup,
												groupedBy,
												groupKey,
											}}
										/>
									)}
								</div>
							);
						})
					) : (
						<FocusRecordList
							{...{
								focusRecords: shownUngroupedFocusRecords,
								getInfoForGroup,
								groupedBy,
								groupKey: null,
							}}
						/>
					)}
				</>
			)}
		</>
	);
};

const FocusRecordList = ({ focusRecords, getInfoForGroup, groupedBy, groupKey }) => {
	return (
		<div className="space-y-3">
			{focusRecords.map((focusRecord, index) => {
				const isLastItem = index === focusRecords.length - 1;
				const groupedInfo = groupKey && getInfoForGroup(groupKey, focusRecord, index);
				const focusRecordKey = groupedInfo?.focusRecordKey || focusRecord.id;

				return <FocusRecord key={focusRecordKey} focusRecord={focusRecord} isLastItemForTheDay={isLastItem} />;
			})}
		</div>
	);
};

const getTotalFocusDuration = (focusRecords, groupedBy) => {
	let durationForTheDay = 0;

	focusRecords.forEach((focusRecord) => {
		const duration = getFocusDuration(focusRecord, groupedBy);
		durationForTheDay += duration;
	});

	return durationForTheDay;
};

export default GroupedFocusRecordList;

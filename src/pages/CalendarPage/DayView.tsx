import { useEffect, useState } from 'react';
import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { getAllHours, isInSameHour, parseTimeStringAMorPM, sortArrayByEndTime } from '../../utils/date.utils';

const DayView = () => {
	const allHours = getAllHours();

	// RTK Query - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingFocusRecords,
		error: errorFocusRecords,
	} = useGetFocusRecordsQuery();
	const { sortedGroupedFocusRecordsAsc } = fetchedFocusRecords || {};
	const [focusRecordsForTheDay, setFocusRecordsForTheDay] = useState([]);

	useEffect(() => {
		if (sortedGroupedFocusRecordsAsc) {
			const newFocusRecordsForTheDay = sortedGroupedFocusRecordsAsc['July 30, 2024'];
			setFocusRecordsForTheDay(newFocusRecordsForTheDay);
		}
	}, [sortedGroupedFocusRecordsAsc]);

	console.log(focusRecordsForTheDay);

	const currentFocusRecordIndex = 0;

	return (
		<div>
			<div className="text-center text-color-gray-100 border-b border-color-gray-200 pb-2">Tue</div>
			<div className="flex">
				{/* Sidebar thing */}
				<div className="py-1 px-2">
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

									console.log(datesInSameHour);

									// TODO: Position this correctly.
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

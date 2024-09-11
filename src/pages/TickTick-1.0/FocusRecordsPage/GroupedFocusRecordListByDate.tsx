const GroupedFocusRecordListByDate = ({ focusRecords, getInfoForGroup, groupedBy, groupKey }) => {
	const groupedFocusRecordsByDate = getGroupedFocusRecordsByDate(focusRecords);

	return (
		<div>
			{Object.keys(groupedFocusRecordsByDate).map((dateKey) => {
				const focusRecordsForTheDay = groupedFocusRecordsByDate[dateKey];

				return (
					<div className="mb-5">
						<h3 className="font-bold text-[18px] underline mb-3">{dateKey}</h3>

						<FocusRecordList
							{...{ focusRecords: focusRecordsForTheDay, getInfoForGroup, groupedBy, groupKey }}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default GroupedFocusRecordListByDate;

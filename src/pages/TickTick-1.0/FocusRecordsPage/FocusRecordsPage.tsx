import { useEffect, useRef, useState } from 'react';
import ActionSidebar from '../../../components/ActionSidebar';
import GroupedFocusRecordList from './GroupedFocusRecordList';
import TopHeader from './TopHeader';
import useMaxHeight from '../../../hooks/useMaxHeight';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi';

const FocusRecordsPage = () => {
	// RTK Query - TickTick 1.0 - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingGetFocusRecords,
		error: errorGetFocusRecords,
	} = useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords } = fetchedFocusRecords || {};

	const topHeaderRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(0);

	const focusRecordListRef = useRef(null);
	const [groupedBy, setGroupedBy] = useState('No Group');
	const [sortedBy, setSortedBy] = useState('Newest');

	const maxHeight = useMaxHeight(headerHeight);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(null);

	const [filteredFocusRecords, setFilteredFocusRecords] = useState(focusRecords);

	useEffect(() => {
		// Scroll to the top of the focus records whenever you go to a new page.
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [currentPage, groupedBy, sortedBy]);

	useEffect(() => {
		setCurrentPage(1);
	}, [groupedBy, sortedBy]);

	useEffect(() => {
		setFilteredFocusRecords(focusRecords);
	}, [focusRecords]);

	return (
		<div className="flex max-w-screen max-h-screen bg-color-gray-700">
			<div className="">
				<ActionSidebar />
			</div>

			<div className="w-full flex flex-col">
				<TopHeader
					{...{
						topHeaderRef,
						headerHeight,
						setHeaderHeight,
						groupedBy,
						setGroupedBy,
						sortedBy,
						setSortedBy,
						currentPage,
						setCurrentPage,
						totalPages,
						defaultFocusRecords: focusRecords,
						filteredFocusRecords,
						setFilteredFocusRecords,
						focusRecordListRef,
					}}
				/>

				<div
					ref={focusRecordListRef}
					className="flex-1 flex justify-center overflow-scroll gray-scrollbar"
					style={{ maxHeight }}
				>
					<div className="container px-auto p-1">
						<GroupedFocusRecordList
							{...{
								filteredFocusRecords,
								isLoadingGetFocusRecords,
								groupedBy,
								sortedBy,
								currentPage,
								setTotalPages,
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FocusRecordsPage;
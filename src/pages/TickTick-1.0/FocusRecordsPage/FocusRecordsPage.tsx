import { useRef, useState } from 'react';
import ActionSidebar from '../../../components/ActionSidebar';
import GroupedFocusRecordList from './GroupedFocusRecordList';
import TopHeader from './TopHeader';
import useMaxHeight from '../../../hooks/useMaxHeight';
import Pagination from '../../../components/Pagination';

const FocusRecordsPage = () => {
	const topHeaderRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(0);

	const [groupedBy, setGroupedBy] = useState('No Group');
	const [sortedBy, setSortedBy] = useState('Oldest');

	const maxHeight = useMaxHeight(headerHeight);

	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 67; // Total pages

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
					}}
				/>

				<div className="flex-1 flex justify-center overflow-scroll gray-scrollbar" style={{ maxHeight }}>
					<div className="container px-auto p-1">
						<GroupedFocusRecordList {...{ groupedBy, sortedBy }} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default FocusRecordsPage;

import { useRef, useState } from 'react';
import ActionSidebar from '../../../components/ActionSidebar';
import GroupedFocusRecordList from './GroupedFocusRecordList';
import TopHeader from './TopHeader';
import useMaxHeight from '../../../hooks/useMaxHeight';
import Pagination from '../../../components/Pagination';

const FocusRecordsPage = () => {
	const topHeaderRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(0);

	const [groupedBy, setGroupedBy] = useState('Date');
	const [sortedBy, setSortedBy] = useState('Oldest');

	const maxHeight = useMaxHeight(headerHeight);

	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 67; // Total pages

	return (
		<div className="flex max-w-screen max-h-screen bg-color-gray-700">
			<div className="">
				<ActionSidebar />
			</div>

			<div className="w-full">
				<TopHeader
					{...{ topHeaderRef, headerHeight, setHeaderHeight, groupedBy, setGroupedBy, sortedBy, setSortedBy }}
				/>

				<div className="flex justify-center">
					<Pagination total={totalPages} current={currentPage} onChange={setCurrentPage} />
				</div>

				<div className="flex justify-center overflow-scroll gray-scrollbar" style={{ maxHeight }}>
					<div className="container px-auto p-1">
						<GroupedFocusRecordList groupedBy={groupedBy} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default FocusRecordsPage;

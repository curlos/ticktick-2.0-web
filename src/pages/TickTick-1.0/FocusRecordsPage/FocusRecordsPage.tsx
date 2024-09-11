import { useState } from 'react';
import ActionSidebar from '../../../components/ActionSidebar';
import GroupedFocusRecordList from './GroupedFocusRecordList';

const FocusRecordsPage = () => {
	const [groupedBy, setGroupedBy] = useState('day');

	return (
		<div className="flex max-w-screen max-h-screen bg-color-gray-700">
			<div className="">
				<ActionSidebar />
			</div>

			<div className="h-[100vh] w-full overflow-scroll gray-scrollbar flex justify-center">
				<div className="container px-auto p-1">
					<GroupedFocusRecordList groupedBy={groupedBy} />
				</div>
			</div>
		</div>
	);
};

export default FocusRecordsPage;

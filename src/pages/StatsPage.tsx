import ActionSidebar from '../components/ActionSidebar';
import TopBar from '../components/StatsPage/TopBar';

const StatsPage = () => {
	return (
		<div className="flex max-w-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-1 bg-color-gray-700 py-8 pl-[150px] pr-[170px]">
				<TopBar />
			</div>
			{/* <div className="flex-[10] bg-blue-500">
				<FocusTimer />
			</div>
			<div className="flex-[5] bg-red-500">
				<FocusRecords />
			</div> */}
		</div>
	);
};

export default StatsPage;
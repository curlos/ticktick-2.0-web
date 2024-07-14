import { useLocation } from 'react-router';
import ActionSidebar from '../components/ActionSidebar';
import OverviewSection from '../components/StatsPage/OverviewSection/OverviewSection';
import TopBar from '../components/StatsPage/TopBar';
import TaskSection from '../components/StatsPage/TaskSection/TaskSection';

const StatsPage = () => {
	const location = useLocation();

	console.log(location);

	return (
		<div className="flex max-w-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-1 bg-color-gray-700 py-8 pl-[150px] pr-[170px]">
				<TopBar />

				<div className="mt-5">
					{location.pathname.includes('/overview') && <OverviewSection />}
					{location.pathname.includes('/task') && <TaskSection />}
				</div>
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

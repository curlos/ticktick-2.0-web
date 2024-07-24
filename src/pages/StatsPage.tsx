import { useLocation } from 'react-router';
import ActionSidebar from '../components/ActionSidebar';
import OverviewSection from '../components/StatsPage/OverviewSection/OverviewSection';
import TopBar from '../components/StatsPage/TopBar';
import TaskSection from '../components/StatsPage/TaskSection/TaskSection';
import FocusSection from '../components/StatsPage/FocusSection/FocusSection';

const StatsPage = () => {
	const location = useLocation();

	console.log(location);

	return (
		<div className="flex max-w-screen max-h-[100vh]">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-1 bg-color-gray-700 py-8 pl-[150px] pr-[170px] h-[100vh] overflow-scroll">
				<TopBar />

				<div className="mt-5">
					{location.pathname.includes('/overview') && <OverviewSection />}
					{location.pathname.includes('/task') && <TaskSection />}
					{location.pathname.includes('/focus') && <FocusSection />}
				</div>
			</div>
		</div>
	);
};

export default StatsPage;

import { useLocation } from 'react-router';
import ActionSidebar from '../../components/ActionSidebar';
import FocusSection from './FocusSection/FocusSection';
import OverviewSection from './OverviewSection/OverviewSection';
import TaskSection from './TaskSection/TaskSection';
import TopBar from './TopBar';

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

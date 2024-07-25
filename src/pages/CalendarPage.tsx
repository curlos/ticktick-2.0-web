import ActionSidebar from '../components/ActionSidebar';
import Calendar from '../components/CalendarPage/Calendar';
import TopHeader from '../components/CalendarPage/TopHeader';

const CalendarPage = () => {
	return (
		<div className="flex max-w-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-1 flex flex-col bg-color-gray-700">
				<TopHeader />
				<div className="flex-1">
					<Calendar />
				</div>
			</div>
		</div>
	);
};

export default CalendarPage;

import ActionSidebar from '../components/ActionSidebar';
import Calendar from '../components/CalendarPage/Calendar';
import TopHeader from '../components/CalendarPage/TopHeader';

const CalendarPage = () => {
	return (
		<div className="flex max-w-screen h-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-1 flex flex-col bg-color-gray-700 h-full">
				<TopHeader />
				<div className="flex-1 h-full">
					<Calendar />
				</div>
			</div>
		</div>
	);
};

export default CalendarPage;

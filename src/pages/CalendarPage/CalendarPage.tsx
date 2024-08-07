import ActionSidebar from '../../components/ActionSidebar';
import Calendar from './Calendar';
import TopHeader from './TopHeader';

const CalendarPage = () => {
	return (
		<div className="flex max-w-screen h-full">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-1 flex flex-col bg-color-gray-700 h-full min-h-screen">
				<TopHeader />
				<div className="flex-1 flex flex-col h-full">
					<Calendar />
				</div>
			</div>
		</div>
	);
};

export default CalendarPage;

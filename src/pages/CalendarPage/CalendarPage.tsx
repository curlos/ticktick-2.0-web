import ActionSidebar from '../../components/ActionSidebar';
import Calendar from './Calendar';
import FilterSidebar from './FilterSidebar';
import TopHeader from './TopHeader';

const CalendarPage = () => {
	return (
		<div className="flex max-w-screen h-full">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="bg-color-gray-700 border-r border-color-gray-200 w-[240px]">
				<FilterSidebar />
			</div>
			<div className="flex-1 flex flex-col bg-color-gray-700 h-full min-h-screen">
				<TopHeader />
				<div className="flex-1 flex flex-col h-full">
					{/* TODO: Calendar extends past screen height currently. Prevent this from happening on Desktop at the very least. */}
					<Calendar />
				</div>
			</div>
		</div>
	);
};

export default CalendarPage;

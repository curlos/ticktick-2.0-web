import ActionSidebar from '../components/ActionSidebar';

const CalendarPage = () => {
	return (
		<div className="flex max-w-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-1 bg-color-gray-700 py-8 pl-[150px] pr-[170px]">Hello World</div>
		</div>
	);
};

export default CalendarPage;

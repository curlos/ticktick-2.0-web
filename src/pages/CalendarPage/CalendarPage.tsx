import { useState } from 'react';
import ActionSidebar from '../../components/ActionSidebar';
import Calendar from './Calendar';
import FilterSidebar from './FilterSidebar';
import TopHeader from './TopHeader';
import { useCalendarContext } from '../../contexts/useCalendarContext';
import ArrangeTasksSidebar from './ArrangeTasksSidebar';

const CalendarPage = () => {
	const { showFilterSidebar, showArrangeTasksSidebar } = useCalendarContext();

	return (
		<div className="flex max-w-screen h-full">
			<div className="">
				<ActionSidebar />
			</div>
			{showFilterSidebar && (
				<div className="bg-color-gray-700 border-r border-color-gray-200 w-[240px]">
					<FilterSidebar />
				</div>
			)}
			<div className="flex-1 flex flex-col bg-color-gray-700 h-screen">
				<TopHeader />

				<div className="flex-1 flex flex-col h-full">
					<Calendar />
				</div>
			</div>
			{showArrangeTasksSidebar && (
				<div className="bg-color-gray-700 border-l border-color-gray-200 w-[240px]">
					<ArrangeTasksSidebar />
				</div>
			)}
		</div>
	);
};

export default CalendarPage;

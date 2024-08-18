import { useRef, useState } from 'react';
import ActionSidebar from '../../components/ActionSidebar';
import Calendar from './Calendar';
import FilterSidebar from './FilterSidebar';
import TopHeader from './TopHeader';

const CalendarPage = () => {
	// TopHeader - useState
	const [showFilterSidebar, setShowFilterSidebar] = useState(true);
	const [selectedInterval, setSelectedInterval] = useState('Month');
	const [currentDate, setCurrentDate] = useState(new Date());
	const topHeaderRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(0);

	// Filter Sidebar - useState
	const [allValue, setAllValue] = useState({
		name: 'All',
		isChecked: true,
	});
	const [selectedValuesById, setSelectedValuesById] = useState({
		projectsById: {},
		filtersById: {},
		tagsById: {},
	});

	const [selectedCollapsibleValues, setSelectedCollapsibleValues] = useState({
		projects: {
			name: 'Lists',
			isChecked: false,
			valuesByIdType: 'projectsById',
			key: 'projects',
		},
		filters: {
			name: 'Filters',
			isChecked: false,
			valuesByIdType: 'filtersById',
			key: 'filters',
		},
		tags: {
			name: 'Tags',
			isChecked: false,
			valuesByIdType: 'tagsById',
			key: 'tags',
		},
	});

	const filterSidebarProps = {
		allValue,
		setAllValue,
		selectedValuesById,
		setSelectedValuesById,
		selectedCollapsibleValues,
		setSelectedCollapsibleValues,
	};

	const topHeaderProps = {
		topHeaderRef,
		setHeaderHeight,
		showFilterSidebar,
		setShowFilterSidebar,
		currentDate,
		setCurrentDate,
		selectedInterval,
		setSelectedInterval,
	};

	return (
		<div className="flex max-w-screen h-full">
			<div className="">
				<ActionSidebar />
			</div>
			{showFilterSidebar && (
				<div className="bg-color-gray-700 border-r border-color-gray-200 w-[240px]">
					<FilterSidebar {...filterSidebarProps} />
				</div>
			)}
			<div className="flex-1 flex flex-col bg-color-gray-700 h-screen">
				<TopHeader {...topHeaderProps} />
				<div className="flex-1 flex flex-col h-full">
					<Calendar
						currentDate={currentDate}
						selectedInterval={selectedInterval}
						headerHeight={headerHeight}
						{...{ allValue, selectedValuesById, selectedCollapsibleValues }}
					/>
				</div>
			</div>
		</div>
	);
};

export default CalendarPage;

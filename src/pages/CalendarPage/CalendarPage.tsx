import { useRef, useState } from 'react';
import ActionSidebar from '../../components/ActionSidebar';
import Calendar from './Calendar';
import FilterSidebar from './FilterSidebar';
import TopHeader from './TopHeader';

const CalendarPage = () => {
	// General - useState
	const [currDueDate, setCurrDueDate] = useState(null);
	const [connectedCurrentDate, setConnectedCurrentDate] = useState();

	// TopHeader - useState
	const [showFilterSidebar, setShowFilterSidebar] = useState(true);
	const [selectedInterval, setSelectedInterval] = useState('Month');
	const [currentDate, setCurrentDate] = useState(new Date());
	const topHeaderRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [selectedColorsType, setSelectedColorsType] = useState('Projects');
	const [selectedTasksToShow, setSelectedTasksToShow] = useState({
		showCompleted: {
			name: 'Show Completed',
			isChecked: false,
		},
		showCheckItem: {
			name: 'Show Check Item',
			isChecked: false,
		},
		showAllRepeatCycle: {
			name: 'Show All Repeat Cycle',
			isChecked: false,
		},
		showHabit: {
			name: 'Show Habit',
			isChecked: false,
		},
		showFocusRecords: {
			name: 'Show Focus Records',
			isChecked: false,
		},
		showWeekends: {
			name: 'Show Weekends',
			isChecked: false,
		},
	});

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

	// Filter Sidebar - Props
	const filterSidebarProps = {
		allValue,
		setAllValue,
		selectedValuesById,
		setSelectedValuesById,
		selectedCollapsibleValues,
		setSelectedCollapsibleValues,
		connectedCurrentDate,
		setConnectedCurrentDate,
		currDueDate,
		setCurrDueDate,
	};

	// Top Header - Props
	const topHeaderProps = {
		topHeaderRef,
		setHeaderHeight,
		showFilterSidebar,
		setShowFilterSidebar,
		currentDate,
		setCurrentDate,
		selectedInterval,
		setSelectedInterval,
		connectedCurrentDate,
		setConnectedCurrentDate,
		selectedColorsType,
		setSelectedColorsType,
		selectedTasksToShow,
		setSelectedTasksToShow,
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
						{...{ allValue, selectedValuesById, selectedCollapsibleValues, currDueDate }}
					/>
				</div>
			</div>
		</div>
	);
};

export default CalendarPage;

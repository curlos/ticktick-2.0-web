import React, { createContext, useContext, useRef, useState } from 'react';

const CalendarContext = createContext();

export const useCalendarContext = () => {
	return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {
	const calendar = useCalendar();
	return <CalendarContext.Provider value={calendar}>{children}</CalendarContext.Provider>;
};

const useCalendar = () => {
	// useState: General
	const [currDueDate, setCurrDueDate] = useState(null);
	const [connectedCurrentDate, setConnectedCurrentDate] = useState();

	// useState: TopHeader
	const [showFilterSidebar, setShowFilterSidebar] = useState(true);
	const [selectedInterval, setSelectedInterval] = useState('Month');
	const [currentDate, setCurrentDate] = useState(new Date());
	const topHeaderRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [selectedColorsType, setSelectedColorsType] = useState('Priority');
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

	// useState: Filter Sidebar
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

	return {
		// useState: General
		currDueDate,
		setCurrDueDate,
		connectedCurrentDate,
		setConnectedCurrentDate,

		// useState: TopHeader
		showFilterSidebar,
		setShowFilterSidebar,
		selectedInterval,
		setSelectedInterval,
		currentDate,
		setCurrentDate,
		topHeaderRef,
		headerHeight,
		setHeaderHeight,
		selectedColorsType,
		setSelectedColorsType,
		selectedTasksToShow,
		setSelectedTasksToShow,

		// useState: Filter Sidebar
		allValue,
		setAllValue,
		selectedValuesById,
		setSelectedValuesById,
		selectedCollapsibleValues,
		setSelectedCollapsibleValues,
	};
};

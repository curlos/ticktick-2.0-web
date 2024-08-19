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
			isChecked: true,
		},

		// TODO: "Check Item" on TickTick 1.0 is the tasks that are NOT tasks but can be completed and only created from a real "Task". It's what I use most often. I don't know how I'm going to structure these quite yet so commenting this out for now.
		// showCheckItem: {
		// 	name: 'Show Check Item',
		// 	isChecked: false,
		// },

		// TODO: I do not have repeating tasks working right now so commenting out. Will come back to this after I've added that feature.
		// showAllRepeatCycle: {
		// 	name: 'Show All Repeat Cycle',
		// 	isChecked: false,
		// },

		// TODO: I do have habits finished for the most part so this could be doable but I'm actually unsure on how this view feature works on TickTick 1.0 so would need to research first before proceeding.
		// showHabit: {
		// 	name: 'Show Habit',
		// 	isChecked: false,
		// },

		showFocusRecords: {
			name: 'Show Focus Records',
			isChecked: true,
		},
		showWeekends: {
			name: 'Show Weekends',
			isChecked: true,
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
			name: 'Projects',
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

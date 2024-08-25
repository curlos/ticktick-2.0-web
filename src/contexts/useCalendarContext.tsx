import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useGetUserSettingsQuery } from '../services/resources/userSettingsApi';

const CalendarContext = createContext();

export const useCalendarContext = () => {
	return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {
	const calendar = useCalendar();
	return <CalendarContext.Provider value={calendar}>{children}</CalendarContext.Provider>;
};

const useCalendar = () => {
	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	// useState: General
	// TODO: Change this back to "new Date()" after I'm done testing the "Day" view feature.
	const [currDueDate, setCurrDueDate] = useState(new Date());
	const [connectedCurrentDate, setConnectedCurrentDate] = useState();

	// useState: TopHeader
	const [showFilterSidebar, setShowFilterSidebar] = useState(true);
	const [showArrangeTasksSidebar, setShowArrangeTasksSidebar] = useState(false);
	const [selectedInterval, setSelectedInterval] = useState('Week');
	const [currentDate, setCurrentDate] = useState(new Date());
	const topHeaderRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [colorsType, setColorsType] = useState('Priority');
	const [shownTasksFilters, setShownTasksFilters] = useState({
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

	useEffect(() => {
		if (isLoadingGetUserSettings) {
			return;
		}

		const {
			calendarViewOptions: { colorsType: backendColorsType, shownTasksFilters: backendShownTasksFilters },
		} = userSettings;

		setColorsType(backendColorsType);
		const newShownTasksFilters = { ...shownTasksFilters };

		Object.keys(backendShownTasksFilters).forEach((key) => {
			if (shownTasksFilters[key]) {
				const newCheckedValue = backendShownTasksFilters[key];
				shownTasksFilters[key].isChecked = newCheckedValue;
			}
		});

		setShownTasksFilters(newShownTasksFilters);
	}, [isLoadingGetUserSettings]);

	return {
		// useState: General
		currDueDate,
		setCurrDueDate,
		connectedCurrentDate,
		setConnectedCurrentDate,

		// useState: TopHeader
		showFilterSidebar,
		setShowFilterSidebar,
		showArrangeTasksSidebar,
		setShowArrangeTasksSidebar,
		selectedInterval,
		setSelectedInterval,
		currentDate,
		setCurrentDate,
		topHeaderRef,
		headerHeight,
		setHeaderHeight,
		colorsType,
		setColorsType,
		shownTasksFilters,
		setShownTasksFilters,

		// useState: Filter Sidebar
		allValue,
		setAllValue,
		selectedValuesById,
		setSelectedValuesById,
		selectedCollapsibleValues,
		setSelectedCollapsibleValues,
	};
};

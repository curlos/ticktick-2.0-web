import React, { createContext, useContext, useState } from 'react';

const CalendarContext = createContext();

export const useCalendarContext = () => {
	return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {
	const calendar = useCalendar();
	return <CalendarContext.Provider value={calendar}>{children}</CalendarContext.Provider>;
};

const useCalendar = () => {
	// TopHeader - useState
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

	return {
		selectedColorsType,
		setSelectedColorsType,
		selectedTasksToShow,
		setSelectedTasksToShow,
	};
};

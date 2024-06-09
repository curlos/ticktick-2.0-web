// src/features/timer/timerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialFocusRecord = {
	taskId: null,
	startTime: null,
	endTime: null,
	duration: 0,
	pomos: 0,
	focusType: null,
	note: '',
};

const initialState = {
	initialSeconds: 2700,
	seconds: 2700,
	// initialSeconds: 2,
	// seconds: 2,
	duration: 0,
	overallStartTime: null,
	isActive: false,
	isOvertime: false,
	focusNote: '',
	focusType: '',
	selectedTask: null,
	focusRecords: [],
	currentFocusRecord: initialFocusRecord,
};

export const timerSlice = createSlice({
	name: 'timer',
	initialState,
	reducers: {
		setInitialSeconds: (state, action) => {
			state.initialSeconds = action.payload;
		},
		setSeconds: (state, action) => {
			state.seconds = action.payload;
		},
		setIsActive: (state, action) => {
			state.isActive = action.payload;
		},
		setIsOvertime: (state, action) => {
			state.isOvertime = action.payload;
		},
		setOverallStartTime: (state, action) => {
			state.overallStartTime = action.payload;
		},
		resetTimer: (state, action) => {
			state.seconds = action.payload;
			state.isActive = false;
			state.isOvertime = false;
		},
		setFocusNote: (state, action) => {
			state.focusNote = action.payload;
		},
		setFocusType: (state, action) => {
			state.focusType = action.payload;
		},
		setSelectedTask: (state, action) => {
			state.selectedTask = action.payload;
		},
		setDuration: (state, action) => {
			state.duration = action.payload;
		},
		addFocusRecord: (state, action) => {
			const { taskId, startTime, endTime, duration, pomos, focusType, note } = action.payload;

			const newFocusRecord = {
				taskId: taskId ? taskId : null,
				startTime: startTime ? startTime : null,
				endTime: endTime ? endTime : null,
				duration: duration ? duration : 0,
				pomos: focusType === 'pomo' ? pomos : 0,
				focusType: focusType,
				note: note,
			};

			state.focusRecords.push(newFocusRecord);
			state.currentFocusRecord = initialFocusRecord;
		},
		setCurrentFocusRecord: (state, action) => {
			const updatedFocusRecord = {
				...state.currentFocusRecord,
				...action.payload,
			};

			state.currentFocusRecord = updatedFocusRecord;
		},
		resetFocusRecords: (state) => {
			state.focusRecords = [];
		},
	},
});

export const {
	setSeconds,
	setIsActive,
	setIsOvertime,
	setOverallStartTime,
	resetTimer,
	setFocusNote,
	setFocusType,
	setSelectedTask,
	setDuration,
	addFocusRecord,
	setCurrentFocusRecord,
	resetFocusRecords,
} = timerSlice.actions;

export default timerSlice.reducer;

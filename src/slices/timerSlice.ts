// src/features/timer/timerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	initialSeconds: 2700,
	seconds: 2700,
	isActive: false,
	isOvertime: false,
	focusNote: '',
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
		resetTimer: (state, action) => {
			state.seconds = action.payload;
			state.isActive = false;
			state.isOvertime = false;
		},
		setFocusNote: (state, action) => {
			state.focusNote = action.payload;
		},
	},
});

export const { setSeconds, setIsActive, setIsOvertime, resetTimer, setFocusNote } = timerSlice.actions;

export default timerSlice.reducer;

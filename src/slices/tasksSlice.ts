// src/slices/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { arrayToObjectByKey } from '../utils/helpers.utils';

const initialState = {
	tasks: [],
	tasksById: {},
	status: 'idle',
	error: null,
};

export const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		setTasks(state, action) {
			const tasks = action.payload;
			state.tasks = tasks;
			state.tasksById = arrayToObjectByKey(tasks, '_id');
		},
		addTask(state, action) {
			const newTask = action.payload;
			state.tasks.push(newTask);
		},
	},
});

export const { setTasks, addTask } = tasksSlice.actions;

export default tasksSlice.reducer;

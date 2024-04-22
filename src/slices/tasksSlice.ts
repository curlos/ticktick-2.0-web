// src/slices/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks: [],
    status: 'idle',
    error: null
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks(state, action) {
            const tasks = action.payload;
            state.tasks = tasks;
        },
        addTask(state, action) {
            const newTask = action.payload;
            state.tasks.push(newTask);
        }
    },
});

export const { setTasks, addTask } = tasksSlice.actions;

export default tasksSlice.reducer;

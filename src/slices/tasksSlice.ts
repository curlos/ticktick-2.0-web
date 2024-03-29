// src/slices/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks: [],
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks(state, action) {
            state.tasks = action.payload;
        },
        // Action to add a single task
        addTask(state, action) {
            const task = action.payload;
            state.tasks[task._id] = task; // Add the new task to the tasks object
            // Update local storage
            localStorage.setItem('allTasks', JSON.stringify(state.tasks));
        },
    },
});

export const { setTasks, addTask } = tasksSlice.actions;

export default tasksSlice.reducer;

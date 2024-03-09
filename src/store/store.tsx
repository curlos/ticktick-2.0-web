// src/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Get the stored string
const cachedTasks = localStorage.getItem('allTasks') ? JSON.parse(localStorage.getItem('allTasks') || "{}") : {};

// Define an initial state
const initialState = {
    tasks: cachedTasks,
};

// Create a slice for tasks with reducers to handle updating state
const tasksSlice = createSlice({
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

// Create and configure the store
const store = configureStore({
    reducer: {
        tasks: tasksSlice.reducer,
    },
});

export const { setTasks, addTask } = tasksSlice.actions;

export default store;
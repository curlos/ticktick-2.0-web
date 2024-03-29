// src/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import tasksReducer from '../slices/tasksSlice';

// Create and configure the store
const store = configureStore({
    reducer: {
        tasks: tasksReducer
    },
});

export default store;
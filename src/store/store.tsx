// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../slices/tasksSlice';
import projectsReducer from '../slices/projectsSlice';
import { api } from '../services/api';

// Create and configure the store
const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        projects: projectsReducer,
        [api.reducerPath]: api.reducer, // RTK Query reducer for users
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware), // Add middleware for both APIs
});

export default store;
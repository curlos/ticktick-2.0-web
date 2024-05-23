// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../slices/modalSlice';
import { api } from '../services/api';
import alertsReducer from '../slices/alertSlice';

// Create and configure the store
const store = configureStore({
	reducer: {
		modals: modalReducer,
		alerts: alertsReducer,
		[api.reducerPath]: api.reducer, // RTK Query reducer for users
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware), // Add middleware for both APIs
});

export default store;

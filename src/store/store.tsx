// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../slices/modalSlice';
import alertsReducer from '../slices/alertSlice';
import userReducer from '../slices/userSlice';
import timerReducer from '../slices/timerSlice';
import { baseAPI } from '../services/api';
import timerMiddleware from '../middleware/timerMiddleware';
import audioMiddleware from '../middleware/audioMiddleware';

// Create and configure the store
const store = configureStore({
	reducer: {
		modals: modalReducer,
		alerts: alertsReducer,
		user: userReducer,
		timer: timerReducer,
		[baseAPI.reducerPath]: baseAPI.reducer, // RTK Query reducer for users
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseAPI.middleware).concat(timerMiddleware).concat(audioMiddleware), // Add middleware for both APIs
});

export default store;

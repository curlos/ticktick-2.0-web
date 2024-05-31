// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: null,
	token: localStorage.getItem('token') || null,
	isLoggedIn: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		loginUserSuccess(state, action) {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isLoggedIn = true;
			localStorage.setItem('token', action.payload.token);
		},
		logoutUser(state) {
			state.user = null;
			state.token = null;
			state.isLoggedIn = false;
			localStorage.removeItem('token');
		},
	},
});

export const { loginUserSuccess, logoutUser } = userSlice.actions;
export default userSlice.reducer;

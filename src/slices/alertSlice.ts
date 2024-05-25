import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_ALERT_STATE = {
	isOpen: false,
	props: {},
};

const ALERT_IDS = ['AlertCopied', 'AlertFlagged'];

const initialState = {
	alerts: ALERT_IDS.reduce((acc, alertId) => {
		acc[alertId] = { ...DEFAULT_ALERT_STATE };
		return acc;
	}, {}),
};

const alertSlice = createSlice({
	name: 'alerts',
	initialState,
	reducers: {
		setAlertState: (state, action) => {
			const { alertId, isOpen, props } = action.payload;
			state.alerts[alertId].isOpen = isOpen ? isOpen : DEFAULT_ALERT_STATE.isOpen;
			state.alerts[alertId].props = props ? props : DEFAULT_ALERT_STATE.props;
		},
	},
});

export const { setAlertState } = alertSlice.actions;

export default alertSlice.reducer;

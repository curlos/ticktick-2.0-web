// src/features/modals/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_MODAL_STATE = {
	isOpen: false,
	props: {},
};

const MODAL_IDS = [
	'ModalErrorMessenger',
	'ModalAddFocusRecord',
	'ModalAddProject',
	'ModalAddTag',
	'ModalAddTaskForm',
	'ModalFocusSettings',
	'ModalTaskActivities',
	'ModalSearchTasks',
	'ModalAccountSettings',
	'ModalAddFilterOrEditMatrix',
	'ModalAddHabit',
	'ModalAddHabitLog',
	'ModalEditHabitSettings',
	'ModalViewOptions',
];

const initialState = {
	modals: MODAL_IDS.reduce((acc, modalId) => {
		acc[modalId] = { ...DEFAULT_MODAL_STATE };
		return acc;
	}, {}),
};

const modalSlice = createSlice({
	name: 'modals',
	initialState,
	reducers: {
		setModalState: (state, action) => {
			const { modalId, isOpen, props } = action.payload;
			state.modals[modalId].isOpen = isOpen ? isOpen : DEFAULT_MODAL_STATE.isOpen;
			state.modals[modalId].props = props ? props : DEFAULT_MODAL_STATE.props;
		},
	},
});

export const { setModalState } = modalSlice.actions;

export default modalSlice.reducer;

// src/slices/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    projects: [],
    status: 'idle',
    error: null
};

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setProjectsToState(state, action) {
            const projects = action.payload;
            state.projects = projects;
        },
        addProjectToState(state, action) {
            const newProject = action.payload;
            state.projects.push(newProject);
        }
    },
});

export const { setProjectsToState, addProjectToState } = projectsSlice.actions;

export default projectsSlice.reducer;

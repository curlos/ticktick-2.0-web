// In your reducer
const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TASK':
            return {
                ...state,
                tasks: [...state.tasks, action.payload], // Add the new task to the tasks array
            };
        // handle other actions
        default:
            return state;
    }
};
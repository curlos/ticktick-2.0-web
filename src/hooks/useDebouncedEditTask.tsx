import { useEditTaskMutation } from '../services/resources/tasksApi';
import { useDebouncedCallback } from './useDebounceCallback';

export const useDebouncedEditTask = (delay = 1000) => {
	const [editTask] = useEditTaskMutation();

	const debouncedEditTaskApiCall = useDebouncedCallback(
		// Function that gets debounced
		(taskId, taskPropAndValue) => {
			editTask({ taskId, payload: taskPropAndValue });
		},
		delay, // Delay in ms
		[] // No dependencies, this means the debounced function will not change on re-renders
	);

	return {
		debouncedEditTaskApiCall,
	};
};

export default useDebouncedEditTask;

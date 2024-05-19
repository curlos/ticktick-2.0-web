import { useEditTaskMutation } from "../services/api";
import { useDebouncedCallback } from "./useDebounceCallback";

export const useDebouncedEditTask = (delay = 500) => {
    const [editTask] = useEditTaskMutation();

    const debouncedEditTaskApiCall = useDebouncedCallback(
        // Function that gets debounced
        (taskId, taskPropAndValue) => {
            console.log(taskPropAndValue); // For debugging, remove if not needed
            editTask({ taskId, payload: taskPropAndValue });
        },
        delay, // Delay in ms
        [] // No dependencies, this means the debounced function will not change on re-renders
    );

    return {
        debouncedEditTaskApiCall
    };
};

export default useDebouncedEditTask;
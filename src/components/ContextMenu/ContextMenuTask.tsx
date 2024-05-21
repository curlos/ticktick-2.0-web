import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGetTasksQuery } from "../../services/api";
import { useParams } from "react-router";
import { TaskObj } from "../../interfaces/interfaces";
import DropdownCalendar from "../Dropdown/DropdownCalendar";
import DropdownTaskActions from "../Dropdown/DropdownTaskActions";

interface IContextMenuTask {
    xPos: string;
    yPos: string;
    onClose: () => void;
}

const ContextMenuTask: React.FC<IContextMenuTask> = ({ xPos, yPos, onClose }) => {
    const { data: fetchedTasks, isLoading: isTasksLoading, error } = useGetTasksQuery();
    const { tasks, tasksById, parentOfTasks } = fetchedTasks || {};

    const [task, setTask] = useState<TaskObj>();
    const [parentTask, setParentTask] = useState<TaskObj | null>();
    const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(true);
    const [currDueDate, setCurrDueDate] = useState(null);

    const dropdownCalendarToggleRef = useRef(null);

    let { taskId, projectId: paramsProjectId } = useParams();

    useEffect(() => {
        if (isTasksLoading) {
            return;
        }

        const currTask = taskId && tasksById && tasksById[taskId];
        setTask(currTask);

        if (currTask) {

            if (currTask.dueDate) {
                setCurrDueDate(new Date(currTask.dueDate));
            } else {
                setCurrDueDate(null);
            }

            const parentTaskId = parentOfTasks[currTask._id];
            const newParentTask = parentTaskId && tasksById[parentTaskId];

            if (newParentTask) {
                setParentTask(newParentTask);
            } else {
                setParentTask(null);
            }
        }
    }, [taskId, tasks, tasksById]);

    useEffect(() => {
        if (xPos) {
            setIsDropdownCalendarVisible(true);
        }
    }, [xPos]);

    if (!task) {
        return null;
    }

    return createPortal(
        <div>
            <DropdownTaskActions toggleRef={dropdownCalendarToggleRef} isVisible={isDropdownCalendarVisible} setIsVisible={setIsDropdownCalendarVisible} task={task} currDueDate={currDueDate} setCurrDueDate={setCurrDueDate} customClasses=" !ml-[0px] mt-[15px]" customStyling={{ position: "absolute", top: `${yPos}px`, left: `${xPos}px` }} />
        </div>,
        document.body
    );
};

export default ContextMenuTask;

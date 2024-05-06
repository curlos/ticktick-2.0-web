import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import TaskList from "../components/TaskList";
import { useSelector } from "react-redux";
import { TaskObj } from "../interfaces/interfaces";
import AddTaskForm from "../components/AddTaskForm";
import TaskListByCategory from "../components/TaskListByCategory";
import { SortableTree } from "../components/SortableTest/SortableTree";
import { useGetTasksQuery } from "../services/api";
import { fillInChildren } from "../utils/helpers.utils";

const TaskListPage = () => {
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [tasksWithNoParent, setTasksWithNoParent] = useState([]);

    const { data, isLoading, error } = useGetTasksQuery();

    useEffect(() => {
        if (isLoading || error) {
            return;
        }

        console.log(data);
        const { tasks, tasksById } = data;
        const transformedTasks = fillInChildren(tasks, tasksById);

        console.log(transformedTasks);

        // TODO: Bring this stuff below back once I figure out the problem with the "children"
        // Create a set of task IDs that are children
        const childTaskIds = new Set<string>();

        transformedTasks.forEach(task => {
            task.children?.forEach(child => childTaskIds.add(child._id.toString())); // Add child IDs to the set
        });

        // Filter out tasks that are in the childTaskIds set
        const newTasksWithNoParent = transformedTasks.filter(task => !childTaskIds.has(task._id.toString()));
        setTasksWithNoParent(newTasksWithNoParent);
    }, [data]);

    if (isLoading) {
        return <div>Loading...</div>; // Show loading state
    }

    if (error) {
        return <div>Error: {error.message}</div>; // Show error state
    }

    const { tasks, tasksById } = data;

    return (
        <div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
            <div className="p-4 h-full border-l border-r border-color-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex gap-1 items-center">
                        <Icon name="menu_open" customClass={"text-white !text-[24px]"} />
                        <h3 className="text-[20px] font-[600]">Hello Mobile</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* <Icon name="swap_vert" customClass={"text-white !text-[24px]"} /> */}
                        {/* <Icon name="more_horiz" customClass={"text-white !text-[24px]"} /> */}
                    </div>
                </div>

                {/* TODO: Bring this back after figuring out recursive function. */}
                {tasksWithNoParent && tasksWithNoParent.length > 0 && <SortableTree collapsible indicator removable defaultItems={tasksWithNoParent} />}

                <div className="mt-4 space-y-4">
                    <TaskListByCategory tasks={tasksById} />
                </div>



                {!showAddTaskForm && <button className="flex items-center gap-1 my-2" onClick={() => setShowAddTaskForm(true)}>
                    <Icon name="add" customClass={"text-blue-500 !text-[20px]"} />
                    <span className="text-blue-500">Add Task</span>
                </button>}

                {showAddTaskForm && <AddTaskForm setShowAddTaskForm={setShowAddTaskForm} />}

            </div>
        </div>
    );
};

export default TaskListPage;
import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import TaskList from "../components/TaskList";
import { useSelector } from "react-redux";
import { TaskObj } from "../interfaces/interfaces";
import AddTaskForm from "../components/AddTaskForm";
import TaskListByCategory from "../components/TaskListByCategory";
import { SortableTree } from "../components/SortableTest/SortableTree";
import { useGetProjectsQuery, useGetTasksQuery } from "../services/api";
import { fillInChildren, getTasksWithNoParent } from "../utils/helpers.utils";
import { useParams } from "react-router";
import { SMART_LISTS } from "../utils/smartLists.utils";

const TaskListPage = () => {
    const { projectId } = useParams();
    const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
    const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
    const { projects } = fetchedProjects || {};
    const { tasks, tasksById } = fetchedTasks || {};
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [tasksWithNoParent, setTasksWithNoParent] = useState([]);
    const [foundProject, setFoundProject] = useState(null);

    const isLoadingOrErrors = isLoadingTasks || errorTasks || isLoadingProjects || errorProjects;
    const isSmartListView = SMART_LISTS[projectId];

    useEffect(() => {
        if (projects && projectId) {
            const inSmartListView = SMART_LISTS[projectId];

            if (inSmartListView) {
                setFoundProject(SMART_LISTS[projectId]);
            } else {
                setFoundProject(projects.find((project) => project._id === projectId));
            }
        }

        if (!tasks) {
            return;
        }

        const newTasksWithNoParent = getTasksWithNoParent(tasks, tasksById, projectId, isSmartListView);
        setTasksWithNoParent(newTasksWithNoParent);

    }, [fetchedTasks, fetchedProjects, projectId]);

    if (isLoadingOrErrors) {
        return <div>Loading...</div>; // Show loading state
    }

    return (
        <div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
            <div className="p-4 h-full border-l border-r border-color-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-1 items-center">
                        <Icon name="menu_open" customClass={"text-white !text-[24px]"} />
                        <h3 className="text-[20px] font-[600]">{foundProject?.name}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* <Icon name="swap_vert" customClass={"text-white !text-[24px]"} /> */}
                        {/* <Icon name="more_horiz" customClass={"text-white !text-[24px]"} /> */}
                    </div>
                </div>

                {tasksWithNoParent && tasksWithNoParent.length > 0 && <SortableTree collapsible indicator removable defaultItems={tasksWithNoParent} tasksToUse={projectId !== 'trash' ? tasks.filter((task) => !task.isDeleted) : tasks} />}

                {/* {tasksWithNoParent?.length > 0 && (
                    <div className="mt-4 space-y-4">
                        <TaskListByCategory tasks={tasksWithNoParent} />
                    </div>
                )} */}

                {!showAddTaskForm && <button className="flex items-center gap-1 my-2" onClick={() => setShowAddTaskForm(true)}>
                    <Icon name="add" customClass={"text-blue-500 !text-[20px]"} />
                    <span className="text-blue-500">Add Task</span>
                </button>}

                {showAddTaskForm && <AddTaskForm setShowAddTaskForm={setShowAddTaskForm} />}

                <div className="h-[50px]"></div>
            </div>
        </div>
    );
};

export default TaskListPage;
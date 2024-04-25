import { useState } from "react";
import Icon from "../components/Icon";
import TaskList from "../components/TaskList";
import { useSelector } from "react-redux";
import { TaskObj } from "../interfaces/interfaces";
import AddTaskForm from "../components/AddTaskForm";
import TaskListByCategory from "../components/TaskListByCategory";

const TaskListPage = () => {
    const allTasks = useSelector((state) => state.tasks.tasks);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);

    // console.log('Tasks');
    // console.log(allTasks);

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

                <div className="mt-4 space-y-4">
                    <TaskListByCategory tasks={allTasks} />
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
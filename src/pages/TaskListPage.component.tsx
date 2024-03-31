import { useState } from "react";
import Icon from "../components/Icon.component";
import TaskList from "../components/TaskList.component";
import { useSelector } from "react-redux";
import { TaskObj } from "../types/types";
import AddTaskForm from "../components/AddTaskForm";

interface TaskListByCategoryProps {
    tasks: Array<TaskObj>;
}

const TaskListByCategory: React.FC<TaskListByCategoryProps> = ({ tasks }) => {
    const [category, setCategory] = useState('high');
    const [showTasks, setShowTasks] = useState(true);
    const categoryIconClass = "text-color-gray-100 !text-[16px] hover:text-white";

    return (
        <div>
            {category && (
                <div className="flex items-center text-[12px] cursor-pointer mb-2" onClick={() => setShowTasks(!showTasks)}>
                    {showTasks ? (
                        <Icon name="expand_more" customClass={categoryIconClass} />
                    ) : (
                        <Icon name="chevron_right" customClass={categoryIconClass} />
                    )}

                    <span className="mr-[6px]">High</span>
                    <span className="text-color-gray-100">3</span>
                </div>
            )}

            {showTasks && <TaskList tasks={tasks} />}
        </div>
    );
};

const TaskListPage = () => {
    const allTasks = useSelector((state) => state.tasks.tasks);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);

    return (
        <div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
            <div className="p-4 h-full border-l border-r border-color-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex gap-1 items-center">
                        <Icon name="menu_open" customClass={"text-white !text-[24px]"} />
                        <h3 className="text-[20px] font-[600]">Hello Mobile</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <Icon name="swap_vert" customClass={"text-white !text-[24px]"} />
                        <Icon name="more_horiz" customClass={"text-white !text-[24px]"} />
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
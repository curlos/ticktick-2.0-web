import ServiceMenu from "../components/ServiceMenu";
import TaskDetailsPage from "../components/TaskDetails";
import TaskListSidebar from "../components/TaskListSidebar";
import TaskListPage from "./TaskListPage";

const HomePage = () => {
    return (
        <div className="flex max-w-screen">
            <div className="">
                <ServiceMenu />
            </div>
            <div className="flex-[3]">
                <TaskListSidebar />
            </div>
            <div className="flex-[10] bg-blue-500">
                <TaskListPage />
            </div>
            <div className="flex-[6] bg-red-500">
                {/* <ResizableBox width={500} height={'100%'} resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}>
            <div className="h-full">
              <TaskDetailsPage />
            </div>
          </ResizableBox> */}
                <TaskDetailsPage />
            </div>
        </div>
    );
};

export default HomePage;
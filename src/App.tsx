import './App.css';
import ServiceMenu from './components/ServiceMenu.component';
import TaskListPage from './pages/TaskListPage.component';
import TaskListSidebar from './components/TaskListSidebar.component';
import useFetchTasks from './hooks/useFetchTasks';
import TaskDetailsPage from './components/TaskDetails';

function App() {
  useFetchTasks(); // This will fetch tasks when the component mounts

  return (
    <>
      <div className="flex w-[100vw] max-w-[100%] text-white text-[14px] select-none">
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
          <TaskDetailsPage />
        </div>
      </div>
    </>
  );
}

export default App;

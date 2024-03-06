import './App.css';
import ServiceMenu from './components/ServiceMenu.component';
import TaskList from './components/TaskList.component';
import TaskListSidebar from './components/TaskListSidebar.component';

function App() {
  return (
    <>
      <div className="flex w-[100vw] max-w-[100%] text-white text-[14px]">
        <div className="">
          <ServiceMenu />
        </div>
        <div className="flex-[3]">
          <TaskListSidebar />
        </div>
        <div className="flex-[10] bg-blue-500">
          <TaskList />
        </div>
        <div className="flex-[6] bg-red-500">dsadasd</div>
      </div>
    </>
  );
}

export default App;

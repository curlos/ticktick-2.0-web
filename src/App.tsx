import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import ServiceMenu from './components/ServiceMenu.component';
import TaskListPage from './pages/TaskListPage.component';
import TaskListSidebar from './components/TaskListSidebar.component';
import useFetchTasks from './hooks/useFetchTasks';
import TaskDetailsPage from './components/TaskDetails';
import { Resizable, ResizableBox } from 'react-resizable';

function App() {
  useFetchTasks(); // This will fetch tasks when the component mounts

  const HomePage = () => {
    return (
      <div className="flex">
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

  return (
    <>
      <div className="w-[100vw] max-w-[100%] text-white text-[14px] select-none">
        <Router>
          <Routes>
            <Route path="/" element={
              <HomePage />
            }>
            </Route>
            <Route path="/tasks/:taskId" element={
              <HomePage />
            }>
            </Route>
            {/* Fallback route for 404 Not Found */}
            <Route path="*" element={
              <HomePage />
            } />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;

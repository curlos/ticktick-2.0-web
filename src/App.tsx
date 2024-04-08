import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import ServiceMenu from './components/ServiceMenu';
import TaskListPage from './pages/TaskListPage';
import TaskListSidebar from './components/TaskListSidebar';
import useFetchTasks from './hooks/useFetchTasks';
import TaskDetailsPage from './components/TaskDetails';
import { Resizable, ResizableBox } from 'react-resizable';
import FocusTimer from './components/FocusTimer';
import ModalAddTaskForm from './components/Modal/ModalAddTaskForm';
import FocusPage from './pages/FocusPage';
import HomePage from './pages/HomePage';

function App() {
  useFetchTasks(); // This will fetch tasks when the component mounts

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

            <Route path="/focus" element={
              <FocusPage />
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

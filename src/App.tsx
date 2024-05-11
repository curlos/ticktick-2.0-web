import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import FocusPage from './pages/FocusPage';
import HomePage from './pages/HomePage';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTasksQuery } from './services/api';

function App() {
  const dispatch = useDispatch();
  const { data: fetchedTasks, isLoading, error } = useGetTasksQuery(); // Fetch tasks from the API

  return (
    <>
      <div className="w-[100vw] max-w-[100%] text-white text-[14px] select-none">
        <Router>
          <Routes>
            <Route path="/" element={
              <HomePage />
            }>
            </Route>

            <Route path="/projects/:projectId/tasks" element={<HomePage />}>
            </Route>

            <Route path="/projects/:projectId/tasks/:taskId" element={<HomePage />}>
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

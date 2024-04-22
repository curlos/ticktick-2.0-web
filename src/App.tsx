import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import FocusPage from './pages/FocusPage';
import HomePage from './pages/HomePage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { arrayToObjectByKey } from './utils/helpers.utils';
import { useGetTasksQuery } from './services/api';
import { setTasks } from './slices/tasksSlice';

function App() {
  const dispatch = useDispatch();
  const { data: fetchedTasks, isLoading, error } = useGetTasksQuery(); // Fetch tasks from the API

  // Update Redux state with fetched tasks
  useEffect(() => {
    if (fetchedTasks) {
      const formattedTasksObj = arrayToObjectByKey(fetchedTasks, '_id');
      dispatch(setTasks(formattedTasksObj));
    }
  }, [fetchedTasks, dispatch]); // Dependencies for useEffect

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

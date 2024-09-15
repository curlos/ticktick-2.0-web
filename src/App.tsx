import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FocusPage from './pages/FocusPage';
import HomePage from './pages/HomePage';
import GlobalModalList from './components/Modal/GlobalModalList';
import GlobalAlertList from './components/Alert/GlobalAlertList';
import LoginPage from './pages/LoginPage';
import EisenhowerMatrixPage from './pages/EisenhowerMatrixPage';
import HabitsPage from './pages/HabitsPage';
import FocusStatsPage from './pages/FocusStatsPage';
import StatsPage from './pages/StatsPage/StatsPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import { CalendarProvider } from './contexts/useCalendarContext';
import FocusRecordsPage from './pages/TickTick-1.0/FocusRecordsPage/FocusRecordsPage';
import { StatsProvider } from './contexts/useStatsContext';

function App() {
	return (
		<>
			<div className="w-[100vw] max-w-[100%] text-white text-[14px] select-none">
				<StatsProvider>
					<Router>
						<Routes>
							{/* TickTick 1.0 */}
							<Route path="/ticktick-1.0/focus-records" element={<FocusRecordsPage />}></Route>

							{/* Starting Pages */}
							<Route path="/login" element={<LoginPage />}></Route>
							<Route path="/signup" element={<LoginPage />}></Route>
							<Route path="/" element={<HomePage />}></Route>

							{/* Projects */}
							<Route path="/projects/:projectId/tasks" element={<HomePage />}></Route>
							<Route path="/projects/:projectId/tasks/:taskId" element={<HomePage />}></Route>

							{/* Tags */}
							<Route path="/tags/:tagId/tasks" element={<HomePage />}></Route>
							<Route path="/tags/:tagId/tasks/:taskId" element={<HomePage />}></Route>

							{/* Filters */}
							<Route path="/filters/:filterId/tasks" element={<HomePage />}></Route>
							<Route path="/filters/:filterId/tasks/:taskId" element={<HomePage />}></Route>

							{/* Habits */}
							<Route path="/habits" element={<HabitsPage />}></Route>
							<Route path="/habits/:habitId" element={<HabitsPage />}></Route>
							<Route path="/habits/archived" element={<HabitsPage />}></Route>
							<Route path="/habits/archived/:habitId" element={<HabitsPage />}></Route>

							<Route path="/focus" element={<FocusPage />}></Route>
							<Route path="/focus-stats" element={<FocusStatsPage />}></Route>
							<Route path="/matrix" element={<EisenhowerMatrixPage />}></Route>

							{/* Statistics Page with different views */}
							<Route path="/stats/overview" element={<StatsPage />}></Route>
							<Route path="/stats/task" element={<StatsPage />}></Route>
							<Route path="/stats/focus" element={<StatsPage />}></Route>

							{/* Calendar Page */}
							<Route
								path="/calendar"
								element={
									<CalendarProvider>
										<CalendarPage />
									</CalendarProvider>
								}
							></Route>

							{/* Fallback route for 404 Not Found */}
							<Route path="*" element={<HomePage />} />
						</Routes>

						{/* Modals */}
						<GlobalModalList />

						{/* Alerts */}
						<GlobalAlertList />
					</Router>
				</StatsProvider>
			</div>
		</>
	);
}

export default App;

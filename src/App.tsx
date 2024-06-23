import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FocusPage from './pages/FocusPage';
import HomePage from './pages/HomePage';
import GlobalModalList from './components/Modal/GlobalModalList';
import GlobalAlertList from './components/Alert/GlobalAlertList';
import LoginPage from './pages/LoginPage';
import EisenhowerMatrixPage from './pages/EisenhowerMatrixPage';

function App() {
	return (
		<>
			<div className="w-[100vw] max-w-[100%] text-white text-[14px] select-none">
				<Router>
					<Routes>
						<Route path="/login" element={<LoginPage />}></Route>
						<Route path="/signup" element={<LoginPage />}></Route>
						<Route path="/" element={<HomePage />}></Route>

						{/* Projects */}
						<Route path="/projects/:projectId/tasks" element={<HomePage />}></Route>
						<Route path="/projects/:projectId/tasks/:taskId" element={<HomePage />}></Route>

						{/* Tags */}
						<Route path="/tags/:tagId/tasks" element={<HomePage />}></Route>
						<Route path="/tags/:tagId/tasks/:taskId" element={<HomePage />}></Route>

						<Route path="/focus" element={<FocusPage />}></Route>
						<Route path="/matrix" element={<EisenhowerMatrixPage />}></Route>
						{/* Fallback route for 404 Not Found */}
						<Route path="*" element={<HomePage />} />
					</Routes>

					{/* Modals */}
					<GlobalModalList />

					{/* Alerts */}
					<GlobalAlertList />
				</Router>
			</div>
		</>
	);
}

export default App;

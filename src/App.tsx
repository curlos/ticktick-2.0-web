import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FocusPage from './pages/FocusPage';
import HomePage from './pages/HomePage';

function App() {
	return (
		<>
			<div className="w-[100vw] max-w-[100%] text-white text-[14px] select-none">
				<Router>
					<Routes>
						<Route path="/" element={<HomePage />}></Route>

						<Route path="/projects/:projectId/tasks" element={<HomePage />}></Route>

						<Route path="/projects/:projectId/tasks/:taskId" element={<HomePage />}></Route>

						<Route path="/focus" element={<FocusPage />}></Route>
						{/* Fallback route for 404 Not Found */}
						<Route path="*" element={<HomePage />} />
					</Routes>
				</Router>
			</div>
		</>
	);
}

export default App;

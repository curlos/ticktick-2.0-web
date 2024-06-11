import ActionSidebar from '../components/ActionSidebar';
import EisenhowerMatrix from '../components/EisenhowerMatrix';

const EisenhowerMatrixPage = () => {
	return (
		<div className="flex max-w-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-1 bg-blue-500">
				<EisenhowerMatrix />
			</div>
		</div>
	);
};

export default EisenhowerMatrixPage;

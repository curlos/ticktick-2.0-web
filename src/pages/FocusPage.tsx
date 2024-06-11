import FocusRecords from '../components/FocusRecords';
import FocusTimer from '../components/FocusTimer/FocusTimer';
import ActionSidebar from '../components/ActionSidebar';

const FocusPage = () => {
	return (
		<div className="flex max-w-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-[10] bg-blue-500">
				<FocusTimer />
			</div>
			<div className="flex-[5] bg-red-500">
				<FocusRecords />
			</div>
		</div>
	);
};

export default FocusPage;

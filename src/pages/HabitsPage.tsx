import ActionSidebar from '../components/ActionSidebar';
import HabitDetails from '../components/HabitDetails/HabitDetails';
import HabitList from '../components/HabitList/HabitList';

const HabitsPage = () => {
	return (
		<div className="flex max-w-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-[10] bg-blue-500">
				<HabitList />
				{/* <FocusTimer /> */}
			</div>
			<div className="flex-[5] bg-red-500">
				<HabitDetails />
				{/* <FocusRecords /> */}
			</div>
		</div>
	);
};

export default HabitsPage;

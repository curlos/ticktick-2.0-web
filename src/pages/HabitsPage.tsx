import ActionSidebar from '../components/ActionSidebar';
import HabitDetails from '../components/HabitDetails/HabitDetails';
import HabitList from '../components/HabitList/HabitList';

const HabitsPage = () => {
	return (
		<div className="flex max-w-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-[9] bg-blue-500">
				<HabitList />
			</div>
			<div className="flex-[6] bg-red-500">
				<HabitDetails />
			</div>
		</div>
	);
};

export default HabitsPage;

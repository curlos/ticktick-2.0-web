import Icon from '../Icon';
import HeaderSection from './HeaderSection';

const HabitList = () => {
	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
			<div className="p-4 h-full border-l border-r border-color-gray-200">
				<HeaderSection />
			</div>
		</div>
	);
};

export default HabitList;

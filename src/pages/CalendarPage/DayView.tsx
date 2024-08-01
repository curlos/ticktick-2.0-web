import { getAllHours } from '../../utils/date.utils';

const DayView = () => {
	getAllHours();
	return (
		<div>
			<div className="text-center text-color-gray-100 border-b border-color-gray-200 pb-2">Tue</div>
			<div className="flex">
				{/* Sidebar thing */}
				<div>
					<div>b</div>
				</div>
			</div>
			<div></div>
		</div>
	);
};

export default DayView;

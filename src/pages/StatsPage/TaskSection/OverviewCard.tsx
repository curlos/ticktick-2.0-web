import Icon from '../../../components/Icon';

const OverviewCard = () => {
	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[280px]">
			<h3 className="font-bold text-[16px]">Overview</h3>

			<div className="flex-1 flex flex-col justify-center gap-7">
				<div className="grid grid-cols-2 w-full">
					<div className="flex flex-col items-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">1</div>
						<div className="text-color-gray-100 font-medium">Completed Task</div>
						<div className="text-color-gray-100 flex items-center gap-1">
							<div>1 from yesterday</div>
							<Icon name="arrow_upward" fill={1} customClass={'text-emerald-500 !text-[18px]'} />
						</div>
					</div>

					<div className="flex flex-col items-center p-2 border-l border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">50%</div>
						<div className="text-color-gray-100 font-medium">Completion Rate</div>
						<div className="text-color-gray-100 flex items-center gap-1">
							<div>50% from yesterday</div>
							<Icon name="arrow_upward" fill={1} customClass={'text-emerald-500 !text-[18px]'} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;

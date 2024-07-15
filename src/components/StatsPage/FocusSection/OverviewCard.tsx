import Icon from '../../Icon';

const OverviewCard = () => {
	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col">
			<h3 className="font-bold text-[16px]">Overview</h3>

			<div className="flex-1 flex flex-col justify-center gap-7">
				<div className="grid grid-cols-4 w-full">
					<div className="flex flex-col items-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">1</div>
						<div className="text-color-gray-100 font-medium">Today's Pomo</div>
						<div className="text-color-gray-100 flex items-center gap-1">
							<div>7 from yesterday</div>
							<Icon name="arrow_downward" fill={1} customClass={'text-red-500 !text-[18px]'} />
						</div>
					</div>

					<div className="flex flex-col items-center p-2 border-l border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">1416</div>
						<div className="text-color-gray-100 font-medium">Total Pomos</div>
					</div>

					<div className="flex flex-col items-center p-2 border-l border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">0h45m</div>
						<div className="text-color-gray-100 font-medium">Today's Focus</div>
						<div className="text-color-gray-100 flex items-center gap-1">
							<div>5h15m from yesterday</div>
							<Icon name="arrow_downward" fill={1} customClass={'text-red-500 !text-[18px]'} />
						</div>
					</div>

					<div className="flex flex-col items-center p-2 border-l border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">2492h0m</div>
						<div className="text-color-gray-100 font-medium">Total Focus Duration</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;

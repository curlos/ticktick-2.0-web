const OverviewCard = () => {
	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<h3 className="font-bold text-[16px]">Overview</h3>

			<div className="flex-1 flex flex-col justify-center gap-7">
				<div className="grid grid-cols-3 w-full">
					<div className="text-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">1</div>
						<div className="text-color-gray-100 font-medium">Today's Completion</div>
					</div>

					<div className="text-center p-2 border-l border-r border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">4</div>
						<div className="text-color-gray-100 font-medium">Today's Pomo</div>
					</div>

					<div className="text-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">3h0m</div>
						<div className="text-color-gray-100 font-medium">Today's Focus</div>
					</div>
				</div>

				<div className="grid grid-cols-3 w-full">
					<div className="text-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">1095</div>
						<div className="text-color-gray-100 font-medium">Total Completion</div>
					</div>

					<div className="text-center p-2 border-l border-r border-color-gray-150">
						<div className="text-blue-500 font-bold text-[24px]">1411</div>
						<div className="text-color-gray-100 font-medium">Total Pomos</div>
					</div>

					<div className="text-center p-2">
						<div className="text-blue-500 font-bold text-[24px]">2488h30m</div>
						<div className="text-color-gray-100 font-medium">Total Focus Duration</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;

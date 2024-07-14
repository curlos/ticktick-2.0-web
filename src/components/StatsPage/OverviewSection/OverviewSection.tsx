import MyAchievementScoreSection from './MyAchievementScore';

const OverviewSection = () => {
	return (
		<div>
			<div className="bg-color-gray-600 p-4 rounded-md">
				<div className="flex justify-between items-center">
					<div className="flex gap-6">
						<div>
							<span className="font-bold">3135</span> Tasks
						</div>

						<div>
							<span className="font-bold">1095</span> Completed
						</div>

						<div>
							<span className="font-bold">74</span> Lists
						</div>

						<div>
							<span className="font-bold">1349</span> Days
						</div>
					</div>

					<div>
						You are more productive than <span className="text-yellow-500 font-medium">72%</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-5 mt-3">
				<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[300px]">
					<h3 className="font-medium text-[16px]">Overview</h3>

					<div className="flex-1 flex flex-col justify-center gap-7">
						<div className="grid grid-cols-3 w-full">
							<div className="text-center p-2">
								<div className="text-blue-500 font-bold text-[24px]">1</div>
								<div className="text-color-gray-100 font-medium">Today's Completion</div>
							</div>

							<div className="text-center p-2 border-l border-r border-color-gray-150">
								<div className="text-blue-500 font-bold text-[24px]">2</div>
								<div className="text-color-gray-100 font-medium">Today's Pomo</div>
							</div>

							<div className="text-center p-2">
								<div className="text-blue-500 font-bold text-[24px]">1h30m</div>
								<div className="text-color-gray-100 font-medium">Today's Focus</div>
							</div>
						</div>

						<div className="grid grid-cols-3 w-full">
							<div className="text-center p-2">
								<div className="text-blue-500 font-bold text-[24px]">1095</div>
								<div className="text-color-gray-100 font-medium">Total Completion</div>
							</div>

							<div className="text-center p-2 border-l border-r border-color-gray-150">
								<div className="text-blue-500 font-bold text-[24px]">2</div>
								<div className="text-color-gray-100 font-medium">Total Pomos</div>
							</div>

							<div className="text-center p-2">
								<div className="text-blue-500 font-bold text-[24px]">1h30m</div>
								<div className="text-color-gray-100 font-medium">Total Focus Duration</div>
							</div>
						</div>
					</div>
				</div>

				<MyAchievementScoreSection />

				<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[300px]">
					<h3 className="font-medium text-[16px]">Overview</h3>
				</div>

				<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[300px]">
					<h3 className="font-medium text-[16px]">Overview</h3>
				</div>
			</div>
		</div>
	);
};

export default OverviewSection;

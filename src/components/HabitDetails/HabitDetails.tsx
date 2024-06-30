import classNames from 'classnames';
import Icon from '../Icon';

// Should kind of be like TaskDetails but for Habits
const HabitDetails = () => {
	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
			<div className="p-4 h-full flex flex-col gap-3">
				<TitleSection />
				<OverviewStatsSection />
			</div>
		</div>
	);
};

const TitleSection = () => (
	<div className="flex items-center justify-between">
		<div className="flex items-center gap-1">
			<Icon
				name="no_drinks"
				fill={1}
				customClass={'text-color-gray-50 !text-[30px] hover:text-white cursor-pointer'}
			/>

			<h2 className="text-[18px] font-medium">No Coke</h2>
		</div>

		<Icon
			name="more_horiz"
			fill={1}
			customClass={'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer'}
		/>
	</div>
);

const OverviewStatsSection = () => {
	const OverviewStatCard = ({ name, iconName, iconColor = 'text-emerald-400', unitValue, unitType }) => {
		return (
			<div className="bg-color-gray-600 rounded-md p-2">
				<div className="flex items-center gap-1">
					<Icon
						name={iconName}
						fill={1}
						customClass={classNames(iconColor, '!text-[18px] hover:text-white cursor-pointer')}
					/>
					<div>{name}</div>
				</div>

				<div>
					<span className="font-medium text-[24px]">{unitValue}</span> <span>{unitType}</span>
				</div>
			</div>
		);
	};

	return (
		<div className="grid grid-cols-2 gap-2">
			<OverviewStatCard name="Monthly Check-ins" iconName="check_circle" unitValue={1} unitType="Day" />
			<OverviewStatCard
				name="Total Check-ins"
				iconName="bolt"
				iconColor="text-cyan-300"
				unitValue={1}
				unitType="Day"
			/>
			<OverviewStatCard
				name="Monthly check-ins"
				iconName="sword_rose"
				iconColor="text-purple-400"
				unitValue={1}
				unitType="Day"
			/>
			<OverviewStatCard
				name="Monthly check-ins"
				iconName="local_fire_department"
				iconColor="text-orange-400"
				unitValue={1}
				unitType="Day"
			/>
		</div>
	);
};

// const CalendarSection = () => (
// 	<div>
// 		<div></div>
// 	</div>
// );

// const HabitLogSection = () => (
// 	<div>
// 		<div></div>
// 	</div>
// );

export default HabitDetails;

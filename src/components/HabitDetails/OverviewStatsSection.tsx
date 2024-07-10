import classNames from 'classnames';
import { useState } from 'react';
import Icon from '../Icon';
import { getAchievedDays, getCheckInsPerMonth, getStreaks } from '../../utils/habits.util';

const OverviewStatsSection = ({ habit }) => {
	const OverviewStatCard = ({
		name,
		iconName,
		iconColor = 'text-emerald-400',
		unitValue,
		unitType,
		isCurrentStreak = false,
	}) => {
		const [showBestStreak, setShowBestStreak] = useState(false);
		const nameToShow = isCurrentStreak ? (showBestStreak ? 'Best Streak' : 'Current Streak') : name;

		return (
			<div className="bg-color-gray-600 rounded-lg p-2">
				<div className="flex items-center gap-1">
					<Icon
						name={iconName}
						fill={1}
						customClass={classNames(iconColor, '!text-[18px] hover:text-white cursor-pointer')}
					/>
					<div className="flex items-center gap-1">
						{nameToShow}{' '}
						{isCurrentStreak && (
							<Icon
								name="sync"
								fill={1}
								customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
								onClick={() => setShowBestStreak(!showBestStreak)}
							/>
						)}
					</div>
				</div>

				<div>
					<span className="font-medium text-[24px]">{unitValue}</span> <span>{unitType}</span>
				</div>
			</div>
		);
	};

	const result = getStreaks(habit);
	const { longestStreak, currentStreak } = result;
	const totalCheckIns = getAchievedDays(habit);

	const checkInsPerMonth = getCheckInsPerMonth(habit);
	console.log(checkInsPerMonth);

	// This is for the current month
	const today = new Date();
	const todaysMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
	const currentMonthCheckIns = checkInsPerMonth[todaysMonth];

	return (
		<div className="grid grid-cols-2 gap-3">
			<OverviewStatCard
				name="Current Streak"
				iconName="local_fire_department"
				iconColor="text-orange-400"
				unitValue={currentStreak}
				unitType={currentStreak !== 1 ? 'Days' : 'Day'}
				isCurrentStreak={true}
			/>
			<OverviewStatCard
				name="Longest Streak"
				iconName="sword_rose"
				iconColor="text-purple-400"
				unitValue={longestStreak}
				unitType={longestStreak !== 1 ? 'Days' : 'Day'}
			/>
			<OverviewStatCard
				name="Monthly Check-ins"
				iconName="check_circle"
				unitValue={currentMonthCheckIns}
				unitType={currentMonthCheckIns !== 1 ? 'Days' : 'Day'}
			/>
			<OverviewStatCard
				name="Total Check-ins"
				iconName="bolt"
				iconColor="text-cyan-300"
				unitValue={totalCheckIns}
				unitType={totalCheckIns !== 1 ? 'Days' : 'Day'}
			/>
		</div>
	);
};

export default OverviewStatsSection;

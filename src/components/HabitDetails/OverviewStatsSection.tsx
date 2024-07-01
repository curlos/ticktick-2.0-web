import classNames from 'classnames';
import { useState } from 'react';
import Icon from '../Icon';

const OverviewStatsSection = () => {
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

	return (
		<div className="grid grid-cols-2 gap-3">
			<OverviewStatCard name="Monthly Check-ins" iconName="check_circle" unitValue={1} unitType="Day" />
			<OverviewStatCard
				name="Total Check-ins"
				iconName="bolt"
				iconColor="text-cyan-300"
				unitValue={1}
				unitType="Day"
			/>
			<OverviewStatCard
				name="Monthly Check-in Rate"
				iconName="sword_rose"
				iconColor="text-purple-400"
				unitValue={3}
				unitType="%"
			/>
			<OverviewStatCard
				name="Current Streak"
				iconName="local_fire_department"
				iconColor="text-orange-400"
				unitValue={1}
				unitType="Day"
				isCurrentStreak={true}
			/>
		</div>
	);
};

export default OverviewStatsSection;

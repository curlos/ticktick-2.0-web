import classNames from 'classnames';
import Dropdown from '../Dropdown/Dropdown';
import Icon from '../Icon';

const DropdownTimeIntervals = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selectedTimeInterval,
	setSelectedTimeInterval,
}) => {
	const TimeOption = ({ name }) => {
		return (
			<div
				className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-md cursor-pointer"
				onClick={() => {
					setSelectedTimeInterval(name);
					setIsVisible(false);
				}}
			>
				<div className={selectedTimeInterval === name ? 'text-blue-500' : ''}>{name}</div>
				{selectedTimeInterval === name && (
					<Icon
						name="check"
						fill={0}
						customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
					/>
				)}
			</div>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
		>
			<div className="w-[175px] p-1">
				<TimeOption name="Day" />
				<TimeOption name="Week" />
				<TimeOption name="Month" />
			</div>
		</Dropdown>
	);
};

export default DropdownTimeIntervals;

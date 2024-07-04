import { useRef, useState } from 'react';
import Icon from '../../Icon';
import { DropdownProps } from '../../../interfaces/interfaces';
import Dropdown from '../../Dropdown/Dropdown';
import classNames from 'classnames';

const FrequencySection = () => {
	const dropdownFrequencyRef = useRef(null);
	const [isDropdownFrequencyVisible, setIsDropdownFrequencyVisible] = useState(false);

	return (
		<div>
			<div className="flex items-center">
				<div className="w-[96px]">Frequency</div>
				<div className="flex-1 relative">
					<div
						ref={dropdownFrequencyRef}
						className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
						onClick={() => {
							setIsDropdownFrequencyVisible(!isDropdownFrequencyVisible);
						}}
					>
						<div style={{ wordBreak: 'break-word' }}>Daily</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownFrequency
						toggleRef={dropdownFrequencyRef}
						isVisible={isDropdownFrequencyVisible}
						setIsVisible={setIsDropdownFrequencyVisible}
						customClasses="ml-[0px]"
					/>
				</div>
			</div>
		</div>
	);
};

interface DropdownFrequencyProps extends DropdownProps {}

const DropdownFrequency: React.FC<DropdownFrequencyProps> = ({ toggleRef, isVisible, setIsVisible, customClasses }) => {
	const [selectedInterval, setSelectedInterval] = useState('Daily');

	const TopButton = ({ name }) => {
		const isSelected = selectedInterval.toLowerCase() === name.toLowerCase();

		return (
			<div
				className={classNames(
					'py-1 px-4 rounded-3xl cursor-pointer text-center',
					isSelected
						? 'bg-[#222735] text-[#4671F7] font-semibold'
						: 'bg-color-gray-200/60 text-color-gray-100 hover:bg-color-gray-200/40'
				)}
				onClick={() => setSelectedInterval(name)}
			>
				{name}
			</div>
		);
	};

	const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Sat']);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
		>
			<div className="p-2">
				<div className="grid grid-cols-3 gap-3">
					<TopButton name="Daily" />
					<TopButton name="Weekly" />
					<TopButton name="Interval" />
				</div>

				<DailySection selectedDays={selectedDays} setSelectedDays={setSelectedDays} />

				<div className="grid grid-cols-2 gap-2 mt-6">
					<button
						className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200"
						onClick={() => setIsVisible(false)}
					>
						Cancel
					</button>
					<button
						className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600"
						onClick={() => setIsVisible(false)}
					>
						Ok
					</button>
				</div>
			</div>
		</Dropdown>
	);
};

const DailySection = ({ selectedDays, setSelectedDays }) => {
	const daysOfWeek = [
		{ fullName: 'Monday', shortName: 'Mon' },
		{ fullName: 'Tuesday', shortName: 'Tue' },
		{ fullName: 'Wednesday', shortName: 'Wed' },
		{ fullName: 'Thursday', shortName: 'Thu' },
		{ fullName: 'Friday', shortName: 'Fri' },
		{ fullName: 'Saturday', shortName: 'Sat' },
		{ fullName: 'Sunday', shortName: 'Sun' },
	];

	return (
		<div className="mt-4">
			<div className="text-color-gray-100">Pick Days</div>

			<div className="flex gap-2 mt-3">
				{daysOfWeek.map((day) => {
					const isSelected = selectedDays.includes(day.shortName);

					return (
						<div
							className={classNames(
								'rounded-full text-white h-[35px] w-[35px] flex items-center justify-center cursor-pointer',
								isSelected
									? 'bg-blue-500 hover:bg-blue-500/90'
									: 'bg-color-gray-200/60 hover:bg-color-gray-200/50'
							)}
						>
							{day.shortName}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default FrequencySection;

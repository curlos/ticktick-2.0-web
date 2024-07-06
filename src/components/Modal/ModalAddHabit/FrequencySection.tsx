import { useRef, useState } from 'react';
import Icon from '../../Icon';
import { DropdownProps } from '../../../interfaces/interfaces';
import Dropdown from '../../Dropdown/Dropdown';
import classNames from 'classnames';
import CustomInput from '../../CustomInput';

interface FrequencySectionProps {
	selectedInterval: string;
	setSelectedInterval: (interval: string) => void;
	daysOfWeek: string[];
	setDaysOfWeek: (days: string[]) => void;
	daysPerWeek: number;
	setDaysPerWeek: (days: number) => void;
	everyXDays: number;
	setEveryXDays: (interval: number) => void;
}

const FrequencySection: React.FC<FrequencySectionProps> = ({
	selectedInterval,
	setSelectedInterval,
	daysOfWeek,
	setDaysOfWeek,
	daysPerWeek,
	setDaysPerWeek,
	everyXDays,
	setEveryXDays,
}) => {
	const dropdownFrequencyRef = useRef(null);
	const [isDropdownFrequencyVisible, setIsDropdownFrequencyVisible] = useState(false);

	const getSectionTitle = () => {
		const selectedIntervalLowercase = selectedInterval.toLowerCase();

		if (selectedIntervalLowercase === 'daily') {
			const everyDayIsSelected = daysOfWeek.every((day) => day.selected);

			if (everyDayIsSelected) {
				return 'Daily';
			}

			const allSelectedDays = daysOfWeek.filter((day) => day.selected);
			const allSelectedDaysString = allSelectedDays.map((day) => day.shortName).join(', ');

			return `Every ${allSelectedDaysString}`;
		} else if (selectedIntervalLowercase === 'weekly') {
			if (daysPerWeek === 7) {
				return 'Daily';
			}

			return `${daysPerWeek} days per week`;
		} else {
			if (everyXDays === 1) {
				return 'Daily';
			}

			return `Every ${everyXDays} days`;
		}
	};

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
						<div style={{ wordBreak: 'break-word' }}>{getSectionTitle()}</div>
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
						selectedInterval={selectedInterval}
						setSelectedInterval={setSelectedInterval}
						daysOfWeek={daysOfWeek}
						setDaysOfWeek={setDaysOfWeek}
						daysPerWeek={daysPerWeek}
						setDaysPerWeek={setDaysPerWeek}
						everyXDays={everyXDays}
						setEveryXDays={setEveryXDays}
					/>
				</div>
			</div>
		</div>
	);
};

interface DropdownFrequencyProps extends DropdownProps, FrequencySectionProps {}

const DropdownFrequency: React.FC<DropdownFrequencyProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selectedInterval,
	setSelectedInterval,
	daysOfWeek,
	setDaysOfWeek,
	daysPerWeek,
	setDaysPerWeek,
	everyXDays,
	setEveryXDays,
}) => {
	const [localSelectedInterval, setLocalSelectedInterval] = useState(selectedInterval);
	const [localDaysOfWeek, setLocalDaysOfWeek] = useState(daysOfWeek);
	const [localDaysPerWeek, setLocalDaysPerWeek] = useState(daysPerWeek);
	const [localEveryXDays, setLocalEveryXDays] = useState(everyXDays);

	const TopButton = ({ name }) => {
		const isSelected = localSelectedInterval.toLowerCase() === name.toLowerCase();

		return (
			<div
				className={classNames(
					'py-1 px-4 rounded-3xl cursor-pointer text-center',
					isSelected
						? 'bg-[#222735] text-[#4671F7] font-semibold'
						: 'bg-color-gray-200/60 text-color-gray-100 hover:bg-color-gray-200/40'
				)}
				onClick={() => setLocalSelectedInterval(name)}
			>
				{name}
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
			<div className="p-2">
				<div className="grid grid-cols-3 gap-3">
					<TopButton name="Daily" />
					<TopButton name="Weekly" />
					<TopButton name="Interval" />
				</div>

				{localSelectedInterval.toLowerCase() === 'daily' && (
					<DailySection localDaysOfWeek={localDaysOfWeek} setLocalDaysOfWeek={setLocalDaysOfWeek} />
				)}

				{localSelectedInterval.toLowerCase() === 'weekly' && (
					<WeeklySection localDaysPerWeek={localDaysPerWeek} setLocalDaysPerWeek={setLocalDaysPerWeek} />
				)}

				{localSelectedInterval.toLowerCase() === 'interval' && (
					<IntervalSection localEveryXDays={localEveryXDays} setLocalEveryXDays={setLocalEveryXDays} />
				)}

				<div className="grid grid-cols-2 gap-2 mt-6">
					<button
						className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200"
						onClick={() => setIsVisible(false)}
					>
						Cancel
					</button>
					<button
						className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600"
						onClick={() => {
							setSelectedInterval(localSelectedInterval);
							setDaysOfWeek(localDaysOfWeek);
							setDaysPerWeek(Number(localDaysPerWeek));
							setEveryXDays(Number(localEveryXDays));

							setIsVisible(false);
						}}
					>
						Ok
					</button>
				</div>
			</div>
		</Dropdown>
	);
};

const DailySection = ({ localDaysOfWeek, setLocalDaysOfWeek }) => {
	return (
		<div className="mt-4">
			<div className="text-color-gray-100">Pick Days</div>

			<div className="flex gap-2 mt-3">
				{localDaysOfWeek.map((day) => {
					const isSelected = day.selected;

					return (
						<div
							key={day.shortName}
							className={classNames(
								'rounded-full text-white h-[35px] w-[35px] flex items-center justify-center cursor-pointer',
								isSelected
									? 'bg-blue-500 hover:bg-blue-500/90'
									: 'bg-color-gray-200/60 hover:bg-color-gray-200/50'
							)}
							onClick={() => {
								const newDaysOfWeek = localDaysOfWeek.map((newDay) => {
									const clickedDay = newDay.fullName === day.fullName;

									if (clickedDay) {
										return {
											...newDay,
											selected: !newDay.selected,
										};
									}

									return newDay;
								});
								setLocalDaysOfWeek(newDaysOfWeek);
							}}
						>
							{day.shortName}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const WeeklySection = ({ localDaysPerWeek, setLocalDaysPerWeek }) => {
	return (
		<div className="mt-4">
			<div className="text-color-gray-100">
				{localDaysPerWeek} {localDaysPerWeek === 1 ? 'day' : 'days'} per week
			</div>

			<div className="flex gap-2 mt-3">
				{[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
					const isSelected = dayNumber === localDaysPerWeek;

					return (
						<div
							key={dayNumber}
							className={classNames(
								'rounded-full text-white h-[35px] w-[35px] flex items-center justify-center cursor-pointer',
								isSelected
									? 'bg-blue-500 hover:bg-blue-500/90'
									: 'bg-color-gray-200/60 hover:bg-color-gray-200/50'
							)}
							onClick={() => setLocalDaysPerWeek(dayNumber)}
						>
							{dayNumber}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const IntervalSection = ({ localEveryXDays, setLocalEveryXDays }) => {
	return (
		<div className="mt-4">
			<div className="flex items-center gap-2">
				<div>Every</div>
				<CustomInput
					type="number"
					min={1}
					value={localEveryXDays}
					setValue={setLocalEveryXDays}
					customClasses="max-w-[100px] no-number-arrows"
				/>
				<div>{Number(localEveryXDays) === 1 ? 'day' : 'days'}</div>
			</div>
		</div>
	);
};

export default FrequencySection;

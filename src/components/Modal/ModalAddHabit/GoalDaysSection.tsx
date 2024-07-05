import { useRef, useState } from 'react';
import Icon from '../../Icon';
import Dropdown from '../../Dropdown/Dropdown';
import classNames from 'classnames';
import CustomInput from '../../CustomInput';

const GoalDaysSection = () => {
	const dropdownGoalDaysRef = useRef(null);
	const [isDropdownGoalDaysVisible, setIsDropdownGoalDaysVisible] = useState(false);
	const [selectedGoalDays, setSelectedGoalDays] = useState(Infinity);

	return (
		<div>
			<div className="flex items-center">
				<div className="w-[96px]">Goal Days</div>
				<div className="flex-1 relative">
					<div
						ref={dropdownGoalDaysRef}
						className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
						onClick={() => {
							setIsDropdownGoalDaysVisible(!isDropdownGoalDaysVisible);
						}}
					>
						<div style={{ wordBreak: 'break-word' }}>
							{selectedGoalDays === Infinity ? 'Forever' : `${selectedGoalDays} days`}
						</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownGoalDays
						toggleRef={dropdownGoalDaysRef}
						isVisible={isDropdownGoalDaysVisible}
						setIsVisible={setIsDropdownGoalDaysVisible}
						selectedGoalDays={selectedGoalDays}
						setSelectedGoalDays={setSelectedGoalDays}
					/>
				</div>
			</div>
		</div>
	);
};

const DropdownGoalDays = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selectedGoalDays,
	setSelectedGoalDays,
}) => {
	const goalDayOptions = [Infinity, 7, 21, 30, 100, 365];
	const dropdownCustomGoalDaysRef = useRef(null);
	const [isDropdownCustomGoalDaysVisible, setIsDropdownCustomGoalDaysVisible] = useState(false);

	const GoalDayOption = ({ goalDayOption }) => {
		const isCustomGoalDays = !goalDayOptions.includes(selectedGoalDays);
		const isSelected = goalDayOption === 'Custom' ? isCustomGoalDays : selectedGoalDays === goalDayOption;

		return (
			<div
				className={classNames(
					'flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer',
					isSelected ? 'text-blue-500' : ''
				)}
				onClick={() => {
					if (goalDayOption !== 'Custom') {
						setSelectedGoalDays(goalDayOption);
						setIsVisible(false);
					}
				}}
			>
				<div>
					{goalDayOption === Infinity
						? 'Forever'
						: goalDayOption === 'Custom'
							? 'Custom'
							: `${goalDayOption} days`}
				</div>
				{isSelected && (
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
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg w-[200px]', customClasses)}
		>
			<div className="p-1">
				{goalDayOptions.map((goalDayOption) => (
					<GoalDayOption key={goalDayOption} goalDayOption={goalDayOption} />
				))}

				<div className="relative">
					<div
						ref={dropdownCustomGoalDaysRef}
						onClick={() => setIsDropdownCustomGoalDaysVisible(!isDropdownCustomGoalDaysVisible)}
					>
						<GoalDayOption goalDayOption="Custom" />
					</div>

					<DropdownCustomGoalDays
						toggleRef={dropdownCustomGoalDaysRef}
						isVisible={isDropdownCustomGoalDaysVisible}
						setIsVisible={setIsDropdownCustomGoalDaysVisible}
						selectedGoalDays={selectedGoalDays}
						setSelectedGoalDays={setSelectedGoalDays}
					/>
				</div>
			</div>
		</Dropdown>
	);
};

const DropdownCustomGoalDays = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selectedGoalDays,
	setSelectedGoalDays,
}) => {
	const [localGoalDays, setLocalGoalDays] = useState(selectedGoalDays !== Infinity ? selectedGoalDays : 7);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg w-[200px]', customClasses)}
		>
			<div className="p-3">
				<div className="flex items-center gap-2">
					<CustomInput
						type="number"
						min={1}
						value={localGoalDays}
						setValue={setLocalGoalDays}
						customClasses="!text-left"
					/>
					<span>days</span>
				</div>

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
							setSelectedGoalDays(Number(localGoalDays));
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

export default GoalDaysSection;

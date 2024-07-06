import { useRef, useState } from 'react';
import Icon from '../../Icon';
import { DropdownProps } from '../../../interfaces/interfaces';
import Dropdown from '../../Dropdown/Dropdown';
import classNames from 'classnames';
import CustomInput from '../../CustomInput';

const GoalSection = ({
	goalType,
	setGoalType,
	dailyValue,
	setDailyValue,
	dailyUnit,
	setDailyUnit,
	whenChecking,
	setWhenChecking,
}) => {
	const dropdownGoalRef = useRef(null);
	const [isDropdownGoalVisible, setIsDropdownGoalVisible] = useState(false);
	const [goalName, setGoalName] = useState('Achieve it all');

	return (
		<div>
			<div className="flex items-center">
				<div className="w-[96px]">Goal</div>
				<div className="flex-1 relative">
					<div
						ref={dropdownGoalRef}
						className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
						onClick={() => {
							setIsDropdownGoalVisible(!isDropdownGoalVisible);
						}}
					>
						<div style={{ wordBreak: 'break-word' }}>{goalName}</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownGoal
						toggleRef={dropdownGoalRef}
						isVisible={isDropdownGoalVisible}
						setIsVisible={setIsDropdownGoalVisible}
						customClasses="ml-[0px]"
						setGoalName={setGoalName}
						goalType={goalType}
						setGoalType={setGoalType}
						dailyValue={dailyValue}
						setDailyValue={setDailyValue}
						dailyUnit={dailyUnit}
						setDailyUnit={setDailyUnit}
						whenChecking={whenChecking}
						setWhenChecking={setWhenChecking}
					/>
				</div>
			</div>
		</div>
	);
};

interface DropdownGoalProps extends DropdownProps {}

const DropdownGoal: React.FC<DropdownGoalProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	setGoalName,
	goalType,
	setGoalType,
	dailyValue,
	setDailyValue,
	dailyUnit,
	setDailyUnit,
	whenChecking,
	setWhenChecking,
}) => {
	const dropdownReachAmountRef = useRef(null);
	const [isDropdownReachAmountVisible, setIsDropdownReachAmountVisible] = useState(false);

	const canAccessDropdownReachAmount = goalType === 'reachCertainAmount';

	const [localDailyValue, setLocalDailyValue] = useState(1);
	const [localDailyUnit, setLocalDailyUnit] = useState('Count');

	const getGoalName = () => (goalType === 'reachCertainAmount' ? `${dailyValue} ${dailyUnit}/Day` : 'Achieve it all');

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
		>
			<div className="p-3">
				<CustomCheckbox
					goalName="Achieve it all"
					isChecked={goalType === 'achieveItAll'}
					goalTypeName="achieveItAll"
					setGoalType={setGoalType}
				/>

				<CustomCheckbox
					goalName="Reach a certain amount"
					isChecked={goalType === 'reachCertainAmount'}
					goalTypeName="reachCertainAmount"
					setGoalType={setGoalType}
				/>

				<div
					className={classNames(
						'flex-1 relative mt-3',
						!canAccessDropdownReachAmount ? 'cursor-not-allowed' : ''
					)}
				>
					<div
						ref={dropdownReachAmountRef}
						className={classNames(
							'border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer',
							!canAccessDropdownReachAmount ? 'cursor-not-allowed opacity-60' : ''
						)}
						onClick={() => {
							if (canAccessDropdownReachAmount) {
								setIsDropdownReachAmountVisible(!isDropdownReachAmountVisible);
							}
						}}
					>
						<div style={{ wordBreak: 'break-word' }}>{getGoalName()}</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownReachAmount
						toggleRef={dropdownReachAmountRef}
						isVisible={isDropdownReachAmountVisible}
						setIsVisible={setIsDropdownReachAmountVisible}
						dailyValue={dailyValue}
						setDailyValue={setDailyValue}
						dailyUnit={dailyUnit}
						setDailyUnit={setDailyUnit}
						whenChecking={whenChecking}
						setWhenChecking={setWhenChecking}
					/>
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
							setGoalName(getGoalName());
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

const CustomCheckbox = ({ goalName, isChecked, goalTypeName, setGoalType }) => {
	// Function to handle change when the div or checkbox is clicked
	const handleChange = () => {
		// Toggle the current checked state
		setGoalType(goalTypeName);
	};

	return (
		<div
			className="flex items-center gap-2 cursor-pointer hover:bg-color-gray-300 py-1 rounded"
			onClick={handleChange}
		>
			<input
				type="checkbox"
				name="Achieve it all"
				className="accent-blue-500"
				checked={isChecked}
				onChange={handleChange} // Using the same handleChange function for consistency
				onClick={(e) => e.stopPropagation()} // Prevent the event from bubbling up to the div's onClick
			/>
			<span className={isChecked ? 'text-blue-500' : ''}>{goalName}</span>
		</div>
	);
};

interface DropdownReachAmountProps extends DropdownProps {}

const DropdownReachAmount: React.FC<DropdownReachAmountProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	dailyValue,
	setDailyValue,
	dailyUnit,
	setDailyUnit,
	whenChecking,
	setWhenChecking,
}) => {
	const dropdownWhenCheckingRef = useRef(null);
	const [isDropdownWhenCheckingVisible, setIsDropdownWhenCheckingVisible] = useState(false);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg w-[250px]', customClasses)}
		>
			<div className="p-3 space-y-3">
				<div className="grid grid-cols-2 gap-2 w-full">
					<div className="flex items-center gap-2">
						<div>Daily</div>
						<CustomInput type="number" min={1} value={dailyValue} setValue={setDailyValue} />
					</div>
					<CustomInput value={dailyUnit} setValue={setDailyUnit} />
				</div>

				<div className="grid grid-cols-2 items-center gap-2 w-full">
					<div className="flex items-center gap-2">
						<div>When checking</div>
					</div>
					<div className="flex-1 relative">
						<div
							ref={dropdownWhenCheckingRef}
							className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
							onClick={() => {
								setIsDropdownWhenCheckingVisible(!isDropdownWhenCheckingVisible);
							}}
						>
							<div className="max-w-[70px] truncate" style={{ wordBreak: 'break-word' }}>
								{whenChecking}
							</div>
							<Icon
								name="expand_more"
								fill={0}
								customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
							/>
						</div>

						<DropdownWhenChecking
							toggleRef={dropdownWhenCheckingRef}
							isVisible={isDropdownWhenCheckingVisible}
							setIsVisible={setIsDropdownWhenCheckingVisible}
							whenChecking={whenChecking}
							setWhenChecking={setWhenChecking}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2">
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

interface DropdownWhenCheckingProps extends DropdownProps {}

const DropdownWhenChecking: React.FC<DropdownWhenCheckingProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	whenChecking,
	setWhenChecking,
}) => {
	const whenCheckingTypes = ['Auto', 'Manual', 'Complete all'];

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg w-[150px]', customClasses)}
		>
			<div className="p-1">
				{whenCheckingTypes.map((checkingType) => (
					<div
						key={checkingType}
						className={classNames(
							'flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer',
							whenChecking === checkingType ? 'text-blue-500' : ''
						)}
						onClick={() => {
							setWhenChecking(checkingType);
							setIsVisible(false);
						}}
					>
						<div>{checkingType}</div>
						{whenChecking === checkingType && (
							<Icon
								name="check"
								fill={0}
								customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
							/>
						)}
					</div>
				))}
			</div>
		</Dropdown>
	);
};

export default GoalSection;

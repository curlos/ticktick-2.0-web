import { useRef, useState } from 'react';
import Dropdown from '../Dropdown';
import Icon from '../../Icon';
import CustomInput from '../../CustomInput';
import { DropdownProps } from '../../../interfaces/interfaces';

const BASIC_REMINDER_OPTIONS = {
	'On the day (09:00)': {
		checked: false,
	},
	'1 days ahead (09:00)': {
		checked: false,
	},
	'2 days ahead (09:00)': {
		checked: false,
	},
	'3 days ahead (09:00)': {
		checked: false,
	},
	'1 week ahead (09:00)': {
		checked: false,
	},
};

interface DropdownReminderProps extends DropdownProps {
	reminder: string;
	setReminder: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownReminder: React.FC<DropdownReminderProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	reminder,
	setReminder,
}) => {
	const [basicReminderOptions, setBasicReminderOptions] = useState(BASIC_REMINDER_OPTIONS);
	const [isDropdownAdvancedReminderVisible, setIsDropdownAdvancedReminderVisible] = useState(false);

	const dropdownAdvancedReminderRef = useRef(null);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={' ml-[-5px] shadow-2xl border border-color-gray-200 rounded-lg'}
		>
			<div className="w-[260px] rounded" onClick={(e) => e.stopPropagation()}>
				<div className="p-1">
					{Object.keys(basicReminderOptions).map((name: string) => (
						<div
							key={name}
							className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
							onClick={() => {
								// console.log({
								//     ...basicReminderOptions, [name]: {
								//         ...basicReminderOptions[name], checked: !basicReminderOptions[name].checked
								//     }
								// });
								// setBasicReminderOptions({
								//     ...basicReminderOptions, [name]: {
								//         ...basicReminderOptions[name], checked: !basicReminderOptions[name].checked
								//     }
								// });
								// setIsVisible(false);
							}}
						>
							<div>{name}</div>
							{basicReminderOptions[name].checked && (
								<Icon
									name="check"
									fill={0}
									customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
								/>
							)}
						</div>
					))}
				</div>

				<hr className="border-color-gray-200" />

				<div className="relative">
					<div className="p-1">
						<div
							ref={dropdownAdvancedReminderRef}
							className="p-2 mb-2 flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
							onClick={() => setIsDropdownAdvancedReminderVisible(!isDropdownAdvancedReminderVisible)}
						>
							Custom
						</div>

						<DropdownAdvancedReminder
							toggleRef={dropdownAdvancedReminderRef}
							isVisible={isDropdownAdvancedReminderVisible}
							setIsVisible={setIsDropdownAdvancedReminderVisible}
							reminder={reminder}
							setReminder={setReminder}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2 pb-4 px-3">
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

interface DropdownAdvancedReminderProps extends DropdownReminderProps {}

const DropdownAdvancedReminder: React.FC<DropdownAdvancedReminderProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	reminder,
	setReminder,
}) => {
	const [selectedUnitOfTime, setSelectedUnitOfTime] = useState('Day');
	const [isDropdownUnitOfTimeVisible, setIsDropdownUnitOfTimeVisible] = useState(false);
	const [unitsInAdvance, setUnitsInAdvance] = useState(1);
	const [remindAt, setRemindAt] = useState();

	const dropdownUnitOfTimeRef = useRef(null);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={' ml-[0px] shadow-2xl border border-color-gray-200 rounded-lg'}
		>
			<div className="w-[260px] p-3 rounded" onClick={(e) => e.stopPropagation()}>
				<div className="relative">
					<div
						ref={dropdownUnitOfTimeRef}
						className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500"
						onClick={() => {
							setIsDropdownUnitOfTimeVisible(!isDropdownUnitOfTimeVisible);
						}}
					>
						<div>{selectedUnitOfTime}</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownUnitOfTime
						toggleRef={dropdownUnitOfTimeRef}
						isVisible={isDropdownUnitOfTimeVisible}
						setIsVisible={setIsDropdownUnitOfTimeVisible}
						selectedUnitOfTime={selectedUnitOfTime}
						setSelectedUnitOfTime={setSelectedUnitOfTime}
					/>
				</div>

				<div className="my-3 space-y-[10px]">
					<div className="grid grid-cols-2 items-center gap-2">
						<div>Days in advance</div>
						<CustomInput value={unitsInAdvance} setValue={setUnitsInAdvance} />
					</div>

					<div className="grid grid-cols-2 items-center gap-2">
						<div>Remind me at</div>
						<CustomInput value={unitsInAdvance} setValue={setUnitsInAdvance} />
					</div>
				</div>

				<div className="text-color-gray-100 mb-2">Remind at 09:00 on Mar 15, 2024.</div>

				<div className="grid grid-cols-2 gap-2 pb-4">
					<button
						className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200"
						onClick={() => setIsVisible(false)}
					>
						Clear
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

interface DropdownUnitOfTimeProps extends DropdownProps {
	selectedUnitOfTime: string;
	setSelectedUnitOfTime: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownUnitOfTime: React.FC<DropdownUnitOfTimeProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedUnitOfTime,
	setSelectedUnitOfTime,
}) => {
	const UNITS_OF_TIME = ['Day', 'Week'];
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={' p-1 shadow-2xl border border-color-gray-200 rounded-lg'}
		>
			{UNITS_OF_TIME.map((unitOfTime) => (
				<div
					className="w-[230px] flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg"
					onClick={() => {
						setSelectedUnitOfTime(unitOfTime);
						setIsVisible(false);
					}}
				>
					<div>{unitOfTime}</div>
					{selectedUnitOfTime === unitOfTime && (
						<Icon
							name="check"
							fill={0}
							customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
						/>
					)}
				</div>
			))}
		</Dropdown>
	);
};

export default DropdownReminder;

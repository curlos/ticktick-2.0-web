import { useState } from 'react';
import Dropdown from '../Dropdown';
import { DropdownProps } from '../../../interfaces/interfaces';
import CustomInput from '../../CustomInput';
import { formatTimeToHoursMinutesSeconds } from '../../../utils/helpers.utils';

interface DropdownSetFocusTypeAndAmountProps extends DropdownProps {
	selectedTask: Object | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<Object | null>>;
	focusType: string;
	setFocusType: React.Dispatch<React.SetStateAction<string>>;
	pomos: number;
	setPomos: React.Dispatch<React.SetStateAction<number>>;
	hours: number;
	setHours: React.Dispatch<React.SetStateAction<number>>;
	minutes: number;
	setMinutes: React.Dispatch<React.SetStateAction<number>>;
}

const DropdownSetFocusTypeAndAmount: React.FC<DropdownSetFocusTypeAndAmountProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	focusType,
	setFocusType,
	pomos,
	setPomos,
	hours,
	setHours,
	minutes,
	setMinutes,
	getDuration,
}) => {
	const sharedButtonStyle = `text-[12px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
	const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666] bg-color-gray-300`;

	const handlePomoChange = (newPomos) => {
		setPomos(newPomos);

		const duration = getDuration(newPomos);
		const { hours, minutes } = formatTimeToHoursMinutesSeconds(duration);
		setHours(hours);
		setMinutes(minutes);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'w-[250px] p-1 shadow-2xl border border-color-gray-200 rounded-lg p-2'}
		>
			<div className="flex justify-center gap-1">
				<div
					className={focusType === 'pomo' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setFocusType('pomo')}
				>
					Pomo
				</div>
				<div
					className={focusType === 'stopwatch' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setFocusType('stopwatch')}
				>
					Stopwatch
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4 my-4">
				{focusType === 'pomo' ? (
					<div className="flex items-end gap-2">
						<CustomInput value={pomos} setValue={handlePomoChange} customClasses="w-[60px]" />
						<div>pomos</div>
					</div>
				) : (
					<>
						<div className="flex items-end gap-2">
							<CustomInput
								type="number"
								value={hours}
								onChange={(e) => {
									console.log(e.target.value);
									let newHours = Number(e.target.value);

									if (newHours < 0) {
										newHours = 0;
									}

									setHours(newHours);
								}}
								customClasses="w-[60px]"
							/>
							<div>hours</div>
						</div>
						<div className="flex items-end gap-2">
							<CustomInput
								type="number"
								value={minutes}
								onChange={(e) => {
									console.log(e.target.value);
									let newMinutes = Number(e.target.value);

									if (newMinutes > 59) {
										newMinutes = 59;
									} else if (newMinutes < 0) {
										newMinutes = 0;
									}

									setMinutes(newMinutes);
								}}
								customClasses="w-[60px]"
							/>
							<div>mins</div>
						</div>
					</>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<button
					className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200"
					onClick={() => {
						setIsVisible(false);
					}}
				>
					Cancel
				</button>
				<button
					className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600"
					onClick={() => {
						setIsVisible(false);
					}}
				>
					Ok
				</button>
			</div>
		</Dropdown>
	);
};

export default DropdownSetFocusTypeAndAmount;

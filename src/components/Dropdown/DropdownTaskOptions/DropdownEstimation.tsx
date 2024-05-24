import { useRef, useState } from 'react';
import { DropdownProps } from '../../../interfaces/interfaces';
import Dropdown from '../Dropdown';
import CustomInput from '../../CustomInput';
import Icon from '../../Icon';
import classNames from 'classnames';

interface DropdownEstimationProps extends DropdownProps {}

const DropdownEstimation: React.FC<DropdownEstimationProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
}) => {
	const [isDropdownEstimationOptionsVisible, setIsDropdownEstimationOptionsVisible] = useState(false);
	const [selectedEstimationOption, setSelectedEstimationOption] = useState('Estimated Pomo');

	const dropdownEstimationOptionsRef = useRef(null);

	const [pomos, setPomos] = useState(0);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames(
				'mt-[5px] shadow-2xl border border-color-gray-200 rounded mt-[-130px] ml-[-210px]',
				customClasses
			)}
		>
			<div className="w-[200px] p-2 rounded text-[13px]" onClick={(e) => e.stopPropagation()}>
				<div className="flex-1">
					<div className="relative">
						<div
							ref={dropdownEstimationOptionsRef}
							className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
							onClick={() => {
								setIsDropdownEstimationOptionsVisible(!isDropdownEstimationOptionsVisible);
							}}
						>
							<div>{selectedEstimationOption}</div>
							<Icon
								name="expand_more"
								fill={0}
								customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
							/>
						</div>

						<DropdownEstimationOptions
							toggleRef={dropdownEstimationOptionsRef}
							isVisible={isDropdownEstimationOptionsVisible}
							setIsVisible={setIsDropdownEstimationOptionsVisible}
							selectedEstimationOption={selectedEstimationOption}
							setSelectedEstimationOption={setSelectedEstimationOption}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4 my-4">
						{selectedEstimationOption === 'Estimated Pomo' ? (
							<div className="flex items-end gap-2">
								<CustomInput value={pomos} setValue={setPomos} customClasses="w-[60px]" />
								<div>pomos</div>
							</div>
						) : (
							<>
								<div className="flex items-end gap-2">
									<CustomInput value={hours} setValue={setHours} customClasses="w-[60px]" />
									<div>hr</div>
								</div>
								<div className="flex items-end gap-2">
									<CustomInput value={minutes} setValue={setMinutes} customClasses="w-[60px]" />
									<div>min</div>
								</div>
							</>
						)}
					</div>

					<div className="grid grid-cols-2 gap-2">
						<button
							className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200"
							onClick={() => {
								setIsVisible(false);
							}}
						>
							Cancel
						</button>
						<button
							className="bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600"
							onClick={() => {
								setIsVisible(false);
							}}
						>
							Ok
						</button>
					</div>
				</div>
			</div>
		</Dropdown>
	);
};

interface DropdownEstimationOptionsProps extends DropdownProps {
	selectedEstimationOption: string;
	setSelectedEstimationOption: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownEstimationOptions: React.FC<DropdownEstimationOptionsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedEstimationOption,
	setSelectedEstimationOption,
}) => {
	const estimationOptions = ['Estimated Pomo', 'Estimated Duration'];

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'mt-[5px] shadow-2xl border border-color-gray-200 rounded-lg'}
		>
			<div className="w-[170px] p-1 rounded" onClick={(e) => e.stopPropagation()}>
				<div className="overflow-auto gray-scrollbar text-[13px]">
					{estimationOptions.map((estimationOption) => {
						const isSelected = selectedEstimationOption == estimationOption;

						return (
							<div
								key={estimationOption}
								className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
								onClick={() => {
									setSelectedEstimationOption(estimationOption);
									setIsVisible(false);
								}}
							>
								<div className={isSelected ? 'text-blue-500' : ''}>{estimationOption}</div>
								{isSelected && (
									<Icon
										name="check"
										fill={0}
										customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
									/>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownEstimation;

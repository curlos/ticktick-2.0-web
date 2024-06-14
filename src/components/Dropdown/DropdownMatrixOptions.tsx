import Dropdown from './Dropdown';
import Icon from '../Icon';
import { DropdownProps } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import ModalEditMatrix from '../Modal/ModalEditMatrix';
import { setModalState } from '../../slices/modalSlice';
import { useDispatch } from 'react-redux';

interface DropdownMatrixOptions extends DropdownProps {}

const DropdownMatrixOptions: React.FC<DropdownMatrixOptions> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
}) => {
	const dispatch = useDispatch();

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg ml-[-175px]', customClasses)}
		>
			<div className="w-[200px] p-1">
				<div
					className="p-2 hover:bg-color-gray-300 rounded flex items-center gap-2 text-gray-300"
					onClick={() => {
						dispatch(setModalState({ modalId: 'ModalEditMatrix', isOpen: true }));
						setIsVisible(false);
					}}
				>
					<Icon name="edit" fill={0} customClass={'!text-[20px]'} />
					<div>Edit</div>
				</div>

				<OptionWithAnotherDropdown optionName="Group by" iconName="menu" />
				<OptionWithAnotherDropdown optionName="Sort by" iconName="sort" />
			</div>
		</Dropdown>
	);
};

const OptionWithAnotherDropdown = ({ optionName, iconName }) => {
	const OPTIONS = ['Time', 'Title', 'Tag', 'Priority'];

	if (optionName.toLowerCase() === 'group by') {
		OPTIONS.push('None');
	}

	const dropdownAdditonalDetailsRef = useRef();
	const [isDropdownAdditionalDetailsVisible, setIsDropdownAdditionalDetailsVisible] = useState(false);
	const [selectedOption, setSelectedOption] = useState('Time');

	return (
		<div
			className="relative"
			onClick={() => setIsDropdownAdditionalDetailsVisible(!isDropdownAdditionalDetailsVisible)}
		>
			<div className="p-2 hover:bg-color-gray-300 flex justify-between items-center gap-2 rounded text-gray-300">
				<div className="flex items-center gap-2">
					<Icon name={iconName} fill={0} customClass={'!text-[20px]'} />
					<div>{optionName}</div>
				</div>

				<div className="flex items-center gap-1">
					<div>{selectedOption}</div>
					<Icon name="chevron_right" fill={0} customClass={'!text-[16px] text-color-gray-100'} />
				</div>
			</div>

			<DropdownAdditionalDetails
				toggleRef={dropdownAdditonalDetailsRef}
				isVisible={isDropdownAdditionalDetailsVisible}
				setIsVisible={setIsDropdownAdditionalDetailsVisible}
				options={OPTIONS}
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
			/>
		</div>
	);
};

interface DropdownAdditionalDetails extends DropdownProps {}

const DropdownAdditionalDetails: React.FC<DropdownAdditionalDetails> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	options,
	selectedOption,
	setSelectedOption,
}) => {
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg ml-[25px]', customClasses)}
		>
			<div className="w-[170px] p-1">
				{options.map((option) => {
					const isSelectedOption = selectedOption.toLowerCase() === option.toLowerCase();

					return (
						<div
							key={option}
							className="p-2 hover:bg-color-gray-300 rounded flex justify-between items-center gap-2 text-gray-300"
							onClick={() => setSelectedOption(option)}
						>
							<div className={isSelectedOption ? 'text-blue-500' : ''}>{option}</div>
							{isSelectedOption && (
								<Icon name="check" fill={0} customClass={'!text-[20px] text-blue-500'} />
							)}
						</div>
					);
				})}
			</div>
		</Dropdown>
	);
};

export default DropdownMatrixOptions;

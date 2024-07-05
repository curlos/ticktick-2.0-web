import { useRef, useState } from 'react';
import Icon from '../../Icon';
import Dropdown from '../../Dropdown/Dropdown';
import classNames from 'classnames';
import CustomInput from '../../CustomInput';

const HabitSection = () => {
	const dropdownHabitSectionRef = useRef(null);
	const [isDropdownHabitSectionVisible, setIsDropdownHabitSectionVisible] = useState(false);
	const [selectedSection, setSelectedSection] = useState('Others');

	return (
		<div>
			<div className="flex items-center">
				<div className="w-[96px]">Section</div>
				<div className="flex-1 relative">
					<div
						ref={dropdownHabitSectionRef}
						className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
						onClick={() => {
							setIsDropdownHabitSectionVisible(!isDropdownHabitSectionVisible);
						}}
					>
						<div style={{ wordBreak: 'break-word' }}>{selectedSection}</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownHabitSection
						toggleRef={dropdownHabitSectionRef}
						isVisible={isDropdownHabitSectionVisible}
						setIsVisible={setIsDropdownHabitSectionVisible}
						selectedSection={selectedSection}
						setSelectedSection={setSelectedSection}
					/>
				</div>
			</div>
		</div>
	);
};

const DropdownHabitSection = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selectedSection,
	setSelectedSection,
}) => {
	const sectionOptions = ['Morning', 'Afternoon', 'Night', 'Others'];
	const dropdownCustomGoalDaysRef = useRef(null);
	const [isDropdownCustomGoalDaysVisible, setIsDropdownCustomGoalDaysVisible] = useState(false);

	const SectionOption = ({ sectionOption }) => {
		const isSelected = selectedSection === sectionOption;

		return (
			<div
				className={classNames(
					'flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer',
					isSelected ? 'text-blue-500' : ''
				)}
				onClick={() => {
					if (sectionOption !== 'Add Section') {
						setSelectedSection(sectionOption);
						setIsVisible(false);
					}
				}}
			>
				<div>{sectionOption}</div>
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
				{sectionOptions.map((sectionOption) => (
					<SectionOption sectionOption={sectionOption} />
				))}

				<div className="relative">
					<div
						ref={dropdownCustomGoalDaysRef}
						onClick={() => setIsDropdownCustomGoalDaysVisible(!isDropdownCustomGoalDaysVisible)}
					>
						<SectionOption sectionOption="Add Section" />
					</div>

					<DropdownCustomSection
						toggleRef={dropdownCustomGoalDaysRef}
						isVisible={isDropdownCustomGoalDaysVisible}
						setIsVisible={setIsDropdownCustomGoalDaysVisible}
						selectedSection={selectedSection}
						setSelectedSection={setSelectedSection}
					/>
				</div>
			</div>
		</Dropdown>
	);
};

const DropdownCustomSection = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	selectedSection,
	setSelectedSection,
}) => {
	const [localSection, setLocalSection] = useState('');

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
						placeholder="New Section"
						value={localSection}
						setValue={setLocalSection}
						customClasses="!text-left"
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
							// TODO: Possibly will have to make API Call here to add a section and get a list of sections in the habits. Will have to see though what exactly should be done. For now, just leave it as is but need to come back later.
							setSelectedSection(localSection);
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

export default HabitSection;

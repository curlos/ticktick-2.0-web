import { useRef, useState } from 'react';
import Icon from '../../Icon';
import Dropdown from '../../Dropdown/Dropdown';
import classNames from 'classnames';
import CustomInput from '../../CustomInput';
import { useAddHabitSectionMutation, useGetHabitSectionsQuery } from '../../../services/resources/habitSectionsApi';
import useHandleError from '../../../hooks/useHandleError';

const HabitSection = ({ section, setSection }) => {
	const dropdownHabitSectionRef = useRef(null);
	const [isDropdownHabitSectionVisible, setIsDropdownHabitSectionVisible] = useState(false);

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
						<div style={{ wordBreak: 'break-word' }}>{section.name}</div>
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
						section={section}
						setSection={setSection}
					/>
				</div>
			</div>
		</div>
	);
};

const DropdownHabitSection = ({ toggleRef, isVisible, setIsVisible, customClasses, section, setSection }) => {
	// Habit Sections
	const {
		data: fetchedHabitSections,
		isLoading: isLoadingGetHabitSections,
		error: errorGetHabitSections,
	} = useGetHabitSectionsQuery();
	const { habitSections } = fetchedHabitSections || {};

	const sectionOptions = ['Morning', 'Afternoon', 'Night', 'Others'];
	const dropdownCustomGoalDaysRef = useRef(null);
	const [isDropdownCustomGoalDaysVisible, setIsDropdownCustomGoalDaysVisible] = useState(false);

	const SectionOption = ({ habitSection }) => {
		const { name } = habitSection;
		const isSelected = habitSection._id === section._id;

		return (
			<div
				className={classNames(
					'flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer',
					isSelected ? 'text-blue-500' : ''
				)}
				onClick={() => {
					setSection(habitSection);
					setIsVisible(false);
				}}
			>
				<div>{name}</div>
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

	if (!habitSections) {
		return null;
	}

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg w-[200px]', customClasses)}
		>
			<div className="p-1">
				<div className="max-h-[220px] overflow-auto gray-scrollbar">
					{habitSections.map((habitSection) => (
						<SectionOption key={habitSection._id} habitSection={habitSection} />
					))}
				</div>

				<div className="relative border-t border-color-gray-200">
					<div
						ref={dropdownCustomGoalDaysRef}
						onClick={() => setIsDropdownCustomGoalDaysVisible(!isDropdownCustomGoalDaysVisible)}
					>
						<div
							className={
								'flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer'
							}
						>
							<div>Add Section</div>
						</div>
					</div>

					<DropdownCustomSection
						toggleRef={dropdownCustomGoalDaysRef}
						isVisible={isDropdownCustomGoalDaysVisible}
						setIsVisible={setIsDropdownCustomGoalDaysVisible}
						section={section}
						setSection={setSection}
					/>
				</div>
			</div>
		</Dropdown>
	);
};

const DropdownCustomSection = ({ toggleRef, isVisible, setIsVisible, customClasses, section, setSection }) => {
	const handleError = useHandleError();

	// Habit Sections
	const {
		data: fetchedHabitSections,
		isLoading: isLoadingGetHabitSections,
		error: errorGetHabitSections,
	} = useGetHabitSectionsQuery();
	const { habitSections } = fetchedHabitSections || {};

	const [addHabitSection] = useAddHabitSectionMutation();

	const [sectionName, setSectionName] = useState('');

	console.log(habitSections);

	const doesSectionAlreadyExist = habitSections.find((existingSection) => existingSection.name === sectionName);

	console.log(doesSectionAlreadyExist);

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
						value={sectionName}
						setValue={setSectionName}
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
						disabled={doesSectionAlreadyExist ? true : false}
						className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => {
							handleError(async () => {
								const payload = {
									name: sectionName,
								};

								const response = await addHabitSection(payload).unwrap();

								setSection(response);
								setSectionName('');
								setIsVisible(false);
							});
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

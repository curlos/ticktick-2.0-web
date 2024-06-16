import classNames from 'classnames';
import Modal from './Modal';
import Icon from '../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import CustomInput from '../CustomInput';
import { useRef, useState } from 'react';
import { DropdownProps } from '../../interfaces/interfaces';
import Dropdown from '../Dropdown/Dropdown';
import { useGetProjectsQuery } from '../../services/api';
import DropdownProjects from '../Dropdown/DropdownProjects';
import { SMART_LISTS } from '../../utils/smartLists.utils';
import CustomRadioButton from '../CustomRadioButton';

const DATES = [
	{
		name: 'All',
		iconName: 'stacks',
	},
	{
		name: 'No Date',
		iconName: 'hourglass_empty',
	},
	{
		name: 'Overdue',
		iconName: 'west',
	},
	{
		name: 'Repeat',
		iconName: 'repeat',
	},
	{
		name: 'Today',
		iconName: 'calendar_today',
	},
	{
		name: 'Tomorrow',
		iconName: 'upcoming',
	},
	{
		name: 'This Week',
		iconName: 'event_upcoming',
	},
	{
		name: 'Next Week',
		iconName: 'stacks',
	},
	{
		name: 'This Month',
		iconName: 'dark_mode',
	},
	{
		name: 'Next Month',
		iconName: 'nights_stay',
	},
	{
		name: 'Duration',
		iconName: 'timer',
	},
];

const ModalEditMatrix: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalEditMatrix']);
	const dispatch = useDispatch();

	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

	const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
	const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalEditMatrix', isOpen: false }));

	const [matrixName, setMatrixName] = useState('Urgent & Important');

	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const [selectedProject, setSelectedProject] = useState(
		topListProjects.find((project) => project.urlName === 'all')
	);
	const dropdownProjectsRef = useRef(null);

	const [isDropdownDatesVisible, setIsDropdownDatesVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState(DATES.find((date) => date.name.toLowerCase() === 'all'));
	const dropdownDatesRef = useRef(null);

	const [allPriorities, setAllPriorities] = useState(true);
	const [priorities, setPriorities] = useState({
		high: false,
		medium: false,
		low: false,
		none: false,
	});

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;

	return (
		<Modal isOpen={isOpen} onClose={closeModal} positionClasses="!items-start mt-[150px]" customClasses="my-[2px]">
			<div className="rounded-xl shadow-lg bg-color-gray-600">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">Edit Matrix</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<CustomInput
							value={matrixName}
							setValue={setMatrixName}
							customClasses="!text-left  p-[6px] px-3"
						/>

						{/* Lists */}
						<div>
							<div className="flex items-center">
								<div className="text-color-gray-100 w-[96px]">Lists</div>
								<div className="flex-1 relative">
									<div
										ref={dropdownProjectsRef}
										className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
										onClick={() => {
											setIsDropdownProjectsVisible(!isDropdownProjectsVisible);
										}}
									>
										<div>{selectedProject.name}</div>
										<Icon
											name="expand_more"
											fill={0}
											customClass={
												'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'
											}
										/>
									</div>

									<DropdownProjects
										toggleRef={dropdownProjectsRef}
										isVisible={isDropdownProjectsVisible}
										setIsVisible={setIsDropdownProjectsVisible}
										selectedProject={selectedProject}
										setSelectedProject={setSelectedProject}
										projects={projects}
										customClasses="w-full ml-[0px]"
										showSmartLists={true}
									/>
								</div>
							</div>
						</div>

						{/* Dates */}
						<div>
							<div className="flex items-center">
								<div className="text-color-gray-100 w-[96px]">Date</div>
								<div className="flex-1 relative">
									<div
										ref={dropdownDatesRef}
										className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
										onClick={() => {
											setIsDropdownDatesVisible(!isDropdownDatesVisible);
										}}
									>
										<div>{selectedDate.name}</div>
										<Icon
											name="expand_more"
											fill={0}
											customClass={
												'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'
											}
										/>
									</div>

									<DropdownDates
										toggleRef={dropdownDatesRef}
										isVisible={isDropdownDatesVisible}
										setIsVisible={setIsDropdownDatesVisible}
										selectedDate={selectedDate}
										setSelectedDate={setSelectedDate}
										customClasses="w-full ml-[0px]"
										showSmartLists={true}
									/>
								</div>
							</div>
						</div>

						<div>
							<div className="flex items-center">
								<div className="text-color-gray-100 w-[96px]">Priority</div>
								<div className="flex-1 flex items-center gap-4">
									<CustomRadioButton
										label="All"
										name="All"
										checked={allPriorities}
										onChange={() => setAllPriorities(true)}
									/>

									<CustomCheckbox
										name="High"
										values={priorities}
										setValues={setPriorities}
										allPriorities={allPriorities}
										setAllPriorities={setAllPriorities}
									/>
									<CustomCheckbox
										name="Medium"
										values={priorities}
										setValues={setPriorities}
										allPriorities={allPriorities}
										setAllPriorities={setAllPriorities}
									/>
									<CustomCheckbox
										name="Low"
										values={priorities}
										setValues={setPriorities}
										allPriorities={allPriorities}
										setAllPriorities={setAllPriorities}
									/>
									<CustomCheckbox
										name="None"
										values={priorities}
										setValues={setPriorities}
										allPriorities={allPriorities}
										setAllPriorities={setAllPriorities}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-7 flex justify-end gap-2">
						<button
							className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={closeModal}
						>
							Close
						</button>
						<button
							className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
							onClick={async () => {
								try {
									// TODO: Save Matrix Settings somewhere in the backend.
									closeModal();
								} catch (error) {
									console.log(error);
								}
							}}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

const CustomCheckbox = ({ name, values, setValues, allPriorities, setAllPriorities }) => {
	const value = name.toLowerCase();
	const isChecked = values[value];

	const handleClick = () => {
		setValues({ ...values, [value]: !isChecked });
		// If not checked, then this means, it's going to be checked and be true in the next state value
		if (allPriorities && !isChecked) {
			setAllPriorities(false);
		} else if (!allPriorities && !isChecked) {
			const everyOtherPriorityTrue = Object.entries(values).every(([key, value]) => {
				console.log(key);

				if (key === name.toLowerCase()) {
					return true;
				}

				return value;
			});

			if (everyOtherPriorityTrue) {
				setAllPriorities(true);

				const valuesClone = { ...values };
				Object.keys(values).forEach((key) => {
					valuesClone[key] = false;
				});
				setValues(valuesClone);
			}

			console.log(everyOtherPriorityTrue);
		}
	};

	return (
		<div className="flex items-center gap-2" onClick={handleClick}>
			<input type="checkbox" name={name} className="accent-blue-500" checked={isChecked} />
			{name}
		</div>
	);
};

interface DropdownDatesProps extends DropdownProps {
	selectedDate: string;
	setSelectedDate: string;
}

const DropdownDates: React.FC<DropdownDatesProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedDate,
	setSelectedDate,
}) => {
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'mt-[5px] shadow-2xl border border-color-gray-200 rounded-lg w-full'}
		>
			<div className="p-1 rounded" onClick={(e) => e.stopPropagation()}>
				<div className="overflow-auto gray-scrollbar">
					{DATES &&
						DATES.map((date) => {
							const isDateSelected = date.name == selectedDate.name;

							return (
								<div
									key={date.name}
									className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
									onClick={() => {
										setSelectedDate(date);
										setIsVisible(false);
									}}
								>
									<div className="flex items-center gap-2">
										<Icon
											name={date.iconName}
											fill={0}
											customClass={classNames(
												'!text-[18px] hover:text-white cursor-pointer',
												isDateSelected ? 'text-blue-500' : ''
											)}
										/>
										<div className={isDateSelected ? 'text-blue-500' : ''}>{date.name}</div>
									</div>
									{isDateSelected && (
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

export default ModalEditMatrix;

import classNames from 'classnames';
import Modal from './Modal';
import Icon from '../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import CustomInput from '../CustomInput';
import { useEffect, useRef, useState } from 'react';
import { DropdownProps } from '../../interfaces/interfaces';
import Dropdown from '../Dropdown/Dropdown';
import { useEditMatrixMutation, useGetProjectsQuery } from '../../services/api';
import DropdownProjects from '../Dropdown/DropdownProjects';
import { SMART_LISTS } from '../../utils/smartLists.utils';
import CustomRadioButton from '../CustomRadioButton';
import DropdownCalendar from '../Dropdown/DropdownCalendar/DropdownCalendar';

const DEFAULT_ALL_DATES = {
	all: {
		name: 'All',
		iconName: 'stacks',
		selected: true,
	},
	'no date': {
		name: 'No Date',
		iconName: 'hourglass_empty',
		selected: false,
	},
	overdue: {
		name: 'Overdue',
		iconName: 'west',
		selected: false,
	},
	repeat: {
		name: 'Repeat',
		iconName: 'repeat',
		selected: false,
	},
	today: {
		name: 'Today',
		iconName: 'calendar_today',
		selected: false,
	},
	tomorrow: {
		name: 'Tomorrow',
		iconName: 'upcoming',
		selected: false,
	},
	'this week': {
		name: 'This Week',
		iconName: 'event_upcoming',
		selected: false,
	},
	'next week': {
		name: 'Next Week',
		iconName: 'stacks',
		selected: false,
	},
	'this month': {
		name: 'This Month',
		iconName: 'dark_mode',
		selected: false,
	},
	'next month': {
		name: 'Next Month',
		iconName: 'nights_stay',
		selected: false,
	},
	duration: {
		name: 'Duration',
		iconName: 'timer',
		selected: false,
		from: null,
		to: null,
	},
};

const ModalEditMatrix: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalEditMatrix']);
	const dispatch = useDispatch();

	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

	const [editMatrix] = useEditMatrixMutation();

	const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
	const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalEditMatrix', isOpen: false }));

	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const [selectedProject, setSelectedProject] = useState(
		topListProjects.find((project) => project.urlName === 'all')
	);
	const dropdownProjectsRef = useRef(null);

	const [isDropdownDatesVisible, setIsDropdownDatesVisible] = useState(false);
	const dropdownDatesRef = useRef(null);

	const matrix = modal?.props?.matrix;
	const everyPriorityIsFalse =
		matrix?.selectedPriorities && Object.values(matrix?.selectedPriorities).every((value) => !value);

	const [name, setName] = useState(matrix?.name);
	const [allPriorities, setAllPriorities] = useState(everyPriorityIsFalse);
	const [selectedPriorities, setSelectedPriorities] = useState({
		high: matrix?.selectedPriorities?.high,
		medium: matrix?.selectedPriorities?.medium,
		low: matrix?.selectedPriorities?.low,
		none: matrix?.selectedPriorities?.none,
	});
	const [allDates, setAllDates] = useState(DEFAULT_ALL_DATES);

	if (!modal) {
		return null;
	}

	const { isOpen } = modal;

	useEffect(() => {
		if (matrix) {
			// TODO: FIX!
			const { name, selectedPriorities, selectedDates } = matrix;
			setName(name);
			setSelectedPriorities(selectedPriorities);
			// setSelectedDates(selectedDates);
		}
	}, [matrix]);

	if (!projects) {
		return null;
	}

	const selectedDatesNames = Object.values(allDates)
		.reduce((accumulator, current) => {
			if (current.selected) {
				accumulator.push(current.name);
			}
			return accumulator;
		}, [])
		.join(', ');

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
						<CustomInput value={name} setValue={setName} customClasses="!text-left  p-[6px] px-3" />

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
										<div className="max-w-[300px] truncate">{selectedDatesNames}</div>
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
										allDates={allDates}
										setAllDates={setAllDates}
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
										customOuterCircleClasses="!border-blue-500"
										customInnerCircleClasses="!bg-blue-500"
									/>

									<CustomCheckbox
										name="High"
										values={selectedPriorities}
										setValues={setSelectedPriorities}
										allPriorities={allPriorities}
										setAllPriorities={setAllPriorities}
									/>
									<CustomCheckbox
										name="Medium"
										values={selectedPriorities}
										setValues={setSelectedPriorities}
										allPriorities={allPriorities}
										setAllPriorities={setAllPriorities}
									/>
									<CustomCheckbox
										name="Low"
										values={selectedPriorities}
										setValues={setSelectedPriorities}
										allPriorities={allPriorities}
										setAllPriorities={setAllPriorities}
									/>
									<CustomCheckbox
										name="None"
										values={selectedPriorities}
										setValues={setSelectedPriorities}
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
									await editMatrix({
										matrixId: matrix._id,
										payload: {
											name,
											// selectedDates,
											// selectedPriorities
											// selectedProjects
										},
									});
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
		const willBeChecked = !isChecked;
		setValues({ ...values, [value]: willBeChecked });

		// If not checked, then this means, it's going to be checked and be true in the next state value
		if (allPriorities && willBeChecked) {
			setAllPriorities(false);
		} else if (!allPriorities && willBeChecked) {
			const everyOtherPriorityTrue = Object.entries(values).every(([key, value]) => {
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
		} else if (!willBeChecked) {
			const everyOtherPriorityFalse = Object.entries(values).every(([key, value]) => {
				if (key === name.toLowerCase()) {
					return true;
				}

				return !value;
			});

			if (everyOtherPriorityFalse) {
				setAllPriorities(true);
			}
		}
	};

	return (
		<div className="flex items-center gap-2" onClick={handleClick}>
			<input type="checkbox" name={name} className="accent-blue-500" checked={isChecked} onChange={() => null} />
			{name}
		</div>
	);
};

interface DropdownDatesProps extends DropdownProps {
	selectedDate: string;
	setSelectedDate: string;
}

const DropdownDates: React.FC<DropdownDatesProps> = ({ toggleRef, isVisible, setIsVisible, allDates, setAllDates }) => {
	const [localAllDates, setLocalAllDates] = useState(allDates);

	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [isDropdownFromDateVisible, setIsDropdownFromDateVisible] = useState(false);
	const [isDropdownToDateVisible, setIsDropdownToDateVisible] = useState(false);

	const dropdownFromDateRef = useRef();
	const dropdownToDateRef = useRef();

	console.log(fromDate);

	const Duration = () => {
		return (
			<div className="flex-1 space-y-2 w-full">
				<DurationOption
					dropdownDateRef={dropdownFromDateRef}
					isDropdownDateVisible={isDropdownFromDateVisible}
					setIsDropdownDateVisible={setIsDropdownFromDateVisible}
					date={fromDate}
					setDate={setFromDate}
					dropdownCustomClasses=" !ml-[100px] mt-[-100px]"
				/>

				<DurationOption
					dropdownDateRef={dropdownToDateRef}
					isDropdownDateVisible={isDropdownToDateVisible}
					setIsDropdownDateVisible={setIsDropdownToDateVisible}
					date={toDate}
					setDate={setToDate}
					dropdownCustomClasses=" !ml-[100px] mt-[-60px]"
				/>
			</div>
		);
	};

	const DurationOption = ({
		dropdownDateRef,
		isDropdownDateVisible,
		setIsDropdownDateVisible,
		date,
		setDate,
		dropdownCustomClasses,
	}) => (
		<div className="flex-1 w-full" onClick={(e) => e.stopPropagation()}>
			<div
				ref={dropdownDateRef}
				className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
				onClick={(e) => {
					e.stopPropagation();
					setIsDropdownDateVisible(!isDropdownDateVisible);
				}}
			>
				<div className="max-w-[300px] truncate text-[12px]">
					{date
						? date.toLocaleString('en-US', {
								year: 'numeric', // Full year
								month: 'long', // Full month name
								day: 'numeric', // Day of the month
								hour: 'numeric', // Hour (in 12-hour AM/PM format)
								minute: '2-digit', // Minute with leading zeros
								hour12: true, // Use AM/PM
							})
						: 'No Date'}
				</div>
				<Icon
					name="expand_more"
					fill={0}
					customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
				/>
			</div>

			<DropdownCalendar
				toggleRef={dropdownDateRef}
				isVisible={isDropdownDateVisible}
				setIsVisible={setIsDropdownDateVisible}
				currDueDate={date}
				setCurrDueDate={setDate}
				customClasses={dropdownCustomClasses}
			/>
		</div>
	);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'mt-[5px] shadow-2xl border border-color-gray-200 rounded-lg w-full'}
		>
			<div className="rounded" onClick={(e) => e.stopPropagation()}>
				<div
					className={classNames(
						'p-1 gray-scrollbar max-h-[200px]',
						!isDropdownFromDateVisible && !isDropdownToDateVisible ? 'overflow-auto' : 'overflow-hidden'
					)}
				>
					{localAllDates &&
						Object.entries(localAllDates).map(([key, value]) => {
							const isDateSelected = value.selected;

							return (
								<div
									key={value.name}
									className="flex items-center justify-between gap-2 hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
									onClick={() => {
										setLocalAllDates({
											...localAllDates,
											[key]: { ...value, selected: !localAllDates[key].selected },
										});
									}}
								>
									<div className="flex-1 flex items-center gap-2">
										<Icon
											name={value.iconName}
											fill={0}
											customClass={classNames(
												'!text-[18px] hover:text-white cursor-pointer',
												isDateSelected ? 'text-blue-500' : ''
											)}
										/>
										<div className={isDateSelected ? 'text-blue-500' : ''}>{value.name}</div>
										{key === 'duration' && <Duration />}
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

				<div className="p-3 border-t border-color-gray-200 flex gap-2">
					<button
						className="flex-1 border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
						onClick={() => setIsVisible(false)}
					>
						Cancel
					</button>
					<button
						className="flex-1 bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
						onClick={() => {
							setAllDates(localAllDates);
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

export default ModalEditMatrix;

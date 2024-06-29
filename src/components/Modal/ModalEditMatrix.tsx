import classNames from 'classnames';
import Modal from './Modal';
import Icon from '../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import CustomInput from '../CustomInput';
import { useEffect, useRef, useState } from 'react';
import { useEditMatrixMutation, useGetProjectsQuery } from '../../services/api';
import { SMART_LISTS } from '../../utils/smartLists.utils';
import CustomRadioButton from '../CustomRadioButton';
import DropdownDates from '../Dropdown/DropdownDates';
import DropdownItemsWithSearch from '../Dropdown/DropdownItemsWithSearch';

const ModalEditMatrix: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalEditMatrix']);
	const dispatch = useDispatch();

	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	const [editMatrix] = useEditMatrixMutation();

	const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
	const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);
	const allProject = topListProjects.find((project) => project.urlName === 'all');

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalEditMatrix', isOpen: false }));

	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const [selectedProjectsList, setSelectedProjectsList] = useState([allProject]);
	const dropdownProjectsRef = useRef(null);

	const [isDropdownDatesVisible, setIsDropdownDatesVisible] = useState(false);
	const dropdownDatesRef = useRef(null);

	const matrix = modal?.props?.matrix;

	const [name, setName] = useState(matrix?.name);
	const [allPriorities, setAllPriorities] = useState(false);
	const [selectedPriorities, setSelectedPriorities] = useState({
		high: matrix?.selectedPriorities?.high,
		medium: matrix?.selectedPriorities?.medium,
		low: matrix?.selectedPriorities?.low,
		none: matrix?.selectedPriorities?.none,
	});
	const [dateOptions, setDateOptions] = useState(matrix?.dateOptions);

	if (!modal) {
		return null;
	}

	const { isOpen } = modal;

	useEffect(() => {
		if (matrix) {
			// TODO: FIX!
			const { name, selectedPriorities, selectedProjectIds, dateOptions } = matrix;
			setName(name);
			setSelectedPriorities(selectedPriorities);
			setDateOptions(dateOptions);

			const everyPriorityIsFalse =
				selectedPriorities && Object.values(selectedPriorities).every((value) => !value);
			setAllPriorities(everyPriorityIsFalse);

			if (selectedProjectIds.length === 0) {
				setSelectedProjectsList([allProject]);
			} else {
				setSelectedProjectsList(selectedProjectIds.map((projectId) => projectsById[projectId]));
			}
		}
	}, [matrix]);

	if (!projects) {
		return null;
	}

	const selectedDatesNames =
		dateOptions &&
		Object.values(dateOptions)
			.reduce((accumulator, current) => {
				if (current.selected) {
					accumulator.push(current.name);
				}
				return accumulator;
			}, [])
			.join(', ');

	const selectedProjectNames =
		dateOptions &&
		selectedProjectsList
			.reduce((accumulator, current) => {
				accumulator.push(current.name);
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
										<div>{selectedProjectNames}</div>
										<Icon
											name="expand_more"
											fill={0}
											customClass={
												'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'
											}
										/>
									</div>

									<DropdownItemsWithSearch
										toggleRef={dropdownProjectsRef}
										isVisible={isDropdownProjectsVisible}
										setIsVisible={setIsDropdownProjectsVisible}
										selectedItemList={selectedProjectsList}
										setSelectedItemList={setSelectedProjectsList}
										items={projects}
										customClasses="w-full ml-[0px]"
										multiSelect={true}
										type="project"
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
										dateOptions={dateOptions}
										setDateOptions={setDateOptions}
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
										onChange={() => {
											setAllPriorities(true);

											const selectedPrioritiesClone = { ...selectedPriorities };
											Object.keys(selectedPriorities).forEach((key) => {
												selectedPrioritiesClone[key] = false;
											});
											setSelectedPriorities(selectedPrioritiesClone);
										}}
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
									// TODO: Add other properties (priorities and projects) to the payload.
									const selectedProjectIds = selectedProjectsList.flatMap((project) => {
										if (project._id) {
											return project._id;
										}

										return [];
									});

									const payload = {
										matrixId: matrix._id,
										payload: {
											name,
											dateOptions,
											selectedProjectIds,
											selectedPriorities,
										},
									};

									await editMatrix(payload);
									closeModal();
								} catch (error) {
									console.error(error);
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

export default ModalEditMatrix;

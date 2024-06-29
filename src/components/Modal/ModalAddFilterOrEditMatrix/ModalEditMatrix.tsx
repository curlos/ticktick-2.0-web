import classNames from 'classnames';
import Modal from '../Modal';
import Icon from '../../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../../slices/modalSlice';
import CustomInput from '../../CustomInput';
import { useEffect, useState } from 'react';
import { useEditMatrixMutation, useGetProjectsQuery } from '../../../services/api';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import ProjectMultiSelectSection from './ProjectMutliSelectSection';
import DateMultiSelectSection from './DateMultiSelectSection';
import PriorityMultiSelectSection from './PriorityMultiSelectSection';

const ModalEditMatrix: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalEditMatrix']);
	const dispatch = useDispatch();

	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const [editMatrix] = useEditMatrixMutation();

	const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
	const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);
	const allProject = topListProjects.find((project) => project.urlName === 'all');

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalEditMatrix', isOpen: false }));

	const [selectedProjectsList, setSelectedProjectsList] = useState([allProject]);

	const matrix = modal?.props?.matrix;

	const [name, setName] = useState('');
	const [allPriorities, setAllPriorities] = useState(false);
	const [selectedPriorities, setSelectedPriorities] = useState({
		high: false,
		medium: false,
		low: false,
		none: false,
	});
	const [dateOptions, setDateOptions] = useState(null);

	if (!modal) {
		return null;
	}

	const { isOpen } = modal;

	useEffect(() => {
		if (matrix) {
			// TODO: FIX!
			updateInitialData();
		}
	}, [matrix]);

	const updateInitialData = () => {
		const { name, selectedPriorities, selectedProjectIds, dateOptions } = matrix;
		setName(name);
		setSelectedPriorities(selectedPriorities);
		setDateOptions(dateOptions);

		const everyPriorityIsFalse = selectedPriorities && Object.values(selectedPriorities).every((value) => !value);
		setAllPriorities(everyPriorityIsFalse);

		if (selectedProjectIds.length === 0) {
			setSelectedProjectsList([allProject]);
		} else {
			setSelectedProjectsList(selectedProjectIds.map((projectId) => projectsById[projectId]));
		}
	};

	if (!matrix || !dateOptions) {
		return null;
	}

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
						<ProjectMultiSelectSection
							selectedProjectsList={selectedProjectsList}
							setSelectedProjectsList={setSelectedProjectsList}
						/>

						{/* Dates */}
						<DateMultiSelectSection dateOptions={dateOptions} setDateOptions={setDateOptions} />

						{/* Priority */}
						<PriorityMultiSelectSection
							allPriorities={allPriorities}
							setAllPriorities={setAllPriorities}
							selectedPriorities={selectedPriorities}
							setSelectedPriorities={setSelectedPriorities}
						/>
					</div>

					{/* Close and Save buttons */}
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

export default ModalEditMatrix;

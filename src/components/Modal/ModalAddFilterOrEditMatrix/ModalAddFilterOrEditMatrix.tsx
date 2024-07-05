import classNames from 'classnames';
import Modal from '../Modal';
import Icon from '../../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../../slices/modalSlice';
import CustomInput from '../../CustomInput';
import { useEffect, useState } from 'react';
import { useAddFilterMutation, useEditFilterMutation, useEditMatrixMutation } from '../../../services/api';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import ProjectMultiSelectSection from './ProjectMutliSelectSection';
import DateMultiSelectSection from './DateMultiSelectSection';
import PriorityMultiSelectSection from './PriorityMultiSelectSection';
import TagMultiSelectSection from './TagMultiSelectSection';
import { DEFAULT_DATE_OPTIONS } from './DefaultDateOptions';
import useHandleError from '../../../hooks/useHandleError';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import { useGetTagsQuery } from '../../../services/resources/tagsApi';

const ModalAddFilterOrEditMatrix: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddFilterOrEditMatrix']);
	const dispatch = useDispatch();
	const handleError = useHandleError();

	const modalType = modal?.props?.type;

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsById } = fetchedTags || {};

	const [editMatrix] = useEditMatrixMutation();

	const [addFilter] = useAddFilterMutation();
	const [editFilter] = useEditFilterMutation();

	// Projects
	const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
	const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);
	const allProject = topListProjects.find((project) => project.urlName === 'all');

	// Tags
	const allTag = { name: 'All' };

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddFilterOrEditMatrix', isOpen: false }));
	};

	const [selectedProjectsList, setSelectedProjectsList] = useState([allProject]);
	const [selectedTagList, setSelectedTagList] = useState([allTag]);

	const [name, setName] = useState('');
	const [allPriorities, setAllPriorities] = useState(false);
	const [selectedPriorities, setSelectedPriorities] = useState({
		high: false,
		medium: false,
		low: false,
		none: false,
	});
	const [dateOptions, setDateOptions] = useState(DEFAULT_DATE_OPTIONS);

	if (!modal) {
		return null;
	}

	const {
		isOpen,
		props: { item },
	} = modal;

	useEffect(() => {
		if (item) {
			// TODO: FIX!
			updateInitialData();
		} else {
			resetData();
		}
	}, [item]);

	const updateInitialData = () => {
		const { name, selectedProjectIds, selectedTagIds, selectedPriorities, dateOptions } = item;
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

		if (selectedTagIds.length === 0) {
			setSelectedTagList([allTag]);
		} else {
			const newSelectedTagList = selectedTagIds.map((tagId) => tagsById[tagId]);
			setSelectedTagList(newSelectedTagList);
		}
	};

	const resetData = () => {
		setName('');
		setSelectedPriorities({
			high: false,
			medium: false,
			low: false,
			none: false,
		});
		setDateOptions(DEFAULT_DATE_OPTIONS);
		setAllPriorities(false);
		setSelectedProjectsList([allProject]);
		setSelectedTagList([allTag]);
	};

	if (!dateOptions) {
		return null;
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={closeModal}
			positionClasses="!items-start mt-[150px]"
			customClasses="my-[2px] w-[600px]"
		>
			<div className="rounded-xl shadow-lg bg-color-gray-600">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">
							{modalType === 'matrix' ? 'Edit Matrix' : item ? 'Edit Filter' : 'Add Filter'}
						</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<CustomInput
							value={name}
							placeholder="Name"
							setValue={setName}
							customClasses="!text-left  p-[6px] px-3"
						/>

						{/* Lists */}
						<ProjectMultiSelectSection
							selectedProjectsList={selectedProjectsList}
							setSelectedProjectsList={setSelectedProjectsList}
						/>

						{/* Tags */}
						<TagMultiSelectSection
							selectedTagList={selectedTagList}
							setSelectedTagList={setSelectedTagList}
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

									const selectedTagIds = selectedTagList.flatMap((tag) => {
										if (tag._id) {
											return tag._id;
										}

										return [];
									});

									if (modalType === 'matrix') {
										const payload = {
											matrixId: item._id,
											payload: {
												name,
												dateOptions,
												selectedProjectIds,
												selectedPriorities,
												selectedTagIds,
											},
										};

										await editMatrix(payload);
									} else {
										// TODO: Edit or add filter
										const payload = {
											name,
											dateOptions,
											selectedProjectIds,
											selectedPriorities,
											selectedTagIds,
										};

										handleError(async () => {
											if (item) {
												await editFilter({
													filterId: item._id,
													payload,
												}).unwrap();
											} else {
												await addFilter(payload).unwrap();
											}

											closeModal();
										});
									}
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

export default ModalAddFilterOrEditMatrix;

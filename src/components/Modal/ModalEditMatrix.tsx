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

const ModalEditMatrix: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalEditMatrix']);
	const dispatch = useDispatch();

	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

	const TOP_LIST_NAMES = ['all', 'today', 'tomorrow', 'week'];
	const topListProjects = TOP_LIST_NAMES.map((name) => SMART_LISTS[name]);

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalEditMatrix', isOpen: false }));

	const [matrixName, setMatrixName] = useState('Urgent & Important');

	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const [selectedProject, setSelectedProject] = useState(
		topListProjects.find((project) => project.urlName === 'all')
	);
	const dropdownProjectsRef = useRef(null);

	console.log(selectedProject);

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

						<div>
							<div className="flex items-center">
								<div className="text-color-gray-100 w-[96px]">Date</div>
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
	const dates = [
		{
			name: 'All',
			iconName: 'stacks',
		},
		{
			name: 'No Date',
			iconName: 'stacks',
		},
		{
			name: 'Overdue',
			iconName: 'stacks',
		},
		{
			name: 'Repeat',
			iconName: 'stacks',
		},
		{
			name: 'Today',
			iconName: 'stacks',
		},
		{
			name: 'Tomorrow',
			iconName: 'stacks',
		},
		{
			name: 'This Week',
			iconName: 'stacks',
		},
		{
			name: 'Next Week',
			iconName: 'stacks',
		},
		{
			name: 'This Month',
			iconName: 'stacks',
		},
		{
			name: 'Next Month',
			iconName: 'stacks',
		},
		{
			name: 'Duration',
			iconName: 'stacks',
		},
	];

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'mt-[5px] shadow-2xl border border-color-gray-200 rounded-lg'}
		>
			<div className="w-[232px] p-1 rounded" onClick={(e) => e.stopPropagation()}>
				<div className="overflow-auto gray-scrollbar">
					{folders &&
						[noneFolder, ...folders].map((folder) => {
							const isFolderSelected = selectedFolder._id == folder._id;

							return (
								<div
									key={folder._id}
									className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
									onClick={() => {
										setSelectedDate(folder);
										setIsVisible(false);
									}}
								>
									<div className={isFolderSelected ? 'text-blue-500' : ''}>{folder.name}</div>
									{isFolderSelected && (
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

				<div
					className="flex items-center gap-1 mt-2 hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
					onClick={() => {
						setIsModalNewProjectOpen(true);
						setIsVisible(false);
					}}
				>
					<Icon
						name="add"
						fill={0}
						customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
					/>
					<div>New Folder</div>
				</div>
			</div>
		</Dropdown>
	);
};

export default ModalEditMatrix;

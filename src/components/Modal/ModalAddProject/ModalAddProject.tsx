import Modal from '../Modal';
import Icon from '../../Icon';
import { useEffect, useRef, useState } from 'react';
import Dropdown from '../../Dropdown/Dropdown';
import { DropdownProps, IProject } from '../../../interfaces/interfaces';
import { fetchData } from '../../../utils/helpers.utils';
import { useAddProjectMutation, useEditProjectMutation } from '../../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../../slices/modalSlice';
import { useNavigate } from 'react-router';
import ColorPicker from '../../ColorPicker';
import ModalNewFolder from './ModalNewFolder';

const ModalAddProject: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddProject']);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [addProject, { isLoading: isLoadingAddProject, error: errorAddProject }] = useAddProjectMutation(); // Mutation hook
	const [editProject, { isLoading: isLoadingEditProject, error: errorEditProject }] = useEditProjectMutation();

	const [name, setName] = useState(modal?.props?.project?.name || '');
	const [listColor, setListColor] = useState(modal?.props?.project?.color || '');
	const [selectedView, setSelectedView] = useState('list');
	const [selectedFolder, setSelectedFolder] = useState<IProject | Object>({ name: 'None' });
	const [isDropdownFolderVisible, setIsDropdownFolderVisible] = useState(false);
	const [isModalNewFolderOpen, setIsModalNewFolderOpen] = useState(false);

	const DEFAULT_COLORS = ['#ff6161', '#FFAC37', '#FFD323', '#E6EA48', '#33D870', '#4BA1FF', '#6D75F4'];
	const DEFAULT_COLORS_LOWERCASE = DEFAULT_COLORS.map((color) => color.toLowerCase());

	const isEditingList = modal?.props?.project ? true : false;

	useEffect(() => {
		if (modal?.props?.project) {
			const { project } = modal.props;
			setName(project.name);
			setListColor(project.color);
		} else {
			setName('');
			setListColor('');
		}
	}, [modal?.props?.project]);

	const views = [
		{
			type: 'list',
			iconName: 'list',
		},
		// {
		//     type: 'kanban',
		//     iconName: 'view_kanban'
		// },
		// {
		//     type: 'timeline',
		//     iconName: 'timeline'
		// },
	];

	// TODO: Setup backend to add lists. Should take all the properties in an object: name, color, view, and folder.
	const handleAddProject = async () => {
		if (name.trim() === '') {
			return;
		}

		const newProject = {
			name: name,
			isFolder: false,
			color: listColor,
		};

		try {
			let projectId = null;

			if (isEditingList) {
				const {
					data: { _id },
				} = await editProject({ projectId: modal.props.project._id, payload: newProject });
				projectId = _id;
			} else {
				const {
					data: { _id },
				} = await addProject(newProject);
				projectId = _id;
			}
			closeModal();
			navigate(`/projects/${projectId}/tasks`);
		} catch (error) {
			console.error(error);
		}
	};

	const [isNameInputFocused, setIsNameInputFocused] = useState(false);

	const dropdownFolderRef = useRef(null);

	if (!modal) {
		return null;
	}

	const { isOpen } = modal;

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddProject', isOpen: false }));
	};

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center" customClasses="!w-[400px]">
			<div className="bg-color-gray-650 rounded-lg shadow-lg py-4 px-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-[16px]">{isEditingList ? 'Edit List' : 'Add List'}</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={closeModal}
					/>
				</div>

				{/* Name */}
				<div
					className={`border border-[#4c4c4c] rounded-md flex items-center ${isNameInputFocused ? 'border-blue-500' : ''}`}
				>
					<Icon name="menu" customClass="!text-[16px] text-color-gray-100 hover:text-white p-[6px]" />
					<div className="border-l border-[#4c4c4c] p-[6px] flex-1">
						<input
							value={name}
							placeholder="Name"
							className="placeholder-color-gray-100 outline-none bg-transparent w-full"
							onChange={(e) => setName(e.target.value)}
							onFocus={() => setIsNameInputFocused(true)}
							onBlur={() => setIsNameInputFocused(false)}
						/>
					</div>
				</div>

				{/* Color */}
				<div className="space-y-4 mt-3">
					<div className="flex items-center">
						<div className="text-color-gray-100 w-[96px]">Color</div>
						<div className="flex items-center gap-1">
							<div
								className={
									'border-[2px] rounded-full p-[2px] cursor-pointer' +
									(listColor === '' ? ' border-blue-500' : ' border-transparent')
								}
								onClick={() => setListColor('')}
							>
								<div className="circle-with-line" />
							</div>

							{DEFAULT_COLORS_LOWERCASE.map((color) => (
								<div
									key={color}
									className={'border-[2px] rounded-full p-[2px]'}
									style={{ borderColor: listColor === color ? color : 'transparent' }}
									onClick={() => setListColor(color)}
								>
									<div
										className={`h-[14px] w-[14px] rounded-full cursor-pointer`}
										style={{ backgroundColor: color }}
									/>
								</div>
							))}

							<ColorPicker color={listColor} setColor={setListColor} />
						</div>
					</div>

					{/* View */}
					<div className="flex items-center">
						<div className="text-color-gray-100 w-[96px]">View</div>
						<div className="flex items-center gap-1">
							{views.map((view) => (
								<span key={view.iconName}>
									<Icon
										name={view.iconName}
										customClass={
											'!text-[22px] px-3 py-1 text-color-gray-100 bg-color-gray-300 rounded-md cursor-pointer border border-transparent' +
											(selectedView === view.type ? ' !border-blue-500 !text-blue-500' : '')
										}
										onClick={() => setSelectedView(view.type)}
									/>
								</span>
							))}
						</div>
					</div>

					{/* Folder */}
					<div className="flex items-center">
						<div className="text-color-gray-100 w-[96px]">Folder</div>
						<div className="flex-1 relative">
							<div
								ref={dropdownFolderRef}
								className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
								onClick={() => {
									setIsDropdownFolderVisible(!isDropdownFolderVisible);
								}}
							>
								<div>{selectedFolder.name}</div>
								<Icon
									name="expand_more"
									fill={0}
									customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
								/>
							</div>

							<DropdownFolder
								toggleRef={dropdownFolderRef}
								isVisible={isDropdownFolderVisible}
								setIsVisible={setIsDropdownFolderVisible}
								selectedFolder={selectedFolder}
								setSelectedFolder={setSelectedFolder}
								isModalNewFolderOpen={isModalNewFolderOpen}
								setIsModalNewFolderOpen={setIsModalNewFolderOpen}
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2 mt-5">
					<button
						className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
						onClick={closeModal}
					>
						Close
					</button>
					<button
						className={
							'bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600 min-w-[114px]' +
							(!name ? ' opacity-50' : '')
						}
						onClick={handleAddProject}
					>
						{isEditingList ? 'Edit' : 'Save'}
					</button>
				</div>
			</div>

			<ModalNewFolder isModalOpen={isModalNewFolderOpen} setIsModalOpen={setIsModalNewFolderOpen} />
		</Modal>
	);
};

interface DropdownFolderProps extends DropdownProps {
	selectedFolder: IProject | Object;
	setSelectedFolder: React.Dispatch<React.SetStateAction<IProject | Object>>;
	isModalNewFolderOpen: boolean;
	setIsModalNewFolderOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownFolder: React.FC<DropdownFolderProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedFolder,
	setSelectedFolder,
	setIsModalNewFolderOpen,
}) => {
	const [folders, setFolders] = useState<Array<IProject>>([]);

	useEffect(() => {
		const getData = async () => {
			const folders = await fetchData(`${import.meta.env.VITE_SERVER_URL}/projects?isFolder=true`);
			setFolders(folders);
		};

		getData();
	}, []);

	const foldersArray = ['None', 'GreatFrontEnd', 'Hobbies & Interests', 'Tech Interview Prep'];

	const noneFolder = {
		_id: null,
		name: 'None',
	};

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
										setSelectedFolder(folder);
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
						setIsModalNewFolderOpen(true);
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

export default ModalAddProject;

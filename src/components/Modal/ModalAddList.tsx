import Modal from './Modal';
import Icon from '../Icon';
import { useEffect, useRef, useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import { DropdownProps, IProject } from '../../interfaces/interfaces';
import { fetchData } from '../../utils/helpers.utils';
import { useAddProjectMutation } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';

const ModalAddList: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddList']);
	const dispatch = useDispatch();

	const [name, setName] = useState('');
	const [listColor, setListColor] = useState('');
	const [selectedView, setSelectedView] = useState('list');
	const [selectedFolder, setSelectedFolder] = useState<IProject | Object>({ name: 'None' });
	const [isDropdownFolderVisible, setIsDropdownFolderVisible] = useState(false);
	const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

	const DEFAULT_COLORS = ['#ff6161', '#FFAC37', '#FFD323', '#E6EA48', '#33D870', '#4BA1FF', '#6D75F4'];
	const DEFAULT_COLORS_LOWERCASE = DEFAULT_COLORS.map((color) => color.toLowerCase());

	interface ColorPickerProps {
		color: string;
		setColor: React.Dispatch<React.SetStateAction<string>>;
	}

	// TODO: I'm using the default HTML color picker but not sure if I want to stick with it. I don't think this is a big deal or anything so this'll probably be one of the last things I do but it should be looked at in the future. It's purely a frontend issue to resolve though, no backend involved.
	const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
		return (
			<div className="color-picker-wrapper">
				<input
					type="color"
					id="color-picker"
					name="color"
					value={color}
					onChange={(e) => setColor(e.target.value)}
				/>
			</div>
		);
	};

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
	const handleAddList = () => {
		return;
	};

	const [isNameInputFocused, setIsNameInputFocused] = useState(false);

	const dropdownFolderRef = useRef(null);

	if (!modal) {
		return null;
	}

	const { isOpen } = modal;

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddList', isOpen: false }));
	};

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center" customClasses="!w-[400px]">
			<div className="bg-color-gray-650 rounded-lg shadow-lg py-4 px-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-[16px]">Add List</h3>
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
								<Icon
									key={view}
									name={view.iconName}
									customClass={
										'!text-[22px] px-3 py-1 text-color-gray-100 bg-color-gray-300 rounded-md cursor-pointer border border-transparent' +
										(selectedView === view.type ? ' !border-blue-500 !text-blue-500' : '')
									}
									onClick={() => setSelectedView(view.type)}
								/>
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
								isModalNewProjectOpen={isModalNewProjectOpen}
								setIsModalNewProjectOpen={setIsModalNewProjectOpen}
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
						onClick={() => {
							closeModal();
							handleAddList();
						}}
					>
						Save
					</button>
				</div>
			</div>

			<ModalNewProject isModalOpen={isModalNewProjectOpen} setIsModalOpen={setIsModalNewProjectOpen} />
		</Modal>
	);
};

interface DropdownFolderProps extends DropdownProps {
	selectedFolder: IProject | Object;
	setSelectedFolder: React.Dispatch<React.SetStateAction<IProject | Object>>;
	isModalNewProjectOpen: boolean;
	setIsModalNewProjectOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownFolder: React.FC<DropdownFolderProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedFolder,
	setSelectedFolder,
	setIsModalNewProjectOpen,
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
			customClasses={' mt-[5px] shadow-2xl border border-color-gray-200 rounded-lg'}
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

interface ModalNewProjectProps {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalNewProject: React.FC<ModalNewProjectProps> = ({ isModalOpen, setIsModalOpen }) => {
	const dispatch = useDispatch();
	const [addProject, { isLoading, error }] = useAddProjectMutation(); // Mutation hook
	const [folderName, setFolderName] = useState('');
	const [isFolderNameInputFocused, setIsFolderNameInputFocused] = useState(false);

	// TODO: Setup backend to add new folders
	const handleCreateNewFolder = async () => {
		if (folderName.trim() === '') {
			return;
		}

		const newProject = {
			name: folderName,
			isFolder: true,
		};

		try {
			await addProject(newProject);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={() => setIsModalOpen(false)}
			position="top-center"
			customClasses="!w-[400px]"
		>
			<div className="bg-color-gray-650 rounded-lg shadow-lg py-4 px-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-[16px]">New Folder</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={() => setIsModalOpen(false)}
					/>
				</div>

				<div
					className={
						`border border-[#4c4c4c] rounded-md focus:outline-blue-500 flex items-center` +
						(isFolderNameInputFocused ? ' border-blue-500' : '')
					}
				>
					<Icon
						name="folder_open"
						customClass={'!text-[16px] text-color-gray-100 hover:text-white p-[6px]'}
					/>

					<div className="p-[6px] flex-1">
						<input
							placeholder="Name"
							value={folderName}
							onChange={(e) => setFolderName(e.target.value)}
							onFocus={() => setIsFolderNameInputFocused(true)}
							onBlur={() => setIsFolderNameInputFocused(false)}
							className="placeholder-color-gray-100 outline-none bg-transparent w-full"
						/>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2 mt-5">
					<button
						className="border border-color-gray-200 rounded py-[2px] cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
						onClick={() => {
							setIsModalOpen(false);
						}}
					>
						Close
					</button>
					<button
						className={
							'bg-blue-500 rounded py-[2px] cursor-pointer hover:bg-blue-600 min-w-[114px]' +
							(!folderName ? ' opacity-50' : '')
						}
						onClick={() => {
							setIsModalOpen(false);
							handleCreateNewFolder();
						}}
					>
						Save
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAddList;

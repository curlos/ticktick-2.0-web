import { useState } from 'react';
import Icon from '../../Icon';
import Modal from '../Modal';
import { useAddProjectMutation } from '../../../services/resources/projectsApi';

interface ModalNewFolderProps {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalNewFolder: React.FC<ModalNewFolderProps> = ({ isModalOpen, setIsModalOpen }) => {
	const [addProject, { isLoading, error }] = useAddProjectMutation(); // Mutation hook
	const [folderName, setFolderName] = useState('');
	const [isFolderNameInputFocused, setIsFolderNameInputFocused] = useState(false);

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

export default ModalNewFolder;

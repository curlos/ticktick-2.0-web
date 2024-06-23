import { useState, useEffect } from 'react';
import { DropdownProps, IProject } from '../../../interfaces/interfaces';
import { fetchData } from '../../../utils/helpers.utils';
import Icon from '../../Icon';
import Dropdown from '../../Dropdown/Dropdown';

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

export default DropdownFolder;

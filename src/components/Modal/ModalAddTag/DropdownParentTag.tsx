import { useState, useEffect } from 'react';
import { DropdownProps, IProject } from '../../../interfaces/interfaces';
import { fetchData } from '../../../utils/helpers.utils';
import Icon from '../../Icon';
import Dropdown from '../../Dropdown/Dropdown';

interface DropdownFolderProps extends DropdownProps {
	selectedParentTag: IProject | Object;
	setSelectedParentTag: React.Dispatch<React.SetStateAction<IProject | Object>>;
}

const DropdownParentTag: React.FC<DropdownFolderProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedParentTag,
	setSelectedParentTag,
}) => {
	const [parentTags, setParentTags] = useState<Array<IProject>>([]);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const foundParentTags = await fetchData(`${import.meta.env.VITE_SERVER_URL}/projects?isFolder=true`);
		setParentTags(foundParentTags);
	};

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
					{parentTags &&
						[noneFolder, ...parentTags].map((folder) => {
							const isSelected = selectedParentTag?._id == folder?._id;

							return (
								<div
									key={folder._id}
									className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
									onClick={() => {
										setSelectedParentTag(folder);
										setIsVisible(false);
									}}
								>
									<div className={isSelected ? 'text-blue-500' : ''}>{folder.name}</div>
									{isSelected && (
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

export default DropdownParentTag;

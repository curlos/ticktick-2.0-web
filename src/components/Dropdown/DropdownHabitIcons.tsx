import Dropdown from './Dropdown';
import Icon from '../Icon';
import { DropdownProps, TaskObj } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { useState } from 'react';
import { HADES_KEEPSAKE_ICON_URLS } from '../../utils/hadesIcons/keepsake';
import { HADES_ITEM_ICONS } from '../../utils/hadesIcons/items';
import { HADES_FISH_ICON_URLS } from '../../utils/hadesIcons/fish';
import { HADES_CONTRACTOR_ICONS } from '../../utils/hadesIcons/contractor';

interface DropdownHabitIconsProps extends DropdownProps {
	priority: number;
	setPriority: React.Dispatch<React.SetStateAction<number>>;
	customClasses: string;
	selectedIcon: string;
	setSelectedIcon: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownHabitIcons: React.FC<DropdownHabitIconsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	priority: selectedPriority,
	setPriority,
	customClasses,
	selectedIcon,
	setSelectedIcon,
}) => {
	const [localSelectedIcon, setLocalSelectedIcon] = useState(selectedIcon);
	const [selectedIconSection, setSelectedIconSection] = useState('Keepsake');
	const [selectedIconList, setSelectedIconList] = useState(HADES_KEEPSAKE_ICON_URLS);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg ml-[-10px]', customClasses)}
		>
			<div className="w-[450px] p-3">
				<div className="grid grid-cols-4 gap-3 mb-2">
					{['Items', 'Keepsake', 'Fish', 'Contractor'].map((name) => (
						<TopButton
							name={name}
							selectedIconSection={selectedIconSection}
							setSelectedIconSection={setSelectedIconSection}
							setSelectedIconList={setSelectedIconList}
						/>
					))}
				</div>
				<div className="grid grid-cols-6 gap-2 overflow-auto gray-scrollbar max-h-[200px] pb-2">
					{selectedIconList.map((iconUrl) => {
						const isSelected = iconUrl === localSelectedIcon;

						return (
							<div
								className="cursor-pointer flex items-end"
								onClick={() => setLocalSelectedIcon(iconUrl)}
							>
								<img src={iconUrl} className="w-[60px]" />
								{isSelected && (
									<div className="ml-[-20px]">
										<div className="bg-blue-500 rounded-full h-[20px] w-[20px] flex items-center justify-center">
											<Icon
												name="check"
												customClass={
													'!text-[20px] text-white group-hover:text-white cursor-pointer'
												}
											/>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>

				<div className="pt-3 border-t border-color-gray-200 flex gap-2">
					<button
						className="flex-1 border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
						onClick={() => setIsVisible(false)}
					>
						Cancel
					</button>
					<button
						className="flex-1 bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
						onClick={() => {
							setSelectedIcon(localSelectedIcon);
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

const TopButton = ({ name, selectedIconSection, setSelectedIconSection, setSelectedIconList }) => {
	const isSelected = selectedIconSection.toLowerCase() === name.toLowerCase();

	return (
		<div
			className={classNames(
				'py-1 px-4 rounded-3xl cursor-pointer text-center',
				isSelected
					? 'bg-[#222735] text-[#4671F7] font-semibold'
					: 'bg-color-gray-200/60 text-color-gray-100 hover:bg-color-gray-200/40'
			)}
			onClick={() => {
				setSelectedIconSection(name);
				setSelectedIconList(getHadesIcons(name));
			}}
		>
			{name}
		</div>
	);
};

const getHadesIcons = (iconSectionName) => {
	switch (iconSectionName.toLowerCase()) {
		case 'items':
			return HADES_ITEM_ICONS;
		case 'keepsake':
			return HADES_KEEPSAKE_ICON_URLS;
		case 'fish':
			return HADES_FISH_ICON_URLS;
		case 'contractor':
			return HADES_CONTRACTOR_ICONS;
		default:
			return HADES_ITEM_ICONS;
	}
};

export default DropdownHabitIcons;

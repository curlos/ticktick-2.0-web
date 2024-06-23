import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DropdownSidebarItemActions from '../Dropdown/DropdownSidebarItemActions';

interface IContextMenuSidebarItemActions {
	xPos: string;
	yPos: string;
	onClose: () => void;
	item: Object;
	type: 'project' | 'tag' | 'filter';
}

const ContextMenuSidebarItemActions: React.FC<IContextMenuSidebarItemActions> = ({
	xPos,
	yPos,
	onClose,
	item,
	type,
}) => {
	const [isDropdownSidebarItemActionsVisible, setIsDropdownSidebarItemActionsVisible] = useState(true);
	const dropdownSidebarItemActionsRef = useRef(null);

	useEffect(() => {
		if (xPos !== undefined || xPos !== null) {
			setIsDropdownSidebarItemActionsVisible(true);
		} else {
			setIsDropdownSidebarItemActionsVisible(true);
		}
	}, [xPos]);

	useEffect(() => {
		if (!isDropdownSidebarItemActionsVisible) {
			onClose();
		}
	}, [isDropdownSidebarItemActionsVisible]);

	return createPortal(
		<div>
			<DropdownSidebarItemActions
				toggleRef={dropdownSidebarItemActionsRef}
				isVisible={isDropdownSidebarItemActionsVisible}
				setIsVisible={setIsDropdownSidebarItemActionsVisible}
				customClasses=" !ml-[0px] mt-[15px]"
				customStyling={{ position: 'absolute', top: `${yPos}px`, left: `${xPos}px` }}
				item={item}
				type={type}
			/>
		</div>,
		document.body
	);
};

export default ContextMenuSidebarItemActions;

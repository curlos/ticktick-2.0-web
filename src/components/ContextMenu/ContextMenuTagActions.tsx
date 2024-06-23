import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DropdownSidebarItemActions from '../Dropdown/DropdownSidebarItemActions';

interface IContextMenuTagActions {
	xPos: string;
	yPos: string;
	onClose: () => void;
	tag: Object;
}

const ContextMenuProjectActions: React.FC<IContextMenuTagActions> = ({ xPos, yPos, onClose, tag }) => {
	const [isDropdownSidebarItemActionsVisible, setIsDropdownSidebarItemActionsVisible] = useState(true);
	const dropdownActionsToggleRef = useRef(null);

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
				toggleRef={dropdownActionsToggleRef}
				isVisible={isDropdownSidebarItemActionsVisible}
				setIsVisible={setIsDropdownSidebarItemActionsVisible}
				customClasses=" !ml-[0px] mt-[15px]"
				customStyling={{ position: 'absolute', top: `${yPos}px`, left: `${xPos}px` }}
				item={tag}
				type="tag"
			/>
		</div>,
		document.body
	);
};

export default ContextMenuProjectActions;

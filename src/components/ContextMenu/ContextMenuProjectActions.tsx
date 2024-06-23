import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DropdownProjectActions from '../Dropdown/DropdownProjectActions';
import DropdownSidebarItemActions from '../Dropdown/DropdownSidebarItemActions';

interface IContextMenuProjectActions {
	xPos: string;
	yPos: string;
	onClose: () => void;
	project: Object;
}

const ContextMenuProjectActions: React.FC<IContextMenuProjectActions> = ({ xPos, yPos, onClose, project }) => {
	const [isDropdownProjectActionsVisible, setIsDropdownProjectActionsVisible] = useState(true);
	const dropdownTaskActionsToggleRef = useRef(null);

	useEffect(() => {
		if (xPos !== undefined || xPos !== null) {
			setIsDropdownProjectActionsVisible(true);
		} else {
			setIsDropdownProjectActionsVisible(true);
		}
	}, [xPos]);

	useEffect(() => {
		if (!isDropdownProjectActionsVisible) {
			onClose();
		}
	}, [isDropdownProjectActionsVisible]);

	return createPortal(
		<div>
			<DropdownSidebarItemActions
				toggleRef={dropdownTaskActionsToggleRef}
				isVisible={isDropdownProjectActionsVisible}
				setIsVisible={setIsDropdownProjectActionsVisible}
				customClasses=" !ml-[0px] mt-[15px]"
				customStyling={{ position: 'absolute', top: `${yPos}px`, left: `${xPos}px` }}
				item={project}
				type="project"
			/>
		</div>,
		document.body
	);
};

export default ContextMenuProjectActions;

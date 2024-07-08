import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DropdownHabitOptions from '../Dropdown/DropdownHabitOptions/DropdownHabitOptions';

interface IContextMenuHabitActions {
	xPos: string;
	yPos: string;
	onClose: () => void;
}

const ContextMenuHabitActions: React.FC<IContextMenuHabitActions> = ({ xPos, yPos, onClose, habit }) => {
	const [isDropdownHabitOptionsVisible, setIsDropdownHabitOptionsVisible] = useState(true);
	const dropdownTaskActionsToggleRef = useRef(null);

	useEffect(() => {
		if (xPos !== undefined || xPos !== null) {
			setIsDropdownHabitOptionsVisible(true);
		} else {
			setIsDropdownHabitOptionsVisible(true);
		}
	}, [xPos]);

	useEffect(() => {
		if (!isDropdownHabitOptionsVisible) {
			onClose();
		}
	}, [isDropdownHabitOptionsVisible]);

	console.log(xPos);
	console.log(yPos);
	console.log(isDropdownHabitOptionsVisible);

	return createPortal(
		<div>
			<DropdownHabitOptions
				toggleRef={dropdownTaskActionsToggleRef}
				isVisible={isDropdownHabitOptionsVisible}
				setIsVisible={setIsDropdownHabitOptionsVisible}
				customClasses=" !ml-[0px] mt-[15px]"
				customStyling={{ position: 'absolute', top: `${yPos}px`, left: `${xPos}px` }}
				onCloseContextMenu={onClose}
				habit={habit}
			/>
		</div>,
		document.body
	);
};

export default ContextMenuHabitActions;

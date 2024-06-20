import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DropdownTaskDetails from '../Dropdown/DropdownTaskActions';
import { TaskObj } from '../../interfaces/interfaces';

interface IContextMenuTaskDetails {
	xPos: string;
	yPos: string;
	onClose: () => void;
	task: TaskObj;
}

const ContextMenuTaskDetails: React.FC<IContextMenuTaskDetails> = ({ xPos, yPos, onClose, task }) => {
	const [isDropdownTaskDetailsVisible, setIsDropdownTaskDetailsVisible] = useState(true);
	const dropdownTaskDetailsRef = useRef(null);

	useEffect(() => {
		if (xPos !== undefined || xPos !== null) {
			setIsDropdownTaskDetailsVisible(true);
		} else {
			setIsDropdownTaskDetailsVisible(true);
		}
	}, [xPos]);

	useEffect(() => {
		if (!isDropdownTaskDetailsVisible) {
			onClose();
		}
	}, [isDropdownTaskDetailsVisible]);

	console.log('g');
	console.log(isDropdownTaskDetailsVisible);
	console.log(xPos);

	return createPortal(
		<div>
			<DropdownTaskDetails
				toggleRef={dropdownTaskDetailsRef}
				isVisible={isDropdownTaskDetailsVisible}
				setIsVisible={setIsDropdownTaskDetailsVisible}
				customClasses=" !ml-[0px] mt-[15px]"
				customStyling={{ position: 'absolute', top: `${yPos}px`, left: `${xPos}px` }}
				onCloseContextMenu={onClose}
				task={task}
			/>
		</div>,
		document.body
	);
};

export default ContextMenuTaskDetails;

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGetTasksQuery } from '../../services/api';
import { useParams } from 'react-router';
import { TaskObj } from '../../interfaces/interfaces';
import DropdownTaskActions from '../Dropdown/DropdownTaskActions';

interface IContextMenuTask {
	xPos: string;
	yPos: string;
	onClose: () => void;
}

const ContextMenuTask: React.FC<IContextMenuTask> = ({ xPos, yPos, onClose }) => {
	const [isDropdownTaskActionsVisible, setIsDropdownTaskActionsVisible] = useState(true);
	const dropdownTaskActionsToggleRef = useRef(null);

	useEffect(() => {
		if (xPos !== undefined || xPos !== null) {
			setIsDropdownTaskActionsVisible(true);
		} else {
			setIsDropdownTaskActionsVisible(true);
		}
	}, [xPos]);

	return createPortal(
		<div>
			<DropdownTaskActions
				toggleRef={dropdownTaskActionsToggleRef}
				isVisible={isDropdownTaskActionsVisible}
				setIsVisible={setIsDropdownTaskActionsVisible}
				customClasses=" !ml-[0px] mt-[15px]"
				customStyling={{ position: 'absolute', top: `${yPos}px`, left: `${xPos}px` }}
				onCloseContextMenu={onClose}
			/>
		</div>,
		document.body
	);
};

export default ContextMenuTask;

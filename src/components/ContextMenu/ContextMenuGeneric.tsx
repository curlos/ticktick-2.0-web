import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface IContextMenuGeneric {
	xPos: string;
	yPos: string;
	onClose: () => void;
}

const ContextMenuGeneric: React.FC<IContextMenuGeneric> = ({
	xPos,
	yPos,
	onClose,
	isDropdownVisible,
	setIsDropdownVisible,
	children,
}) => {
	useEffect(() => {
		if (xPos !== undefined || xPos !== null) {
			setIsDropdownVisible(true);
		} else {
			setIsDropdownVisible(true);
		}
	}, [xPos]);

	useEffect(() => {
		if (!isDropdownVisible) {
			onClose();
		}
	}, [isDropdownVisible]);

	return createPortal(<div>{children}</div>, document.body);
};

export default ContextMenuGeneric;

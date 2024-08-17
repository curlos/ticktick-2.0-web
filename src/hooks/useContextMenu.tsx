import { useState, useRef } from 'react';

const useContextMenu = () => {
	const [contextMenu, setContextMenu] = useState(null);

	const [isDropdownVisible, setIsDropdownVisible] = useState(true);
	const dropdownRef = useRef(null);

	const handleContextMenu = (event) => {
		event.preventDefault(); // Prevent the default context menu

		setContextMenu({
			xPos: event.pageX, // X coordinate of the mouse pointer
			yPos: event.pageY, // Y coordinate of the mouse pointer
		});
	};

	const handleClose = () => {
		setContextMenu(null);
	};

	return {
		contextMenu,
		setContextMenu,
		isDropdownVisible,
		setIsDropdownVisible,
		dropdownRef,
		handleContextMenu,
		handleClose,
	};
};

export default useContextMenu;

import React, { forwardRef, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { DropdownProps } from '../../interfaces/interfaces';

interface BaseDropdownProps extends DropdownProps {
	children: React.ReactNode;
	positionAdjustment?: string;
}

// Update your component to use forwardRef
const Dropdown = forwardRef<HTMLDivElement, BaseDropdownProps>(
	({ children, isVisible, setIsVisible, customClasses, positionAdjustment, toggleRef, customStyling }, ref) => {
		const dropdownRef = useRef(null);
		useOutsideClick(dropdownRef, toggleRef, () => setIsVisible(false));

		if (!isVisible) return null;

		// Apply dynamic class based on positionAdjustment
		const positionClass = positionAdjustment || '';

		return (
			// TODO: "top-full and left-0" fixed the dropdown problem of them not appearing in the right spots with DropdownCqalendar. I was even able to take out the negative margin styles. This should be investigated for every other dropdown on the site since it happens eveywhere.
			<div
				ref={dropdownRef}
				className={`absolute top-full left-0 z-50 text-white bg-color-gray-600 rounded-lg text-sm ${positionClass} ${customClasses || ''}`}
				style={customStyling ? customStyling : undefined}
			>
				{children}
			</div>
		);
	}
);

export default Dropdown;

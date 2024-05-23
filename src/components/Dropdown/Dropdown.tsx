import React, { forwardRef, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { DropdownProps } from '../../interfaces/interfaces';
import classNames from 'classnames';

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
			<div
				ref={dropdownRef}
				className={classNames(
					'absolute top-full left-0 z-50 text-white bg-color-gray-600 rounded-lg text-sm mt-[4px]',
					positionClass ? positionClass : '',
					customClasses ? customClasses : ''
				)}
				style={customStyling ? customStyling : undefined}
			>
				{children}
			</div>
		);
	}
);

export default Dropdown;

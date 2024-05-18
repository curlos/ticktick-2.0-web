import React, { forwardRef, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { DropdownProps } from '../../interfaces/interfaces';

interface BaseDropdownProps extends DropdownProps {
    children: React.ReactNode;
    customClasses?: string;
    positionAdjustment?: string;
}

// Update your component to use forwardRef
const Dropdown = forwardRef<HTMLDivElement, BaseDropdownProps>(({ children, isVisible, setIsVisible, customClasses, positionAdjustment, toggleRef }, ref) => {
    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, toggleRef, () => setIsVisible(false));

    if (!isVisible) return null;

    // Apply dynamic class based on positionAdjustment
    const positionClass = positionAdjustment || '';

    return (
        <div ref={dropdownRef} className={`dropdown absolute z-50 text-white bg-color-gray-600 rounded-lg text-sm ${positionClass} ${customClasses || ''}`}>
            {children}
        </div>
    );
});

export default Dropdown;

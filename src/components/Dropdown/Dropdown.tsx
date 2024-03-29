import React, { forwardRef, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';

interface DropdownProps {
    children: React.ReactNode;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    customClasses?: string;
    positionAdjustment: string;
}

// Update your component to use forwardRef
const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({ children, isVisible, setIsVisible, customClasses, positionAdjustment }, ref) => {
    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, () => setIsVisible(false));

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

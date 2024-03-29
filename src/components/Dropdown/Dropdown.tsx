import React from 'react';

interface DropdownProps {
    children: React.ReactNode;
    isVisible: boolean;
    customClasses?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ children, isVisible, customClasses }) => {
    if (!isVisible) return null;

    return (
        <div className={"absolute z-50 text-white bg-color-gray-600 rounded-lg text-sm" + (customClasses ? customClasses : '')}>
            {children}
        </div>
    );
};

export default Dropdown;
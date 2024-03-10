import React from 'react';

interface TooltipProps {
    children: React.ReactNode;
    isVisible: boolean;
    customClasses?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, isVisible, customClasses }) => {
    if (!isVisible) return null;

    return (
        <div className={"absolute z-50 text-white bg-color-gray-600 rounded-lg text-sm" + (customClasses ? customClasses : '')}>
            {children}
        </div>
    );
};

export default Tooltip;
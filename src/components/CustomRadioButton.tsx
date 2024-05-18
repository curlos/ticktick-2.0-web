import React from 'react';

interface CustomRadioButtonProps {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: any) => void;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({ label, name, checked, onChange }) => {
    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="radio"
                name={name}
                value={name}
                checked={checked}
                onChange={onChange}
                className="hidden" // hides the default radio button
            />
            <div
                className={`border bg-color-gray-600 border-color-gray-100 rounded-full w-[13px] h-[13px] flex items-center justify-center mr-2`}
            >
                {checked && <div className="bg-color-gray-100 rounded-full w-[7px] h-[7px]"></div>}
            </div>
            {label}
        </label>
    );
};

export default CustomRadioButton;

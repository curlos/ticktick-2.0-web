import Fuse from "fuse.js";
import Dropdown from "./Dropdown";
import { useEffect, useRef, useState } from "react";
import { debounce } from "../../utils/helpers.utils";
import Icon from "../Icon.component";
import { IPriorityItem, PRIORITIES } from "../../utils/priorities.utils";

interface DropdownPrioritiesProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    tempSelectedPriority: string;
    setTempSelectedPriority: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownPriorities: React.FC<DropdownPrioritiesProps> = ({
    isVisible, setIsVisible, tempSelectedPriority, setTempSelectedPriority
}) => {

    interface PriorityProps {
        priority: IPriorityItem;
    }

    const Priority: React.FC<PriorityProps> = ({ priority }) => {
        const { name, backendValue, textFlagColor } = priority;

        return (
            <div
                className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg"
                onClick={() => {
                    setTempSelectedPriority(backendValue);
                    setIsVisible(false);
                }}
            >
                <div className="flex items-center gap-1">
                    <Icon name="flag" customClass={`${textFlagColor} !text-[22px] hover:text-white cursor-p`} />
                    {name}
                </div>
                {tempSelectedPriority === backendValue && (
                    <Icon name="check" fill={0} customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'} />
                )}
            </div>
        );
    };

    return (
        <Dropdown isVisible={isVisible} customClasses={' ml-[-13px] shadow-2xl border border-color-gray-200 rounded-lg'}>
            <div className="w-[200px]">
                <div>
                    {Object.keys(PRIORITIES).map((key: string) => (
                        <Priority key={key} priority={PRIORITIES[key]} />
                    ))}
                </div>
            </div>
        </Dropdown>
    );
};

export default DropdownPriorities;
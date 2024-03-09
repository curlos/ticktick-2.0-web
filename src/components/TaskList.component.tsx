import { useState } from "react";
import Icon from "../components/Icon.component";

const TaskList: React.FC<Array<Object>> = ({ tasks }) => {
    return (
        <div>
            <div className="flex items-center text-[12px]">
                <Icon name="chevron_right" customClass={"text-color-gray-100 !text-[16px]"} />
                <span className="mr-[6px]">High</span>
                <span className="text-color-gray-100">3</span>
            </div>
        </div>
    );
};

export default TaskList;
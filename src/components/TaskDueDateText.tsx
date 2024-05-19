import classNames from "classnames";
import { isTaskOverdue } from "../utils/helpers.utils";
import Icon from "./Icon";

const TaskDueDateText = ({ dueDate, showCalendarIcon = false }) => {
    const today = new Date();
    const isOverdue = isTaskOverdue(dueDate);

    return (
        <div className="flex items-center gap-1 cursor-pointer">
            {showCalendarIcon && (
                <Icon name="calendar_month"
                    customClass={classNames(
                        "!text-[20px] hover:text-white cursor-pointer",
                        isOverdue ? 'text-red-500' : 'text-blue-500'
                    )}
                />
            )}
            <div className={isOverdue ? 'text-red-500' : 'text-blue-500'}>
                {new Date(dueDate).toLocaleDateString('en-US', {
                    year: 'numeric', // Full year
                    month: 'long',   // Full month name
                    day: 'numeric'   // Day of the month
                })}
            </div>
        </div>
    );
};

export default TaskDueDateText;
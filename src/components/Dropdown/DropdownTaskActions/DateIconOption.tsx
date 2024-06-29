import classNames from "classnames";
import { useState, useRef, useEffect, useCallback } from "react";
import { TaskObj } from "../../../interfaces/interfaces";
import Icon from "../../Icon";
import Dropdown from "../Dropdown";
import DropdownCalendar from "../DropdownCalendar/DropdownCalendar";

interface IDateIconOption {
	iconName: string;
	tooltipText: string;
	selected: boolean;
	onClick?: () => void;
	task: TaskObj;
	dueDate: Date | null;
	setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
	showDropdownCalendar?: boolean;
	onCloseContextMenu?: () => void;
}

const DateIconOption: React.FC<IDateIconOption> = ({
	iconName,
	tooltipText,
	selected,
	onClick,
	task,
	dueDate,
	setDueDate,
	showDropdownCalendar,
	onCloseContextMenu,
}) => {
	// useState
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);
	const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);

	// useRef
	const tooltipRef = useRef(null);
	const dropdownCalendarToggleRef = useRef(null);

	useEffect(() => {
		setIsDropdownCalendarVisible(false);
	}, [task]);

	const handleOnClick = () => {
		if (onClick && tooltipText !== 'Custom') {
			onClick();
		}

		// TODO: Add functionality for "Custom" icon.
		setIsDropdownCalendarVisible(!isDropdownCalendarVisible);
	};

	const mergeRefs = (...refs) => {
		const filteredRefs = refs.filter(Boolean);
		return (inst) => {
			for (const ref of filteredRefs) {
				if (typeof ref === 'function') {
					ref(inst);
				} else if (ref) {
					ref.current = inst;
				}
			}
		};
	};

	const combinedRef = useCallback(mergeRefs(tooltipRef, dropdownCalendarToggleRef), []);

	return (
		<div className={classNames('relative')}>
			<Icon
				toggleRef={combinedRef}
				name={iconName}
				fill={0}
				customClass={classNames(
					'text-color-gray-50 !text-[22px] hover:text-white hover:bg-color-gray-200 rounded cursor-pointer p-1',
					selected ? 'bg-gray-700' : ''
				)}
				onClick={handleOnClick}
				onMouseOver={() => setIsTooltipVisible(true)}
				onMouseLeave={() => setIsTooltipVisible(false)}
			/>
			<Dropdown
				toggleRef={tooltipRef}
				isVisible={isTooltipVisible}
				setIsVisible={setIsTooltipVisible}
				customClasses={'!bg-black'}
			>
				<div className="p-2 text-[12px] text-nowrap">{tooltipText}</div>
			</Dropdown>

			{showDropdownCalendar && (
				<DropdownCalendar
					toggleRef={dropdownCalendarToggleRef}
					isVisible={isDropdownCalendarVisible}
					setIsVisible={setIsDropdownCalendarVisible}
					task={task}
					currDueDate={dueDate}
					setCurrDueDate={setDueDate}
					customClasses=" !ml-[0px] mt-[15px]"
					showDateIcons={false}
					onCloseContextMenu={onCloseContextMenu}
				/>
			)}
		</div>
	);
};

export default DateIconOption;
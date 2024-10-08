import classNames from 'classnames';
import { useState } from 'react';
import Dropdown from '../../../components/Dropdown/Dropdown';
import MiniActionItem from '../MiniActionItem';

const DropdownAllActionItemsForDay = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	actionItems,
	flattenedActionItems,
	customStartTimeClasses,
	formattedDay,
}) => {
	const { tasks, focusRecords } = actionItems;
	const shownActionItems = flattenedActionItems;

	const [innerClickElemRefs, setInnerClickElemRefs] = useState([]);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
			innerClickElemRefs={innerClickElemRefs}
		>
			<div className="w-[300px] p-2">
				<div className="mb-2 font-bold">{formattedDay}</div>
				<div className="space-y-[2px] max-h-[200px] overflow-auto gray-scrollbar">
					{tasks?.map((task, index) => (
						<MiniActionItem
							key={task._id}
							index={index}
							task={task}
							actionItems={actionItems}
							flattenedActionItems={flattenedActionItems}
							shownActionItems={shownActionItems}
							innerClickElemRefs={innerClickElemRefs}
							setInnerClickElemRefs={setInnerClickElemRefs}
						/>
					))}

					{focusRecords?.map((focusRecord, index) => (
						<MiniActionItem
							key={focusRecord._id}
							index={index}
							focusRecord={focusRecord}
							actionItems={actionItems}
							flattenedActionItems={flattenedActionItems}
							shownActionItems={shownActionItems}
							customStartTimeClasses={customStartTimeClasses}
							innerClickElemRefs={innerClickElemRefs}
							setInnerClickElemRefs={setInnerClickElemRefs}
						/>
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownAllActionItemsForDay;

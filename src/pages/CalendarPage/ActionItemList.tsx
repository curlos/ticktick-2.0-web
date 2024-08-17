import MiniActionItem from './MiniActionItem';

const ActionItemList = ({ actionItems, maxActionItems }) => {
	const { tasks, focusRecords } = actionItems;
	const safeTasks = tasks ? tasks : [];
	const safeFocusRecords = focusRecords ? focusRecords : [];

	const flattenedActionItems = [...safeTasks, ...safeFocusRecords];
	const shownActionItems = flattenedActionItems.slice(0, maxActionItems);

	return (
		<div className="space-y-[2px]">
			{tasks?.map((task, index) => (
				<MiniActionItem
					key={task._id}
					index={index}
					task={task}
					flattenedActionItems={flattenedActionItems}
					shownActionItems={shownActionItems}
					maxActionItems={maxActionItems}
				/>
			))}

			{focusRecords?.map((focusRecord, index) => (
				<MiniActionItem
					key={focusRecord._id}
					index={index}
					focusRecord={focusRecord}
					flattenedActionItems={flattenedActionItems}
					shownActionItems={shownActionItems}
					maxActionItems={maxActionItems}
				/>
			))}
		</div>
	);
};

export default ActionItemList;

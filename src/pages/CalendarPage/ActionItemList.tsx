import MiniActionItem from './MiniActionItem';

const ActionItemList = ({ actionItems, maxActionItems, formattedDay }) => {
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
					actionItems={actionItems}
					flattenedActionItems={flattenedActionItems}
					shownActionItems={shownActionItems}
					formattedDay={formattedDay}
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
					formattedDay={formattedDay}
				/>
			))}
		</div>
	);
};

export default ActionItemList;

import AgendaItem from './AgendaItem';

const AgendaView = ({ groupedItemsByDateObj }) => {
	const { allItemsGroupedByDate, isAllDoneLoading, focusRecordsById, tasksById, projectsById, habitsById } =
		groupedItemsByDateObj;

	return (
		<div className="flex-1 overflow-auto gray-scrollbar border-t border-color-gray-200 py-[50px] pl-[50px] pr-[120px]">
			<div className="space-y-10">
				{isAllDoneLoading &&
					allItemsGroupedByDate &&
					Object.keys(allItemsGroupedByDate).map((dateKey) => {
						const tasksAndFocusRecords = allItemsGroupedByDate[dateKey];
						const { tasks, focusRecords } = tasksAndFocusRecords;
						const noTasks = !tasks || tasks.length === 0;
						const noFocusRecords = !focusRecords || focusRecords.length === 0;

						if (noTasks && noFocusRecords) {
							return null;
						}

						return (
							<div key={dateKey} className="flex">
								<div className="font-bold text-[24px] flex-[3] text-right mr-[100px]">{dateKey}</div>
								<div className="space-y-4 flex-[8]">
									{tasks?.map((task, index) => {
										const isLastAgendaItem =
											(!focusRecords || focusRecords.length === 0) && index === tasks.length - 1;

										return (
											<AgendaItem
												key={task._id}
												task={task}
												focusRecordsById={focusRecordsById}
												tasksById={tasksById}
												habitsById={habitsById}
												projectsById={projectsById}
												isLastAgendaItem={isLastAgendaItem}
											/>
										);
									})}

									{focusRecords?.map((focusRecord, index) => {
										const isLastAgendaItem = index === focusRecords.length - 1;

										return (
											<AgendaItem
												key={focusRecord._id}
												focusRecord={focusRecord}
												focusRecordsById={focusRecordsById}
												tasksById={tasksById}
												habitsById={habitsById}
												projectsById={projectsById}
												isLastAgendaItem={isLastAgendaItem}
											/>
										);
									})}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default AgendaView;

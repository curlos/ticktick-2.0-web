import { useState, useRef } from 'react';
import ContextMenuGeneric from '../../components/ContextMenu/ContextMenuGeneric';
import DrodpownAddFocusRecord from '../../components/Dropdown/DropdownAddFocusRecord';
import DropdownTaskDetails from '../../components/Dropdown/DropdownTaskDetails';
import Icon from '../../components/Icon';
import { formatDateTime, getAssociatedTimeForTask } from '../../utils/date.utils';
import { hexToRGBA, getFormattedDuration } from '../../utils/helpers.utils';
import useContextMenu from '../../hooks/useContextMenu';

const AgendaItem = ({
	task = {},
	focusRecord = {},
	focusRecordsById,
	tasksById,
	habitsById,
	projectsById,
	isLastAgendaItem,
}) => {
	const isForTask = task && Object.keys(task).length > 0;
	const isForFocusRecord = focusRecord && Object.keys(focusRecord).length > 0;

	const [hover, setHover] = useState(false);

	const { _id, taskId, habitId, note, duration, startTime, endTime, children, pomos } = focusRecord;

	const taskForFocusRecord = isForFocusRecord && tasksById[taskId];
	const habit = isForFocusRecord && habitsById[habitId];
	const project = isForFocusRecord
		? taskForFocusRecord && taskForFocusRecord.projectId && projectsById[taskForFocusRecord.projectId]
		: projectsById[task.projectId];

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);

	const childFocusRecordTaskTitles = new Set();

	isForFocusRecord &&
		children?.forEach((childId) => {
			const childFocusRecord = focusRecordsById[childId];
			const isTask = childFocusRecord.taskId;

			const childItem = isTask ? tasksById[childFocusRecord.taskId] : habitsById[childFocusRecord.habitId];
			childFocusRecordTaskTitles.add(isTask ? childItem?.title : childItem?.name);
		});

	const getTime = () => {
		if (isForFocusRecord && startTime) return startTimeObj.time;
		return 'All Day';
	};

	const getIcon = () => {
		if (isForFocusRecord) {
			if (pomos > 0) {
				return {
					name: 'nutrition',
					fill: 1,
				};
			}

			return {
				name: 'timer',
				fill: 1,
			};
		}

		if (isForTask) {
			const { key } = getAssociatedTimeForTask(task);

			switch (key) {
				case 'completedTime':
					return {
						name: 'check_circle',
						fill: 1,
					};
				case 'isDeleted':
					return {
						name: 'delete',
						fill: 1,
					};
				case 'willNotDo':
					return {
						name: 'disabled_by_default',
						fill: 1,
					};
				default:
					return {
						name: 'radio_button_unchecked',
						fill: 0,
					};
			}
		}
	};

	const bgColor = project?.color ? hexToRGBA(project.color, '30%') : hexToRGBA('#3b82f6', '30%');
	const bgColorHover = project?.color ? hexToRGBA(project.color, '60%') : hexToRGBA('#3b82f6', '60%');
	const borderColor = project?.color ? hexToRGBA(project.color) : hexToRGBA('#3b82f6');

	const cardStyle = {
		backgroundColor: hover ? bgColorHover : bgColor,
		borderColor: borderColor,
	};

	const { name: iconName, fill: iconFill } = getIcon();

	const { contextMenu, isDropdownVisible, setIsDropdownVisible, dropdownRef, handleContextMenu, handleClose } =
		useContextMenu();

	return (
		<li key={_id} className="relative m-0 list-none last:mb-[4px] cursor-pointer" style={{ minHeight: '54px' }}>
			{!isLastAgendaItem && (
				<div
					className="absolute top-[28px] left-[11px] h-full border-solid border-l-[1px] border-color-gray-100/50"
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div className="relative m-0 ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				<div className="absolute left-[-105px] text-color-gray-100">{getTime()}</div>
				<div className="absolute left-[-40px] w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
					<Icon
						name={iconName}
						customClass={'!text-[20px] text-color-gray-100/50 cursor-pointer'}
						fill={iconFill}
					/>
				</div>

				{!isLastAgendaItem && (
					<div
						className="absolute left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600 border-color-gray-100/50"
						style={{ top: '34px' }}
					></div>
				)}

				<div
					className="border-l border-l-[5px] rounded p-2"
					style={cardStyle}
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
					onClick={(e) => {
						e.stopPropagation();
						handleContextMenu(e);
					}}
				>
					{isForFocusRecord && (
						<div className="flex justify-between text-[12px] mb-[6px]">
							<div>
								{startTimeObj.time} - {endTimeObj.time}
							</div>
							<div>{getFormattedDuration(duration)}</div>
						</div>
					)}

					{isForFocusRecord ? (
						children && children.length > 0 ? (
							<div className="font-medium space-y-1">
								{[...childFocusRecordTaskTitles].map((title, index) => {
									return <div key={`${title}-${index}`}>{title}</div>;
								})}
							</div>
						) : (
							<div>
								<div>
									{taskForFocusRecord && (
										<div className="font-medium">{taskForFocusRecord.title}</div>
									)}
								</div>
								<div>{habit && <div className="font-medium">{habit.name}</div>}</div>
							</div>
						)
					) : (
						<div>{task && <div className="font-medium">{task.title}</div>}</div>
					)}
				</div>

				{contextMenu && (
					<ContextMenuGeneric
						xPos={contextMenu.xPos}
						yPos={contextMenu.yPos}
						onClose={handleClose}
						isDropdownVisible={isDropdownVisible}
						setIsDropdownVisible={setIsDropdownVisible}
					>
						{isForTask ? (
							<DropdownTaskDetails
								toggleRef={dropdownRef}
								isVisible={true}
								setIsVisible={setIsDropdownVisible}
								customClasses=" !ml-[0px] mt-[15px]"
								customStyling={{
									position: 'absolute',
									top: `${contextMenu.yPos}px`,
									left: `${contextMenu.xPos}px`,
								}}
								onCloseContextMenu={handleClose}
								task={task}
							/>
						) : (
							<DrodpownAddFocusRecord
								toggleRef={dropdownRef}
								isVisible={true}
								setIsVisible={setIsDropdownVisible}
								customClasses=" !ml-[0px] mt-[15px]"
								customStyling={{
									position: 'absolute',
									top: `${contextMenu.yPos}px`,
									left: `${contextMenu.xPos}px`,
								}}
								onCloseContextMenu={handleClose}
								focusRecord={focusRecord}
								showTitle={false}
							/>
						)}
					</ContextMenuGeneric>
				)}
			</div>
		</li>
	);
};

export default AgendaItem;

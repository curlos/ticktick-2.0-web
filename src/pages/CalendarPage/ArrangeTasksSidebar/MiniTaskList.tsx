import DropdownTaskDetails from '../../../components/Dropdown/DropdownTaskDetails';
import useGetTaskBgColor from '../../../hooks/useGetTaskBgColor';
import { TaskObj } from '../interfaces/interfaces';
import useContextMenu from '../../../hooks/useContextMenu';
import ContextMenuGeneric from '../../../components/ContextMenu/ContextMenuGeneric';

interface MiniTaskListProps {
	tasks: Array<TaskObj>;
	fromCalendarPage: boolean;
}

const MiniTaskList: React.FC<MiniTaskListProps> = ({ tasks, fromCalendarPage }) => {
	return (
		<div className="space-y-1">
			{tasks.map((task) => (
				<MiniTask key={task._id} task={task} />
			))}
		</div>
	);
};

const MiniTask = ({ task }) => {
	const getTaskBgColor = useGetTaskBgColor();

	const { contextMenu, isDropdownVisible, setIsDropdownVisible, dropdownRef, handleContextMenu, handleClose } =
		useContextMenu();

	return (
		<div ref={dropdownRef} className="relative">
			<div
				className="p-[2px] truncate text-[12px] rounded cursor-pointer"
				style={{
					backgroundColor: getTaskBgColor(task),
				}}
				onClick={(e) => {
					e.stopPropagation();
					handleContextMenu(e);
				}}
			>
				{task.title}
			</div>

			{contextMenu && (
				<ContextMenuGeneric
					xPos={contextMenu.xPos}
					yPos={contextMenu.yPos}
					onClose={handleClose}
					isDropdownVisible={isDropdownVisible}
					setIsDropdownVisible={setIsDropdownVisible}
				>
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
				</ContextMenuGeneric>
			)}
		</div>
	);
};

export default MiniTaskList;

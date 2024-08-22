import DropdownTaskDetails from '../../../components/Dropdown/DropdownTaskDetails';
import useGetTaskBgColor from '../../../hooks/useGetTaskBgColor';
import { TaskObj } from '../interfaces/interfaces';
import useContextMenu from '../../../hooks/useContextMenu';
import ContextMenuGeneric from '../../../components/ContextMenu/ContextMenuGeneric';
import classNames from 'classnames';

interface MiniTaskListProps {
	tasks: Array<TaskObj>;
	fromCalendarPage: boolean;
}

const MiniTaskList: React.FC<MiniTaskListProps> = ({ tasks, fromCalendarPage }) => {
	return (
		<div>
			{tasks.map((task) => (
				<MiniTask key={task._id} task={task} />
			))}
		</div>
	);
};

const MiniTask = ({ task, fromParent }) => {
	const getTaskBgColor = useGetTaskBgColor();

	const { contextMenu, isDropdownVisible, setIsDropdownVisible, dropdownRef, handleContextMenu, handleClose } =
		useContextMenu();

	const { children } = task;

	return (
		<div ref={dropdownRef} className={classNames('relative mt-[3px]', fromParent && 'ml-2')}>
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

			{children && children.length > 0 && (
				<div className="flex flex-col">
					{children.map((subtask) => {
						if (!subtask) {
							return null;
						}

						return <MiniTask key={subtask._id} task={subtask} fromParent={true} />;
					})}
				</div>
			)}

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

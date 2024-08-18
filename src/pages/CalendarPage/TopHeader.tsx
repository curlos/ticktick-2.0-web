import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../components/Icon';
import { setModalState } from '../../slices/modalSlice';
import DropdownIntervalSelect from './DropdownIntervalSelect';
import useContextMenu from '../../hooks/useContextMenu';
import useHandleError from '../../hooks/useHandleError';
import { useAddTaskMutation } from '../../services/resources/tasksApi';
import ContextMenuGeneric from '../../components/ContextMenu/ContextMenuGeneric';
import DropdownTaskDetails from '../../components/Dropdown/DropdownTaskDetails';

const TopHeader = ({
	topHeaderRef,
	setHeaderHeight,
	showFilterSidebar,
	setShowFilterSidebar,
	currentDate,
	setCurrentDate,
	selectedInterval,
	setSelectedInterval,
}) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (topHeaderRef.current && document.readyState === 'complete') {
			setHeaderHeight(topHeaderRef.current.getBoundingClientRect().height);
		}
	}, [topHeaderRef, setHeaderHeight]);

	const dropdownIntervalSelectRef = useRef(null);
	const [isDropdownIntervalSelectVisible, setIsDropdownIntervalSelectVisible] = useState(false);

	const getName = () => {
		// TODO: For now, assume the interval is always monthly. This logic has to be reworked once other intervals come into play.
		if (selectedInterval === 'Month') {
			const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
			return `${currentMonth}`;
		}
	};

	const goToPreviousMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
	};

	const goToNextMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	};

	const { contextMenu, isDropdownVisible, setIsDropdownVisible, dropdownRef, handleContextMenu, handleClose } =
		useContextMenu();

	const handleError = useHandleError();
	// RTK Query - Tasks
	const [addTask, { isLoading, error }] = useAddTaskMutation();

	const defaultNewTask = {
		dueDate: new Date(),
	};

	const [newTask, setNewTask] = useState(defaultNewTask);

	const handleAddTask = async () => {
		const { title, description, priority, projectId, dueDate } = newTask;

		if (!title) {
			return null;
		}

		const payload = {
			title,
			description,
			priority,
			projectId,
			dueDate,
		};

		handleError(async () => {
			await addTask({ payload }).unwrap();
		});

		setNewTask(defaultNewTask);
	};

	return (
		<div ref={topHeaderRef} className="p-3 pt-5 flex justify-between items-center">
			<div className="flex items-center gap-2">
				<Icon
					name="left_panel_open"
					fill={0}
					customClass="text-color-gray-100 cursor-pointer"
					onClick={() => setShowFilterSidebar(!showFilterSidebar)}
				/>
				<div className="text-[18px] font-bold">{getName()}</div>
			</div>

			<div className="flex items-center gap-3">
				<Icon
					name="add"
					customClass="text-color-gray-100 !text-[18px] p-1 border border-color-gray-150 rounded cursor-pointer hover:text-blue-500"
					onClick={(e) => {
						e.stopPropagation();
						handleContextMenu(e);
					}}
				/>

				<div className="relative">
					<div
						ref={dropdownIntervalSelectRef}
						onClick={() => setIsDropdownIntervalSelectVisible(!isDropdownIntervalSelectVisible)}
						className="border border-color-gray-150 py-1 pl-3 pr-2 rounded hover:text-blue-500 flex items-center gap-[2px] cursor-pointer"
					>
						<span>{selectedInterval}</span>
						<Icon name="keyboard_arrow_down" customClass="text-color-gray-100 !text-[18px]" />
					</div>

					<DropdownIntervalSelect
						toggleRef={dropdownIntervalSelectRef}
						isVisible={isDropdownIntervalSelectVisible}
						setIsVisible={setIsDropdownIntervalSelectVisible}
						selected={selectedInterval}
						setSelected={setSelectedInterval}
					/>
				</div>

				<div>
					<div className="border border-color-gray-150 py-1 px-2 rounded flex items-center cursor-pointer justify-between gap-3">
						<Icon
							name="keyboard_arrow_left"
							customClass="text-color-gray-100 !text-[18px] hover:text-blue-500"
							onClick={goToPreviousMonth}
						/>
						<span className="hover:text-blue-500">{getName()}</span>
						<Icon
							name="keyboard_arrow_right"
							customClass="text-color-gray-100 !text-[18px] hover:text-blue-500"
							onClick={goToNextMonth}
						/>
					</div>
				</div>

				<Icon
					name="more_horiz"
					customClass="text-color-gray-100 !text-[20px] cursor-pointer hover:text-blue-500 p-1 rounded hover:bg-color-gray-300"
				/>
			</div>

			{contextMenu && (
				<ContextMenuGeneric
					xPos={contextMenu.xPos}
					yPos={contextMenu.yPos}
					onClose={() => {
						// Check if there's at least a title on the task and if there is, then make an API call to add that task to the backend.
						handleAddTask();

						// Close the context menu
						handleClose();
					}}
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
						task={defaultNewTask}
						newTask={newTask}
						setNewTask={setNewTask}
						isForAddingNewTask={true}
					/>
				</ContextMenuGeneric>
			)}
		</div>
	);
};

export default TopHeader;

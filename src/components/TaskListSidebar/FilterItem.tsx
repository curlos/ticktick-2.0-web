import { useNavigate, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { filterTasksByFilter } from '../../utils/filters.util';
import { useGetTasksQuery } from '../../services/resources/tasksApi';
import { useGetFiltersQuery } from '../../services/resources/filtersApi';
import ContextMenuGeneric from '../ContextMenu/ContextMenuGeneric';
import DropdownSidebarItemActions from '../Dropdown/DropdownSidebarItemActions';

const FilterItem = ({ filter }) => {
	const navigate = useNavigate();
	const params = useParams();

	const { filterId } = params;

	const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetTasksQuery();
	const { tasks, tasksWithoutDeletedOrWillNotDo } = fetchedTasks || {};

	const { data: fetchedFilters } = useGetFiltersQuery();
	const { filters } = fetchedFilters || {};

	const { name, _id } = filter;

	const iconName = 'filter_list';
	const displayName = name;
	const [numberOfTasks, setNumberOfTasks] = useState(0);
	const [taskContextMenu, setTaskContextMenu] = useState(null);
	const [isDropdownSidebarItemActionsVisible, setIsDropdownSidebarItemActionsVisible] = useState(true);
	const dropdownSidebarItemActionsRef = useRef(null);

	useEffect(() => {
		if (!tasks) {
			return;
		}

		// Filter out tasks by the selected filters
		const filteredTasks = filterTasksByFilter(tasksWithoutDeletedOrWillNotDo, filter);
		setNumberOfTasks(filteredTasks.length);
	}, [tasks]);

	const handleClick = (e) => {
		e.stopPropagation();
		navigate(`/filters/${_id}/tasks`);
	};

	const handleContextMenu = (event) => {
		// Prevent the default context menu
		event.preventDefault();
		event.stopPropagation();

		setTaskContextMenu({
			xPos: event.pageX,
			yPos: event.pageY,
		});
	};

	const handleClose = () => {
		setTaskContextMenu(null);
	};

	const isSelected = filterId === filter._id;

	return (
		<div onContextMenu={handleContextMenu} onClick={handleClick}>
			<div
				className={classNames(
					'p-2 rounded-lg flex items-center justify-between cursor-pointer cursor-pointer',
					isSelected ? ' bg-color-gray-200' : ' hover:bg-color-gray-600'
				)}
			>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-0">
						<Icon name={iconName} customClass={'text-white !text-[22px]'} fill={0} />
					</div>
					<div className="overflow-hidden text-nowrap text-ellipsis w-[130px]">{displayName}</div>
				</div>

				<div className="flex items-center ml-1 gap-3">
					<div className="flex justify-end">
						{/* <div
							className={(!color ? 'hidden ' : '') + ' ' + `rounded-full w-[8px] h-[8px]`}
							style={{ backgroundColor: color && !isParent ? color : 'transparent' }}
						></div> */}
					</div>

					{numberOfTasks ? <div className="text-color-gray-100">{numberOfTasks}</div> : ''}
				</div>
			</div>

			{taskContextMenu && (
				<ContextMenuGeneric
					xPos={taskContextMenu.xPos}
					yPos={taskContextMenu.yPos}
					onClose={handleClose}
					isDropdownVisible={isDropdownSidebarItemActionsVisible}
					setIsDropdownVisible={setIsDropdownSidebarItemActionsVisible}
				>
					<DropdownSidebarItemActions
						toggleRef={dropdownSidebarItemActionsRef}
						isVisible={isDropdownSidebarItemActionsVisible}
						setIsVisible={setIsDropdownSidebarItemActionsVisible}
						customClasses=" !ml-[0px] mt-[15px]"
						customStyling={{
							position: 'absolute',
							top: `${taskContextMenu.yPos}px`,
							left: `${taskContextMenu.xPos}px`,
						}}
						item={filter}
						type="filter"
					/>
				</ContextMenuGeneric>
			)}
		</div>
	);
};

export default FilterItem;

import { useNavigate, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { useGetTasksQuery } from '../../services/resources/tasksApi';
import { useGetTagsQuery } from '../../services/resources/tagsApi';
import ContextMenuGeneric from '../ContextMenu/ContextMenuGeneric';
import DropdownSidebarItemActions from '../Dropdown/DropdownSidebarItemActions';

const TagItem = ({ tag, isChild }) => {
	const navigate = useNavigate();
	const params = useParams();

	const { tagId } = params;

	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tags, tagsById } = fetchedTags || {};

	const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetTasksQuery();
	const { tasks } = fetchedTasks || {};

	const { name, color, children, _id } = tag;

	const iconName = 'sell';
	const displayName = name;
	const [numberOfTasks, setNumberOfTasks] = useState(0);
	const [taskContextMenu, setTaskContextMenu] = useState(null);
	const [isDropdownSidebarItemActionsVisible, setIsDropdownSidebarItemActionsVisible] = useState(true);
	const dropdownSidebarItemActionsRef = useRef(null);

	const isParent = false;

	useEffect(() => {
		if (!tasks) {
			return;
		}

		const filteredTasks = tasks.filter((task) => !task.isDeleted && !task.willNotDo && task?.tagIds?.includes(_id));
		setNumberOfTasks(filteredTasks.length);
	}, [tasks]);

	const handleClick = (e) => {
		e.stopPropagation();
		navigate(`/tags/${_id}/tasks`);
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

	const childTags = children.map((childId) => tagsById[childId]);
	const isSelected = tagId === tag._id;

	return (
		<div onContextMenu={handleContextMenu} onClick={handleClick}>
			<div
				className={classNames(
					'p-2 rounded-lg flex items-center justify-between cursor-pointer cursor-pointer',
					isChild ? 'ml-3' : '',
					isSelected ? ' bg-color-gray-200' : ' hover:bg-color-gray-600'
				)}
			>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-0">
						{isParent && (
							<Icon name={'chevron_right'} customClass={'text-white !text-[12px] ml-[-12px]'} fill={1} />
						)}

						<Icon name={iconName} customClass={'text-white !text-[22px]'} fill={0} />
					</div>
					<div className="overflow-hidden text-nowrap text-ellipsis w-[130px]">{displayName}</div>
				</div>

				<div className="flex items-center ml-1 gap-3">
					<div className="flex justify-end">
						<div
							className={(!color ? 'hidden ' : '') + ' ' + `rounded-full w-[8px] h-[8px]`}
							style={{ backgroundColor: color && !isParent ? color : 'transparent' }}
						></div>
					</div>

					{numberOfTasks ? <div className="text-color-gray-100">{numberOfTasks}</div> : ''}
				</div>
			</div>

			{childTags &&
				childTags.length > 0 &&
				childTags.map((childTag) => <TagItem key={childTag._id} tag={childTag} isChild={true} />)}

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
						item={tag}
						type="tag"
					/>
				</ContextMenuGeneric>
			)}
		</div>
	);
};

export default TagItem;

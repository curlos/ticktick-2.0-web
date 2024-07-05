import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayToObjectByKey, containsEmoji, getNumberOfTasks } from '../utils/helpers.utils';
import { IProject } from '../interfaces/interfaces';
import Icon from './Icon';
import { SMART_LISTS } from '../utils/smartLists.utils';
import ContextMenuProjectActions from './ContextMenu/ContextMenuProjectActions';
import ContextMenuSidebarItemActions from './ContextMenu/ContextMenuSidebarItemActions';
import { useGetTasksQuery } from '../services/resources/tasksApi';

const DraggableProjects = ({ projects }) => {
	const [items, setItems] = useState([...projects]);

	useEffect(() => {
		setItems(projects);
	}, [projects]);

	const handleDragEnd = (event) => {
		const { active, over } = event;

		if (active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((item) => item._id === active.id);
				const newIndex = items.findIndex((item) => item._id === over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	return (
		<DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items.map((item) => (
					<SortableItem key={item._id} item={item}>
						<ProjectItem project={item} />
					</SortableItem>
				))}
			</SortableContext>
		</DndContext>
	);
};

function SortableItem({ item, children }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children}
		</div>
	);
}

export interface ProjectItemProps {
	project: IProject;
	projectsWithGroup?: Array<IProject>;
	insideFolder?: boolean;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project, projectsWithGroup, insideFolder, isSmartList }) => {
	const { projectId, taskId } = useParams();
	const navigate = useNavigate();

	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	const { name, color, isFolder, _id } = project;
	const iconFill = isFolder ? 0 : 1;

	const smartList = SMART_LISTS[project.urlName];
	let iconName = isFolder ? 'folder' : smartList ? smartList.iconName : project.isInbox ? 'inbox' : 'menu';
	const emoji = containsEmoji(name) ? name.split(' ')[0] : null;
	const displayName = emoji ? name.split(' ')[1] : name;
	const [numberOfTasks, setNumberOfTasks] = useState(0);
	const [taskContextMenu, setTaskContextMenu] = useState(null);

	useEffect(() => {
		if (!tasks) {
			return;
		}

		let filteredTasks = null;

		if (isSmartList) {
			filteredTasks = project.getFilteredTasks(tasks);
		} else {
			filteredTasks = tasks.filter((task) => !task.isDeleted && !task.willNotDo && task.projectId === _id);
		}

		// const newNumberOfTasks = getNumberOfTasks(filteredTasks, tasksById);

		setNumberOfTasks(filteredTasks.length);
	}, [tasks]);

	const formattedProjectsWithGroup = projectsWithGroup && arrayToObjectByKey(projectsWithGroup, '_id');
	const [showChildProjects, setShowChildProjects] = useState(true);

	const handleClick = () => {
		if (isSmartList) {
			navigate(project.route);
		} else {
			navigate(`/projects/${_id}/tasks`);
		}
	};

	const handleContextMenu = (event) => {
		event.preventDefault(); // Prevent the default context menu

		setTaskContextMenu({
			xPos: event.pageX, // X coordinate of the mouse pointer
			yPos: event.pageY, // Y coordinate of the mouse pointer
		});

		// navigate(`/projects/${inSmartListView ? params.projectId : projectId}/tasks/${_id}`);
	};

	const handleClose = () => {
		setTaskContextMenu(null);
	};

	const isSmartListView = SMART_LISTS[projectId];

	const isSelected =
		projectId && ((_id && projectId === _id) || (isSmartListView && name.toLowerCase() === projectId));

	return (
		<div onContextMenu={handleContextMenu} onClick={handleClick}>
			<div
				className={
					'p-2 rounded-lg flex items-center justify-between cursor-pointer cursor-pointer' +
					(isSelected ? ' bg-color-gray-200' : ' hover:bg-color-gray-600') +
					(insideFolder ? ' ml-3' : '')
				}
			>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-0">
						{isFolder && (
							<Icon
								name={'chevron_right'}
								customClass={'text-white !text-[12px] ml-[-12px]'}
								fill={iconFill != undefined ? iconFill : 1}
							/>
						)}

						{emoji ? (
							emoji
						) : (
							<Icon
								name={iconName}
								customClass={'text-white !text-[22px]'}
								fill={iconFill != undefined ? iconFill : 1}
							/>
						)}
					</div>
					<div className="overflow-hidden text-nowrap text-ellipsis w-[130px]">{displayName}</div>
				</div>

				<div className="flex items-center ml-1 gap-3">
					<div className="flex justify-end">
						<div
							className={(!color ? 'hidden ' : '') + ' ' + `rounded-full w-[8px] h-[8px]`}
							style={{ backgroundColor: color && !isFolder ? color : 'transparent' }}
						></div>
					</div>

					{numberOfTasks ? <div className="text-color-gray-100">{numberOfTasks}</div> : ''}
				</div>
			</div>

			{/* {isFolder && showChildProjects && projects && projects.map((projectId: string) => {
                const project = formattedProjectsWithGroup[projectId];

                return (
                    project ? (
                        <ProjectItem project={project} insideFolder={true} />
                    ) : null
                );
            })} */}

			{taskContextMenu && (
				<ContextMenuSidebarItemActions
					taskContextMenu={taskContextMenu}
					xPos={taskContextMenu.xPos}
					yPos={taskContextMenu.yPos}
					onClose={handleClose}
					item={project}
					type="project"
				/>
			)}
		</div>
	);
};

export default DraggableProjects;

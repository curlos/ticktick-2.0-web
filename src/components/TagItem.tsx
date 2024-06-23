import { useNavigate } from 'react-router';
import { useGetTagsQuery, useGetTasksQuery } from '../services/api';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

const TagItem = ({ tag }) => {
	const navigate = useNavigate();

	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tags } = fetchedTags || {};

	const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetTasksQuery();
	const { tasks } = fetchedTasks || {};

	const { name, color, parentId, _id } = tag;

	let iconName = 'tag';
	const displayName = name;
	const [numberOfTasks, setNumberOfTasks] = useState(0);
	const [taskContextMenu, setTaskContextMenu] = useState(null);

	useEffect(() => {
		if (!tasks) {
			return;
		}

		const filteredTasks = tasks.filter((task) => !task.isDeleted && !task.willNotDo && task.tagIds.includes(_id));
		setNumberOfTasks(filteredTasks.length);
	}, [tasks]);

	const handleClick = () => {
		navigate(`/tags/${_id}/tasks`);
	};

	const handleContextMenu = (event) => {
		// Prevent the default context menu
		event.preventDefault();

		setTaskContextMenu({
			xPos: event.pageX,
			yPos: event.pageY,
		});
	};

	const handleClose = () => {
		setTaskContextMenu(null);
	};

	return (
		<div onContextMenu={handleContextMenu} onClick={handleClick}>
			<div
				className={
					classNames('p-2 rounded-lg flex items-center justify-between cursor-pointer cursor-pointer')
					// (projectId === _id || (isSmartListView && name.toLowerCase() === projectId)
					// 	? ' bg-color-gray-200'
					// 	: ' hover:bg-color-gray-600') +
					// (insideFolder ? ' ml-3' : '')
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
				<ContextMenuProjectActions
					taskContextMenu={taskContextMenu}
					xPos={taskContextMenu.xPos}
					yPos={taskContextMenu.yPos}
					onClose={handleClose}
					project={project}
				/>
			)}
		</div>
	);
};

export default TagItem;

import React, { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import classNames from 'classnames';

import { Action } from './Action';
import { Handle } from './Handle';
import styles from './TreeItem.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../../Icon';
import { useEditTaskMutation, useGetProjectsQuery } from '../../../../services/api';
import { SMART_LISTS } from '../../../../utils/smartLists.utils';
import { PRIORITIES } from '../../../../utils/priorities.utils';
import TaskDueDateText from '../../../TaskDueDateText';
import ContextMenuTask from '../../../ContextMenu/ContextMenuTask';

export interface Props extends HTMLAttributes<HTMLLIElement> {
	childCount?: number;
	clone?: boolean;
	collapsed?: boolean;
	depth: number;
	disableInteraction?: boolean;
	disableSelection?: boolean;
	ghost?: boolean;
	handleProps?: any;
	indicator?: boolean;
	indentationWidth: number;
	value: string;
	onCollapse?(): void;
	onRemove?(): void;
	wrapperRef?(node: HTMLLIElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
	(
		{
			childCount,
			clone,
			depth,
			disableSelection,
			disableInteraction,
			ghost,
			handleProps,
			indentationWidth,
			indicator,
			collapsed,
			onCollapse,
			onRemove,
			style,
			value,
			wrapperRef,
			item,
			...props
		},
		ref
	) => {
		const navigate = useNavigate();
		const params = useParams();
		const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
		const [editTask] = useEditTaskMutation();
		const { projectsById } = fetchedProjects || {};

		const { children, _id, title, projectId, dueDate, priority, completedTime } = item;

		const [currCompletedTime, setCurrCompletedTime] = useState(completedTime);
		const [project, setProject] = useState(null);
		const [taskContextMenu, setTaskContextMenu] = useState(null);

		const categoryIconClass =
			' text-color-gray-100 !text-[16px] hover:text-white' + (children?.length >= 1 ? '' : ' invisible');

		useEffect(() => {
			if (projectsById && projectId) {
				setProject(projectsById[projectId]);
			}
		}, [projectId, projectsById]);

		useEffect(() => {
			setCurrCompletedTime(completedTime);
		}, [item]);

		const handleContextMenu = (event) => {
			event.preventDefault(); // Prevent the default context menu

			setTaskContextMenu({
				xPos: event.pageX, // X coordinate of the mouse pointer
				yPos: event.pageY, // Y coordinate of the mouse pointer
			});

			navigate(`/projects/${inSmartListView ? params.projectId : projectId}/tasks/${_id}`);
		};

		const handleClose = () => {
			setTaskContextMenu(null);
		};

		const inSmartListView = params.projectId && SMART_LISTS[params.projectId];
		const priorityData = PRIORITIES[priority];

		return (
			<li
				onContextMenu={handleContextMenu}
				className={classNames(
					styles.Wrapper,
					ghost && styles.ghost,
					indicator && styles.indicator,
					disableSelection && styles.disableSelection,
					disableInteraction && styles.disableInteraction
				)}
				ref={wrapperRef}
				style={
					{
						'--spacing': `${indentationWidth * depth}px`,
					} as React.CSSProperties
				}
				{...props}
			>
				<div
					className={classNames(
						styles.TreeItem,
						'group flex p-2 hover:bg-color-gray-600 cursor-pointer rounded-lg'
					)}
					ref={ref}
					style={style}
				>
					<div className="flex items-center invisible group-hover:visible">
						<Handle {...handleProps} />
					</div>

					<Action
						onClick={() => (onCollapse ? onCollapse() : null)}
						className={classNames(
							styles.Collapse,
							collapsed && styles.collapsed,
							'flex flex-column mt-[4px]'
						)}
					>
						{collapsed ? (
							<Icon name="expand_more" customClass={categoryIconClass} />
						) : (
							<Icon name="chevron_right" customClass={categoryIconClass} />
						)}
					</Action>

					<div
						className="h-[20px] mt-[2px]"
						onClick={(e) => {
							e.stopPropagation();
							let completedTime = currCompletedTime ? null : new Date().toISOString();

							setCurrCompletedTime(completedTime);

							editTask({ taskId: _id, payload: { completedTime } });
						}}
					>
						<span
							className={classNames(
								'flex items-center hover:text-white cursor-pointer',
								priorityData.textFlagColor
							)}
						>
							{!currCompletedTime ? (
								children.length > 0 ? (
									<Icon name="list_alt" fill={0} customClass={'!text-[20px] '} />
								) : (
									<Icon name="check_box_outline_blank" customClass={'!text-[20px] '} />
								)
							) : (
								<Icon name="check_box" customClass={'!text-[20px] '} />
							)}
						</span>
					</div>

					<span className="ml-1 text-white max-w-[450px]">{title}</span>

					<div className="flex-grow flex justify-end mt-[2px]">
						<div>
							<div className="flex items-center">
								{/* Only show the project name if the user is not currently already in the project itself. */}
								{project && params.projectId !== project._id && (
									<div className="text-color-gray-100 mr-1">{project.name}</div>
								)}
								{dueDate && <TaskDueDateText dueDate={dueDate} />}
								<Icon
									name="chevron_right"
									onClick={() =>
										navigate(
											`/projects/${inSmartListView ? params.projectId : projectId}/tasks/${_id}`
										)
									}
									customClass={'text-color-gray-100 !text-[20px] hover:text-white cursor-pointer'}
								/>
							</div>
						</div>
					</div>

					{taskContextMenu && (
						<ContextMenuTask
							taskContextMenu={taskContextMenu}
							xPos={taskContextMenu.xPos}
							yPos={taskContextMenu.yPos}
							onClose={handleClose}
						/>
					)}
				</div>
			</li>
		);
	}
);

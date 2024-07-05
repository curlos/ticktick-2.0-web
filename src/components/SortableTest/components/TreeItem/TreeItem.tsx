import React, { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import amongUsCompletionSoundMP3 from '/among_us_complete_task.mp3';

import { Action } from './Action';
import { Handle } from './Handle';
import styles from './TreeItem.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../../Icon';
import { SMART_LISTS } from '../../../../utils/smartLists.utils';
import { PRIORITIES } from '../../../../utils/priorities.utils';
import TaskDueDateText from '../../../TaskDueDateText';
import ContextMenuTaskActions from '../../../ContextMenu/ContextMenuTaskActions';
import DropdownCalendar from '../../../Dropdown/DropdownCalendar/DropdownCalendar';
import useAudio from '../../../../hooks/useAudio';
import TagItemForTask from '../../../TagItemForTask';
import Dropdown from '../../../Dropdown/Dropdown';
import { useEditTaskMutation } from '../../../../services/resources/tasksApi';
import { useGetProjectsQuery } from '../../../../services/resources/projectsApi';
import { useGetTagsQuery } from '../../../../services/resources/tagsApi';

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
		const { play: playCompletionSound, stop: stopCompletionSound } = useAudio(amongUsCompletionSoundMP3);

		const navigate = useNavigate();
		const params = useParams();
		const { tagId, filterId } = params;

		// RTK Query - Projects
		const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
		const { projectsById } = fetchedProjects || {};

		// RTK Query - Tags
		const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
		const { tagsById } = fetchedTags || {};

		// RTK Query - Tasks
		const [editTask] = useEditTaskMutation();

		const { children, _id, title, projectId, dueDate, priority, completedTime, willNotDo, tagIds } = item;

		const [currCompletedTime, setCurrCompletedTime] = useState(completedTime);
		const [currDueDate, setCurrDueDate] = useState(dueDate ? new Date(dueDate) : null);
		const [project, setProject] = useState(null);
		const [taskContextMenu, setTaskContextMenu] = useState(null);
		const [isDropdownCalendarVisible, setIsDropdownCalendarVisible] = useState(false);

		const dropdownCalendarToggleRef = useRef(null);

		const categoryIconClass =
			' text-color-gray-100 !text-[16px] hover:text-white' + (children?.length >= 1 ? '' : ' invisible');

		useEffect(() => {
			if (projectsById && projectId) {
				setProject(projectsById[projectId]);
			}
		}, [projectId, projectsById]);

		useEffect(() => {
			setCurrCompletedTime(completedTime);

			if (dueDate) {
				setCurrDueDate(new Date(dueDate));
			}
		}, [item]);

		const handleContextMenu = (event) => {
			event.preventDefault(); // Prevent the default context menu

			setTaskContextMenu({
				xPos: event.pageX, // X coordinate of the mouse pointer
				yPos: event.pageY, // Y coordinate of the mouse pointer
			});

			handleNavigation();
		};

		const handleClose = () => {
			setTaskContextMenu(null);
		};

		const inSmartListView = params.projectId && SMART_LISTS[params.projectId];
		const priorityData = PRIORITIES[priority];

		const handleNavigation = () => {
			if (tagId) {
				navigate(`/tags/${tagId}/tasks/${_id}`);
			} else if (filterId) {
				navigate(`/filters/${filterId}/tasks/${_id}`);
			} else {
				navigate(`/projects/${inSmartListView ? params.projectId : projectId}/tasks/${_id}`);
			}
		};

		const taskTags = tagIds && tagIds.map((tagId) => tagsById[tagId]);

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
					className={classNames(styles.TreeItem, 'group flex p-2 hover:bg-color-gray-600 rounded-lg')}
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

							// Reset and play audio
							playCompletionSound();

							editTask({ taskId: _id, payload: { completedTime } });
						}}
					>
						<span className={classNames('flex items-center cursor-pointer', priorityData.textFlagColor)}>
							{willNotDo ? (
								<Icon name="disabled_by_default" fill={1} customClass={'!text-[20px] '} />
							) : !currCompletedTime ? (
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

					<span
						className={classNames(
							'ml-1 max-w-[350px]',
							completedTime ? 'line-through text-color-gray-100' : 'text-white'
						)}
					>
						{title}
					</span>

					<div className="flex-grow flex justify-end mt-[2px]">
						<div>
							<div className="flex gap-1 items-center">
								{/* Tags */}
								<MiniTagList taskTags={taskTags} task={item} />

								{/* Only show the project name if the user is not currently already in the project itself. */}
								{project && params.projectId !== project._id && (
									<div className="text-color-gray-100 mr-1">{project.name}</div>
								)}

								{currDueDate && (
									<div className="relative">
										<div
											ref={dropdownCalendarToggleRef}
											onClick={() => setIsDropdownCalendarVisible(!isDropdownCalendarVisible)}
										>
											<TaskDueDateText dueDate={dueDate} />
										</div>
										<DropdownCalendar
											toggleRef={dropdownCalendarToggleRef}
											isVisible={isDropdownCalendarVisible}
											setIsVisible={setIsDropdownCalendarVisible}
											task={item}
											currDueDate={currDueDate}
											setCurrDueDate={setCurrDueDate}
											customClasses=" !ml-[-155px] mt-[15px]"
										/>
									</div>
								)}

								<Icon
									name="chevron_right"
									onClick={handleNavigation}
									customClass={'text-color-gray-100 !text-[20px] hover:text-white cursor-pointer'}
								/>
							</div>
						</div>
					</div>

					{taskContextMenu && (
						<ContextMenuTaskActions
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

const MiniTagList = ({ taskTags, task }) => {
	if (!taskTags || taskTags.length === 0) {
		return null;
	}

	const tag = taskTags[0];

	if (taskTags.length === 1) {
		return <TagItemForTask key={tag._id} tag={tag} task={task} allowDelete={false} />;
	}

	const PlusMoreTags = () => {
		const dropdownRef = useRef(null);
		const [isDropdownVisible, setIsDropdownVisible] = useState(false);

		if (!taskTags || taskTags.length <= 1) {
			return null;
		}

		const allRemainingTagsList = taskTags.slice(1).map((tag) => tag.name);
		const allRemainingTagsStr = allRemainingTagsList.join(', ');

		return (
			<div className="relative">
				<Dropdown
					toggleRef={dropdownRef}
					isVisible={isDropdownVisible}
					setIsVisible={setIsDropdownVisible}
					customClasses={'!bg-black'}
				>
					<div className="p-2 text-[12px] text-nowrap">{allRemainingTagsStr}</div>
				</Dropdown>

				<div
					className="px-2 py-1 text-[12px] text-white rounded-xl cursor-pointer bg-blue-500/[.65]"
					onMouseOver={() => setIsDropdownVisible(true)}
					onMouseLeave={() => setIsDropdownVisible(false)}
				>
					<div>+{taskTags.length - 1}</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex gap-1 mx-1">
			<TagItemForTask key={tag._id} tag={tag} task={task} allowDelete={false} />
			<PlusMoreTags />
		</div>
	);
};

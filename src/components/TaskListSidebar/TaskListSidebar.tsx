import { useEffect, useState } from 'react';
import Icon from '../Icon';
import { IProject } from '../../interfaces/interfaces';
import { arrayToObjectByKey, containsEmoji, fetchData } from '../../utils/helpers.utils';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFiltersQuery, useGetProjectsQuery, useGetTagsQuery } from '../../services/api';
import DraggableProjects, { ProjectItem } from '../DraggableProjects';
import { SortableTree } from '../SortableTest/SortableTree';
import { SMART_LISTS } from '../../utils/smartLists.utils';
import { setModalState } from '../../slices/modalSlice';
import TagItem from './TagItem';
import FilterItem from './FilterItem';

const TaskListSidebar = () => {
	const dispatch = useDispatch();
	const { data: fetchedProjects, isLoading, error } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

	// RTK Query - Tags
	const { data: fetchedTags } = useGetTagsQuery();
	const { tags, tagsWithNoParent } = fetchedTags || {};

	// RTK Query - Filters
	const { data: fetchedFilters } = useGetFiltersQuery();
	const { filters } = fetchedFilters || {};

	// TODO: Look into this. I had this before to drag projects and drop them into different folders.
	// const projectsWithNoGroup = projects && projects.filter((project) => !project.groupId);
	// const projectsWithGroup = projects && projects.filter((project) => project.groupId);

	const topListNames = ['all', 'today', 'tomorrow', 'week'];
	const statusListNames = ['completed', 'will-not-do', 'trash'];

	const inboxProject = projects?.find((project) => project.isInbox);

	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray p-4">
			<div>
				{topListNames
					.map((name) => SMART_LISTS[name])
					.map((project) => (
						<ProjectItem key={project.name} project={project} isSmartList={true} />
					))}
				{inboxProject && <ProjectItem key={inboxProject.name} project={inboxProject} />}
			</div>

			<hr className="my-3 border-color-gray-200 opacity-50" />

			<div className="">
				<div>
					<div className="flex items-center justify-between py-1 pr-1 hover:bg-color-gray-600 rounded cursor-pointer">
						<div className="flex items-center">
							<Icon name={'chevron_right'} customClass={'text-color-gray-100 !text-[16px]'} />
							<div className="text-color-gray-100">Lists</div>
						</div>

						<Icon
							name={'add'}
							customClass={'text-color-gray-100 !text-[16px] hover:text-white'}
							onClick={() => {
								dispatch(setModalState({ modalId: 'ModalAddProject', isOpen: true }));
							}}
						/>
					</div>

					{/* <div>
                        {generalLists.map((listPropsAndValues, index) => (
                            <ListItem key={index} {...listPropsAndValues} />
                        ))}
                    </div> */}
					{/* <div>
                        {projectsWithNoGroup.map((project, index) => (
                            <ProjectItem key={index} project={project} projectsWithGroup={projectsWithGroup} />
                        ))}
                    </div> */}

					{/* TODO: Might have to bring this back later. */}
					{/* <DraggableProjects projects={projects} /> */}

					{/* Show every project that is NOT the Inbox. */}
					{/* TODO: Bring back soon! THIS TAKES PRIORITY OVER THE ONE ABOVE "DraggableProjects". */}
					{projects &&
						projects
							.filter((project) => !project.isInbox)
							.map((project) => <ProjectItem key={project._id} project={project} />)}

					{/* <SortableTree collapsible indicator removable /> */}
				</div>

				{/* Filters */}
				{/* TODO: Bring back after fixing bug with stale state in Sortabletree */}
				{/* <div className="pt-3">
					<div className="flex items-center justify-between py-1 pr-1 hover:bg-color-gray-600 rounded cursor-pointer mb-2">
						<div className="flex items-center">
							<Icon name={'chevron_right'} customClass={'text-color-gray-100 !text-[16px]'} />
							<div className="text-color-gray-100">Filters</div>
						</div>

						<Icon
							name={'add'}
							customClass={'text-color-gray-100 !text-[16px] hover:text-white'}
							onClick={() => {
								dispatch(
									setModalState({
										modalId: 'ModalAddFilterOrEditMatrix',
										isOpen: true,
										props: {
											type: 'filter',
										},
									})
								);
							}}
						/>
					</div>

					{!filters || filters.length === 0 ? (
						<div className="p-2 rounded-lg text-color-gray-100 bg-color-gray-600 text-[12px]">
							Display tasks filtered by list, date, priority, tag, and more.
						</div>
					) : (
						<div>
							{filters.map((filter) => {
								return <FilterItem key={filter._id} filter={filter} />;
							})}
						</div>
					)}
				</div> */}

				<div className="pt-3">
					<div className="flex items-center justify-between py-1 pr-1 hover:bg-color-gray-600 rounded cursor-pointer mb-2">
						<div className="flex items-center">
							<Icon name={'chevron_right'} customClass={'text-color-gray-100 !text-[16px]'} />
							<div className="text-color-gray-100">Tags</div>
						</div>

						<Icon
							name={'add'}
							customClass={'text-color-gray-100 !text-[16px] hover:text-white'}
							onClick={() => {
								dispatch(setModalState({ modalId: 'ModalAddTag', isOpen: true }));
							}}
						/>
					</div>

					{/* TODO: Bring back soon! */}
					{!tags || tags.length === 0 ? (
						<div className="p-2 rounded-lg text-color-gray-100 bg-color-gray-600 text-[12px]">
							Categorize your tasks with tags. Quickly select a tag by typing "#" when adding a task
						</div>
					) : (
						<div>
							{tagsWithNoParent.map((tag) => {
								return <TagItem key={tag._id} tag={tag} />;
							})}
						</div>
					)}
				</div>
			</div>

			<hr className="my-4 border-color-gray-100 opacity-50" />

			<div>
				{statusListNames
					.map((name) => SMART_LISTS[name])
					.map((project) => (
						<ProjectItem key={project.name} project={project} isSmartList={true} />
					))}
			</div>
		</div>
	);
};

export default TaskListSidebar;

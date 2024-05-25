import { useEffect, useState } from 'react';
import Icon from './Icon';
import ModalAddList from './Modal/ModalAddList';
import { IProject } from '../interfaces/interfaces';
import { arrayToObjectByKey, containsEmoji, fetchData } from '../utils/helpers.utils';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProjectsQuery } from '../services/api';
import DraggableProjects, { ProjectItem } from './DraggableProjects';
import { SortableTree } from './SortableTest/SortableTree';
import { SMART_LISTS } from '../utils/smartLists.utils';
import { setModalState } from '../slices/modalSlice';

const TaskListSidebar = () => {
	const dispatch = useDispatch();
	const { data: fetchedProjects, isLoading, error } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

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
								dispatch(setModalState({ modalId: 'ModalAddList', isOpen: true }));
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
					{projects &&
						projects
							.filter((project) => !project.isInbox)
							.map((project) => <ProjectItem key={project._id} project={project} />)}

					{/* <SortableTree collapsible indicator removable /> */}
				</div>

				<div className="pt-3">
					<div className="p-2 text-color-gray-100">Filters</div>
					<div className="p-2 rounded-lg text-color-gray-100 bg-color-gray-600 text-[12px]">
						Display tasks filtered by list, date, priority, tag, and more
					</div>
				</div>

				<div className="pt-3">
					<div className="p-2 text-color-gray-100">Tags</div>
					<div className="p-2 rounded-lg text-color-gray-100 bg-color-gray-600 text-[12px]">
						Categorize your tasks with tags. Quickly select a tag by typing "#" when adding a task
					</div>
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

import { useState, useRef } from 'react';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import Icon from '../../Icon';
import DropdownItemsWithSearch from '../DropdownItemsWithSearch/DropdownItemsWithSearch';

const ProjectSelector = ({ selectedProject, setSelectedProject, dropdownProjectsState }) => {
	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isProjectsLoading, error: errorProjects } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

	// TODO: Use the top level component above this for timer only otherwise use this one.
	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const dropdownProjectsRef = useRef(null);

	if (!selectedProject) {
		return null;
	}

	const smartList = SMART_LISTS[selectedProject.urlName];
	const iconName = selectedProject.isFolder
		? 'folder'
		: smartList
			? smartList.iconName
			: selectedProject.isInbox
				? 'inbox'
				: 'menu';

	return (
		<div className="relative">
			<div
				ref={dropdownProjectsRef}
				onClick={() => {
					if (dropdownProjectsState) {
						dropdownProjectsState.setIsDropdownVisible(!dropdownProjectsState.isDropdownVisible);
					} else {
						setIsDropdownProjectsVisible(!isDropdownProjectsVisible);
					}
				}}
				className="flex items-center gap-[2px] mt-4 mb-3 cursor-pointer"
			>
				<Icon name={iconName} customClass={'!text-[20px] text-color-gray-100 hover:text-white'} />
				<div>{selectedProject.name}</div>
				<Icon name="chevron_right" customClass={'!text-[20px] text-color-gray-100'} />
			</div>

			<DropdownItemsWithSearch
				toggleRef={dropdownProjectsRef}
				isVisible={dropdownProjectsState ? dropdownProjectsState.isDropdownVisible : isDropdownProjectsVisible}
				setIsVisible={
					dropdownProjectsState ? dropdownProjectsState.setIsDropdownVisible : setIsDropdownProjectsVisible
				}
				selectedItem={selectedProject}
				setSelectedItem={setSelectedProject}
				items={projects}
				showSmartLists={true}
				type="project"
			/>
		</div>
	);
};

export default ProjectSelector;

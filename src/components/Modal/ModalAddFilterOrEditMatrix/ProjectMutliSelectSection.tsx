import { useState, useRef } from 'react';
import DropdownItemsWithSearch from '../../Dropdown/DropdownItemsWithSearch/DropdownItemsWithSearch';
import Icon from '../../Icon';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';

const ProjectMultiSelectSection = ({ selectedProjectsList, setSelectedProjectsList }) => {
	const { data: fetchedProjects, isLoading: isLoadingProjects, error: errorProjects } = useGetProjectsQuery();
	const { projects } = fetchedProjects || {};

	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const dropdownProjectsRef = useRef(null);

	const selectedProjectNames =
		selectedProjectsList &&
		selectedProjectsList
			.reduce((accumulator, current) => {
				accumulator.push(current.name);
				return accumulator;
			}, [])
			.join(', ');

	if (!projects) {
		return null;
	}

	return (
		<div>
			<div className="flex items-center">
				<div className="text-color-gray-100 w-[96px]">Lists</div>
				<div className="flex-1 relative">
					<div
						ref={dropdownProjectsRef}
						className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
						onClick={() => {
							setIsDropdownProjectsVisible(!isDropdownProjectsVisible);
						}}
					>
						<div style={{ wordBreak: 'break-word' }}>{selectedProjectNames}</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownItemsWithSearch
						toggleRef={dropdownProjectsRef}
						isVisible={isDropdownProjectsVisible}
						setIsVisible={setIsDropdownProjectsVisible}
						selectedItemList={selectedProjectsList}
						setSelectedItemList={setSelectedProjectsList}
						items={projects}
						customClasses="w-full ml-[0px]"
						multiSelect={true}
						type="project"
					/>
				</div>
			</div>
		</div>
	);
};

export default ProjectMultiSelectSection;

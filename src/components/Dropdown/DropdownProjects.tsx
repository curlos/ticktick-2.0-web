import Dropdown from './Dropdown';
import Icon from '../Icon';
import { DropdownProps, IProject } from '../../interfaces/interfaces';

interface DropdownProjectsProps extends DropdownProps {
	selectedProject: string;
	setSelectedProject: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownProjects: React.FC<DropdownProjectsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedProject,
	setSelectedProject,
	projects,
}) => {
	interface ProjectOptionProps {
		project: IProject;
	}

	const ProjectOption: React.FC<ProjectOptionProps> = ({ project }) => {
		const { name } = project;

		return (
			<div
				className="flex items-center justify-between cursor-pointer hover:bg-color-gray-300 p-2 rounded-lg"
				onClick={() => {
					setSelectedProject(project);
					setIsVisible(false);
				}}
			>
				<div className="flex items-center gap-1">
					<Icon name="menu" customClass={`!text-[22px] hover:text-white cursor-p`} />
					{name}
				</div>
				{selectedProject.name === name && (
					<Icon
						name="check"
						fill={0}
						customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
					/>
				)}
			</div>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={' ml-[-13px] mt-2 mb-2 shadow-2xl border border-color-gray-200 rounded-lg'}
		>
			<div className="w-[200px]">
				<div>
					{projects.map((project) => (
						<ProjectOption key={project.name} project={project} />
					))}
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownProjects;

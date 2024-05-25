import Dropdown from './Dropdown';
import { DropdownProps } from '../../interfaces/interfaces';
import { useGetProjectsQuery, usePermanentlyDeleteProjectMutation } from '../../services/api';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';

interface DropdownProjectActionsProps extends DropdownProps {
	onCloseContextMenu: () => void;
	project: Object;
}

const DropdownProjectActions: React.FC<DropdownProjectActionsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	customStyling,
	onCloseContextMenu,
	project,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isProjectsLoading, error: errorProjects } = useGetProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	const [permanentlyDeleteProject] = usePermanentlyDeleteProjectMutation();

	if (!project) {
		return null;
	}

	const ProjectAction = ({ name, onClick }) => (
		<div onClick={onClick} className="p-2 hover:bg-color-gray-300 cursor-pointer">
			{name}
		</div>
	);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl', customClasses)}
			customStyling={customStyling ? customStyling : null}
		>
			<div className="w-[200px] rounded p-1">
				<ProjectAction
					name="Edit"
					onClick={() => {
						setIsVisible(false);
						dispatch(setModalState({ modalId: 'ModalAddList', isOpen: true, props: { project } }));
					}}
				/>
				<ProjectAction
					name="Delete"
					onClick={async () => {
						setIsVisible(false);
						await permanentlyDeleteProject({
							projectId: project._id,
						});
						navigate('/projects/665233f98d8317681ddb831a/tasks');
					}}
				/>
			</div>
		</Dropdown>
	);
};

export default DropdownProjectActions;

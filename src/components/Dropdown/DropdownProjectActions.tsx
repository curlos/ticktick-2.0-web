import Dropdown from './Dropdown';
import Icon from '../Icon';
import { DropdownProps } from '../../interfaces/interfaces';
import { useGetProjectsQuery } from '../../services/api';
import { PRIORITIES } from '../../utils/priorities.utils';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import { setAlertState } from '../../slices/alertSlice';
import DropdownStartFocus from './DropdownTaskOptions/DropdownStartFocus';
import DropdownProjects from './DropdownProjects';

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
				<ProjectAction name="Delete" onClick={() => console.log('fag')} />
			</div>
		</Dropdown>
	);
};

export default DropdownProjectActions;

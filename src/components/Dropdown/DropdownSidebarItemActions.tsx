import Dropdown from './Dropdown';
import { DropdownProps } from '../../interfaces/interfaces';
import { usePermanentlyDeleteProjectMutation, usePermanentlyDeleteTagMutation } from '../../services/api';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';

interface DropdownSidebarItemActionsProps extends DropdownProps {
	onCloseContextMenu: () => void;
	item: Object;
	type: 'project' | 'tag' | 'filter';
}

const DropdownSidebarItemActions: React.FC<DropdownSidebarItemActionsProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	customStyling,
	onCloseContextMenu,
	item,
	type,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [permanentlyDeleteProject] = usePermanentlyDeleteProjectMutation();
	const [permanentlyDeleteTag] = usePermanentlyDeleteTagMutation();

	if (!item) {
		return null;
	}

	const ItemAction = ({ name, onClick }) => (
		<div onClick={onClick} className="p-2 hover:bg-color-gray-300 cursor-pointer">
			{name}
		</div>
	);

	// Projects
	const handleEditProject = () => {
		dispatch(setModalState({ modalId: 'ModalAddProject', isOpen: true, props: { project: item } }));
	};

	const handleDeleteProject = async () => {
		await permanentlyDeleteProject({
			projectId: item._id,
		});
		navigate('/projects/665233f98d8317681ddb831a/tasks');
	};

	// Tags
	const handleEditTag = () => {
		dispatch(setModalState({ modalId: 'ModalAddTag', isOpen: true, props: { tag: item } }));
	};

	const handleDeleteTag = async () => {
		await permanentlyDeleteTag({
			tagId: item._id,
		});
		// I guess re-route them back to Inbox for now. Maybe if the delete tag has a parent, we can route there instead.
		navigate('/tags/665233f98d8317681ddb831a/tasks');
	};

	const handleEdit = () => {
		setIsVisible(false);

		switch (type) {
			case 'project':
				handleEditProject();
				break;
			case 'tag':
				handleEditTag();
				break;
			default:
				break;
		}
	};

	const handleDelete = async () => {
		setIsVisible(false);

		switch (type) {
			case 'project':
				await handleDeleteProject();
				break;
			case 'tag':
				await handleDeleteTag();
				break;
			default:
				break;
		}
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl', customClasses)}
			customStyling={customStyling ? customStyling : null}
		>
			<div className="w-[200px] rounded p-1">
				<ItemAction name="Edit" onClick={handleEdit} />
				<ItemAction name="Delete" onClick={handleDelete} />
			</div>
		</Dropdown>
	);
};

export default DropdownSidebarItemActions;

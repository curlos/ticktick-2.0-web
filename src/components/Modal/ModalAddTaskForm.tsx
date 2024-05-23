import Modal from './Modal';
import AddTaskForm from '../AddTaskForm';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';

const ModalAddTaskForm: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddTaskForm']);
	const dispatch = useDispatch();

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;
	const { parentId } = props;

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => dispatch(setModalState({ modalId: 'ModalAddTaskForm', isOpen: false }))}
			position="top-center"
		>
			<div className="rounded-xl shadow-lg">
				<AddTaskForm parentId={parentId} />
			</div>
		</Modal>
	);
};

export default ModalAddTaskForm;

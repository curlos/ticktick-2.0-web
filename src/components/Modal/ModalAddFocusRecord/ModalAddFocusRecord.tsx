import Modal from '../Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../../slices/modalSlice';
import AddOrEditFocusRecord from './AddOrEditFocusRecord';

const ModalAddFocusRecord: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddFocusRecord']);
	const {
		isOpen,
		props: { focusRecord },
	} = modal;

	const dispatch = useDispatch();

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddFocusRecord', isOpen: false }));
	};

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-650">
				<AddOrEditFocusRecord focusRecord={focusRecord} closeModal={closeModal} />
			</div>
		</Modal>
	);
};

export default ModalAddFocusRecord;

import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import Icon from '../Icon';

const ModalErrorMessenger: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalErrorMessenger']);
	const dispatch = useDispatch();

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;
	const { error } = props;

	if (!error) {
		return null;
	}

	const { status, data } = error;

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalErrorMessenger', isOpen: false }));

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center" customClasses="!w-[700px]">
			<div className="rounded-lg shadow-lg bg-color-gray-600 p-4 pt-2">
				<div className="flex justify-end">
					<Icon
						name="close"
						customClass={'!text-[22px] cursor-pointer text-color-gray-100 hover:text-white'}
						onClick={closeModal}
					/>
				</div>
				<h1 className="font-bold text-[18px] mt-[-12px]">Fatal Error!</h1>
				<h3 className="font-bold">
					Status: <span className="font-normal">{status}</span>
				</h3>
				<p className="font-bold mt-1">
					Message: <span className="font-normal">{data?.message}</span>
				</p>
			</div>
		</Modal>
	);
};

export default ModalErrorMessenger;

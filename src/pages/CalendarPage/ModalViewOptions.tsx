import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal/Modal';
import { setModalState } from '../../slices/modalSlice';

const ModalViewOptions: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalViewOptions']);
	const dispatch = useDispatch();

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalViewOptions', isOpen: false }));

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-650">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">View Options</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div>Colors</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalViewOptions;

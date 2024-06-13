import classNames from 'classnames';
import Modal from './Modal';
import Icon from '../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';

const ModalEditMatrix: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalEditMatrix']);
	const dispatch = useDispatch();

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalEditMatrix', isOpen: false }));

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-600">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">Edit Matrix</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div className="flex justify-end gap-2">
						<button
							className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={closeModal}
						>
							Close
						</button>
						<button
							className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
							onClick={async () => {
								try {
									// TODO: Save Matrix Settings somewhere in the backend.
									closeModal();
								} catch (error) {
									console.log(error);
								}
							}}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalEditMatrix;

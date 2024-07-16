import { useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import Icon from '../../Icon';
import Modal from '../../Modal/Modal';

const ModalPickDateRange: React.FC = ({ isModalOpen, setIsModalOpen }) => {
	const dispatch = useDispatch();
	const [localStartDate, setLocalStartDate] = useState(new Date());
	const [localEndDate, setLocalEndDate] = useState(new Date());

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<Modal isOpen={isModalOpen} onClose={closeModal} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-650">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">Custom</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div>a</div>

					<div className="flex justify-end gap-2">
						<button
							className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
							onClick={async () => {
								closeModal();
							}}
						>
							Confirm
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalPickDateRange;

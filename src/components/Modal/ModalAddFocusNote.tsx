import { useState } from 'react';
import Icon from '../Icon';
import Modal from './Modal';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import classNames from 'classnames';
import { setFocusNote } from '../../slices/timerSlice';

const ModalAddFocusNote: React.FC = ({ isModalOpen, setIsModalOpen }) => {
	const { focusNote } = useSelector((state) => state.timer);
	const dispatch = useDispatch();
	const [localFocusNote, setLocalFocusNote] = useState(focusNote);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<Modal isOpen={isModalOpen} onClose={closeModal} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-650">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">Focus Note</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div className="space-y-2">
						{/* Focus Note */}
						<div className="flex gap-2">
							<TextareaAutosize
								className="flex-1 text-[13px] placeholder:text-[#7C7C7C] mt-2 mb-4 bg-transparent outline-none resize-none border border-color-gray-200 rounded p-2 hover:border-blue-500 min-h-[200px] max-h-[300px] overflow-auto gray-scrollbar"
								placeholder="What do you have in mind?"
								value={localFocusNote}
								onChange={(e) => setLocalFocusNote(e.target.value)}
							></TextareaAutosize>
						</div>
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
									dispatch(setFocusNote(localFocusNote));
									closeModal();
								} catch (error) {
									console.log(error);
								}
							}}
						>
							Ok
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAddFocusNote;

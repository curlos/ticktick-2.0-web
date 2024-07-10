import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import TextareaAutosize from 'react-textarea-autosize';
import Icon from '../Icon';
import { useState } from 'react';
import useHandleError from '../../hooks/useHandleError';
import { useEditHabitMutation } from '../../services/resources/habitsApi';

const ModalAddHabitLog: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddHabitLog']);
	const dispatch = useDispatch();
	const handleError = useHandleError();
	const [editHabit] = useEditHabitMutation();

	const [habitLogContent, setHabitLogContext] = useState('');

	if (!modal) {
		return null;
	}

	const {
		isOpen,
		props: { habit, checkedInDay, checkedInDayKey },
	} = modal;

	if (!habit) {
		return null;
	}

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddHabitLog', isOpen: false }));
	};

	console.log(habit);

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => dispatch(setModalState({ modalId: 'ModalAddHabitLog', isOpen: false }))}
			position="top-center"
		>
			<div className="rounded-xl shadow-lg bg-color-gray-600 p-5">
				<div className="flex justify-between mb-4">
					<div></div>
					<div className="flex items-center gap-2 mr-[10px]">
						<img src={habit.icon} className="w-[60px] h-[60px]" />
						<div>
							<h3 className="font-bold text-[16px]">{habit.name}</h3>
							<div className="text-left text-color-gray-100">{checkedInDayKey}</div>
						</div>
					</div>

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
							value={habitLogContent}
							onChange={(e) => setHabitLogContext(e.target.value)}
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
						onClick={() => {
							handleError(async () => {
								closeModal();

								// TODO: Send API call to Habit Log to udpate that habit log.
								console.log(habitLogContent);
								console.log(checkedInDay);
								console.log(checkedInDayKey);
								debugger;

								// First, we either have to edit or add a habit log to a checked day.

								// If the checked day does not exist or it does exist but no habit log has been added for it yet, then add a new habit log.
								

								// If the checked day exists AND a habit log exists, then edit the existing habit log.


								// If checkedInDay is undefined, then we first have to chck

								await editHabit({
									habitId: habit._id,
									payload: {
										checkedInDays: {
											...habit.checkedInDays,
											[checkedInDayKey]: {
												...checkedInDay,
												habitLogId: 
											},
										},
									},
								}).unwrap();
							});
						}}
					>
						Ok
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAddHabitLog;

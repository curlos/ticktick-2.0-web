import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import TextareaAutosize from 'react-textarea-autosize';
import Icon from '../Icon';
import { useEffect, useState } from 'react';
import useHandleError from '../../hooks/useHandleError';
import {
	useAddHabitLogMutation,
	useEditHabitLogMutation,
	useGetHabitLogQuery,
} from '../../services/resources/habitLogsApi';

const ModalAddHabitLog: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddHabitLog']);
	const dispatch = useDispatch();
	const handleError = useHandleError();

	// RTK Query - Habit Logs
	const [addHabitLog] = useAddHabitLogMutation();
	const [editHabitLog] = useEditHabitLogMutation();
	const { data: fetchedHabitLogs } = useGetHabitLogQuery();
	const { habitLogsById } = fetchedHabitLogs || {};

	const [habitLogContent, setHabitLogContent] = useState('');

	useEffect(() => {
		if (modal?.props?.habit && habitLogsById) {
			const { habit, checkedInDay, checkedInDayKey } = modal.props;

			if (checkedInDay && checkedInDay.habitLogId) {
				const habitLog = habitLogsById[checkedInDay.habitLogId];
				console.log(habitLog);
				setHabitLogContent(habitLog.content);
			}
		}
	}, [modal?.props?.habit, habitLogsById]);

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
							onChange={(e) => setHabitLogContent(e.target.value)}
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

								// If the checked day does not exist or it does exist but no habit log has been added for it yet, then ADD a NEW habit log.
								if (!checkedInDay || !checkedInDay.habitLogId) {
									handleError(async () => {
										await addHabitLog({
											habitLogPayload: {
												content: habitLogContent,
											},
											habitId: habit._id,
											checkedInDayKey,
										}).unwrap();
										setHabitLogContent('');
									});
								} else if (checkedInDay?.habitLogId) {
									// If the checked day exists AND a habit log exists, then EDIT the EXISTING habit log.

									handleError(async () => {
										const payload = {
											habitLogPayload: {
												content: habitLogContent,
											},
											habitLogId: checkedInDay.habitLogId,
											habitId: habit._id,
											checkedInDayKey,
										};
										await editHabitLog(payload).unwrap();
										setHabitLogContent('');
									});
								}
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

import { useRef, useState } from 'react';
import Icon from '../Icon';
import Modal from './Modal';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import DropdownSetFocusTypeAndAmount from '../Dropdown/DropdownsAddFocusRecord/DropdownSetFocusTypeAndAmount';
import DropdownTimeCalendar from '../Dropdown/DropdownsAddFocusRecord/DropdownTimeCalendar';
import DropdownSetTask from '../Dropdown/DropdownsAddFocusRecord/DropdownSetTask';

const ModalAddFocusRecord: React.FC = () => {
	const [isDropdownSetTaskVisible, setIsDropdownSetTaskVisible] = useState(false);
	const [isDropdownStartTimeVisible, setIsDropdownStartTimeVisible] = useState(false);
	const [isDropdownEndTimeVisible, setIsDropdownEndTimeVisible] = useState(false);
	const [isDropdownSetFocusTypeAndAmountVisible, setIsDropdownSetFocusTypeAndAmountVisible] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Object | null>(null);
	const [focusNote, setFocusNote] = useState('');

	const [startTime, setStartTime] = useState(null);
	const [endTime, setEndTime] = useState(null);

	const dropdownSetTaskRef = useRef(null);
	const dropdownStartTimeCalendarRef = useRef(null);
	const dropdownEndTimeCalendarRef = useRef(null);
	const dropdownSetFocusTypeAndAmountRef = useRef(null);

	const modal = useSelector((state) => state.modals.modals['ModalAddFocusRecord']);
	const dispatch = useDispatch();

	if (!modal) {
		return null;
	}

	const { isOpen } = modal;

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddFocusRecord', isOpen: false }));
	};

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-650 p-5">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-[16px]">Add Focus Record</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={closeModal}
					/>
				</div>

				<div className="space-y-2">
					{/* Task */}
					<div className="flex items-center gap-2">
						<div className="w-[100px]">Task</div>
						<div className="relative flex-1">
							<div
								ref={dropdownSetTaskRef}
								className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
								onClick={() => {
									setIsDropdownSetTaskVisible(!isDropdownSetTaskVisible);
								}}
							>
								<div className="text-color-gray-100">{selectedTask ? 'Task Selected' : 'Set Task'}</div>
								<Icon
									name="expand_more"
									fill={0}
									customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
								/>
							</div>

							<DropdownSetTask
								toggleRef={dropdownSetTaskRef}
								isVisible={isDropdownSetTaskVisible}
								setIsVisible={setIsDropdownSetTaskVisible}
								selectedTask={selectedTask}
								setSelectedTask={setSelectedTask}
							/>
						</div>
					</div>

					{/* Start Time */}
					<div className="flex items-center gap-2">
						<div className="w-[100px]">Start Time</div>
						<div className="relative flex-1">
							<div
								ref={dropdownStartTimeCalendarRef}
								className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
								onClick={() => {
									setIsDropdownStartTimeVisible(!isDropdownStartTimeVisible);
								}}
							>
								<div className="text-color-gray-100">{selectedTask ? 'Task Selected' : '20:30'}</div>
								<Icon
									name="expand_more"
									fill={0}
									customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
								/>
							</div>

							<DropdownTimeCalendar
								toggleRef={dropdownStartTimeCalendarRef}
								isVisible={isDropdownStartTimeVisible}
								setIsVisible={setIsDropdownStartTimeVisible}
								time={startTime}
								setTime={setStartTime}
							/>
						</div>
					</div>

					{/* End Time */}
					<div className="flex items-center gap-2">
						<div className="w-[100px]">End Time</div>
						<div className="relative flex-1">
							<div
								ref={dropdownEndTimeCalendarRef}
								className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
								onClick={() => {
									setIsDropdownEndTimeVisible(!isDropdownEndTimeVisible);
								}}
							>
								<div className="text-color-gray-100">{selectedTask ? 'Task Selected' : '21:00'}</div>
								<Icon
									name="expand_more"
									fill={0}
									customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
								/>
							</div>

							<DropdownTimeCalendar
								toggleRef={dropdownEndTimeCalendarRef}
								isVisible={isDropdownEndTimeVisible}
								setIsVisible={setIsDropdownEndTimeVisible}
								time={endTime}
								setTime={setEndTime}
							/>
						</div>
					</div>

					{/* Type */}
					<div className="flex items-center gap-2">
						<div className="w-[100px]">Type</div>
						<div className="relative flex-1">
							<div
								ref={dropdownSetFocusTypeAndAmountRef}
								className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
								onClick={() => {
									setIsDropdownSetFocusTypeAndAmountVisible(!isDropdownSetFocusTypeAndAmountVisible);
								}}
							>
								<div className="text-color-gray-100">
									{selectedTask ? 'Task Selected' : 'Pomo: 0 Pomo'}
								</div>
								<Icon
									name="expand_more"
									fill={0}
									customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
								/>
							</div>

							<DropdownSetFocusTypeAndAmount
								toggleRef={dropdownSetFocusTypeAndAmountRef}
								isVisible={isDropdownSetFocusTypeAndAmountVisible}
								setIsVisible={setIsDropdownSetFocusTypeAndAmountVisible}
								selectedTask={selectedTask}
								setSelectedTask={setSelectedTask}
							/>
						</div>
					</div>

					{/* Focus Note */}
					<div className="flex gap-2">
						<div className="w-[100px] mt-3">Focus Note</div>

						<TextareaAutosize
							className="flex-1 text-[13px] placeholder:text-[#7C7C7C] mt-2 mb-4 bg-transparent outline-none resize-none border border-color-gray-200 rounded p-2 hover:border-blue-500 min-h-[120px]"
							placeholder="What do you have in mind?"
							value={focusNote}
							onChange={(e) => setFocusNote(e.target.value)}
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
						onClick={closeModal}
					>
						Ok
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAddFocusRecord;

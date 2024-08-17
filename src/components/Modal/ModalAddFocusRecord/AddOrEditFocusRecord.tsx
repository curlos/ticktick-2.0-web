import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import {
	useAddFocusRecordMutation,
	useEditFocusRecordMutation,
	usePermanentlyDeleteFocusRecordMutation,
} from '../../../services/resources/focusRecordsApi';
import { useGetTasksQuery } from '../../../services/resources/tasksApi';
import { formatTimeToHoursMinutesSeconds } from '../../../utils/helpers.utils';
import DropdownSetFocusTypeAndAmount from '../../Dropdown/DropdownsAddFocusRecord/DropdownSetFocusTypeAndAmount';
import DropdownSetTaskOrHabit from '../../Dropdown/DropdownsAddFocusRecord/DropdownSetTaskOrHabit';
import Icon from '../../Icon';
import FocusRecordChild from './FocusRecordChild';
import TimeOption from './TimeOption';
import TextareaAutosize from 'react-textarea-autosize';
import useHandleError from '../../../hooks/useHandleError';

const AddOrEditFocusRecord = ({ focusRecord, closeModal, showTitle = true }) => {
	const handleError = useHandleError();

	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	const [addFocusRecord, { isLoading: isLoadingAddFocusRecord, error: errorAddFocusRecord }] =
		useAddFocusRecordMutation();
	const [editFocusRecord] = useEditFocusRecordMutation();
	const [permanentlyDeleteFocusRecord] = usePermanentlyDeleteFocusRecordMutation();

	const [selectedTask, setSelectedTask] = useState<Object | null>(null);
	const [focusNote, setFocusNote] = useState('');
	const [startTime, setStartTime] = useState(null);
	const [endTime, setEndTime] = useState(null);
	const [pomos, setPomos] = useState(0);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [focusType, setFocusType] = useState('pomo');

	// useState - Dropdown
	const [isDropdownSetTaskVisible, setIsDropdownSetTaskVisible] = useState(false);
	const [isDropdownStartTimeVisible, setIsDropdownStartTimeVisible] = useState(false);
	const [isDropdownEndTimeVisible, setIsDropdownEndTimeVisible] = useState(false);
	const [isDropdownSetFocusTypeAndAmountVisible, setIsDropdownSetFocusTypeAndAmountVisible] = useState(false);

	// useRef
	const dropdownSetTaskRef = useRef(null);
	const dropdownStartTimeCalendarRef = useRef(null);
	const dropdownEndTimeCalendarRef = useRef(null);
	const dropdownSetFocusTypeAndAmountRef = useRef(null);

	useEffect(() => {
		setIsDropdownSetTaskVisible(false);
	}, [selectedTask]);

	useEffect(() => {
		if (focusRecord) {
			console.log(focusRecord);
			const duration = formatTimeToHoursMinutesSeconds(focusRecord?.duration) || { hours: 0, minutes: 0 };
			const task = tasksById[focusRecord.taskId];

			// console.log(duration);

			setSelectedTask(task);
			setFocusNote(focusRecord.note);
			setStartTime(new Date(focusRecord.startTime));
			setEndTime(new Date(focusRecord.endTime));
			setPomos(focusRecord.pomos);
			setHours(duration.hours);
			setMinutes(duration.minutes);
			setFocusType(focusRecord.focusType);
		} else {
			setSelectedTask(null);
			setFocusNote('');
			setStartTime(null);
			setEndTime(null);
			setPomos(0);
			setHours(0);
			setMinutes(0);
			setFocusType('pomo');
		}
	}, [focusRecord]);

	const getDuration = (pomos) => {
		if (focusType === 'pomo') {
			// TODO: Change later when focus settings is worked on but for now keep it at 45 minutes as the default
			const defaultPomoLength = 2700; // 2700 seconds = 45 minutes
			return pomos * defaultPomoLength;
		} else {
			// Duration is in seconds so multiply the hours and minutes by 60.
			return (hours * 60 + minutes) * 60;
		}
	};

	const handleAddFocusRecord = async () => {
		const isTask = selectedTask.title;

		const payload = {
			taskId: isTask && selectedTask ? selectedTask._id : null,
			habitId: !isTask && selectedTask ? selectedTask._id : null,
			startTime: startTime,
			endTime: endTime,
			duration: getDuration(pomos),
			pomos: focusType === 'pomo' ? pomos : 0,
			focusType,
			note: focusNote,
		};

		if (payload.duration < 300) {
			throw new Error('Duration must be longer or equal to 300 seconds (5 minutes)');
		}

		if (focusRecord) {
			await editFocusRecord({
				focusRecordId: focusRecord._id,
				payload: payload,
			});
		} else {
			await addFocusRecord(payload);
		}
	};

	const noChildFocusRecords = !focusRecord || focusRecord?.children?.length === 0;

	return (
		<div>
			<div className={classNames('p-5', focusRecord ? 'pb-2' : '')}>
				{showTitle && (
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">{focusRecord ? 'Edit' : 'Add'} Focus Record</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>
				)}

				<div className="space-y-2">
					{/* Task */}
					{noChildFocusRecords ? (
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
									<div
										className={classNames(
											selectedTask ? 'text-white' : 'text-color-gray-100',
											'max-w-[260px] text-ellipsis text-nowrap overflow-hidden'
										)}
									>
										{selectedTask ? selectedTask.title || selectedTask.name : 'Set Task'}
									</div>
									<Icon
										name="expand_more"
										fill={0}
										customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
									/>
								</div>

								<DropdownSetTaskOrHabit
									toggleRef={dropdownSetTaskRef}
									isVisible={isDropdownSetTaskVisible}
									setIsVisible={setIsDropdownSetTaskVisible}
									selectedTask={selectedTask}
									setSelectedTask={setSelectedTask}
								/>
							</div>
						</div>
					) : (
						<div className="max-h-[500px] no-scrollbar overflow-auto flex flex-col gap-4">
							{focusRecord.children.map((childId) => (
								<FocusRecordChild childId={childId} />
							))}
						</div>
					)}

					{/* Start Time */}
					{noChildFocusRecords && (
						<TimeOption
							dropdownRef={dropdownStartTimeCalendarRef}
							isDropdownVisible={isDropdownStartTimeVisible}
							setIsDropdownVisible={setIsDropdownStartTimeVisible}
							time={startTime}
							setTime={setStartTime}
							name="Start Time"
							startTime={startTime}
							endTime={endTime}
							setPomos={setPomos}
							setHours={setHours}
							setMinutes={setMinutes}
							getDuration={getDuration}
						/>
					)}

					{/* End Time */}
					{noChildFocusRecords && (
						<TimeOption
							dropdownRef={dropdownEndTimeCalendarRef}
							isDropdownVisible={isDropdownEndTimeVisible}
							setIsDropdownVisible={setIsDropdownEndTimeVisible}
							time={endTime}
							setTime={setEndTime}
							name="End Time"
							startTime={startTime}
							endTime={endTime}
							setPomos={setPomos}
							setHours={setHours}
							setMinutes={setMinutes}
							getDuration={getDuration}
						/>
					)}

					{/* Type */}
					{noChildFocusRecords && (
						<div className="flex items-center gap-2">
							<div className="w-[100px]">Type</div>
							<div className="relative flex-1">
								<div
									ref={dropdownSetFocusTypeAndAmountRef}
									className="flex-1 border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 cursor-pointer"
									onClick={() => {
										setIsDropdownSetFocusTypeAndAmountVisible(
											!isDropdownSetFocusTypeAndAmountVisible
										);
									}}
								>
									<div
										className={classNames(
											(focusType === 'pomo' && pomos > 0) ||
												(focusType === 'stopwatch' && (hours > 0 || minutes > 0))
												? 'text-white'
												: 'text-color-gray-100'
										)}
									>
										{focusType === 'pomo'
											? `Pomo: ${pomos} Pomo${pomos > 1 ? 's' : ''}`
											: `Stopwatch: ${hours > 0 ? `${hours} Hour${hours !== 1 ? 's' : ''}` : ''} ${minutes} Minute${minutes !== 1 ? 's' : ''}`}
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
									focusType={focusType}
									setFocusType={setFocusType}
									pomos={pomos}
									setPomos={setPomos}
									hours={hours}
									setHours={setHours}
									minutes={minutes}
									setMinutes={setMinutes}
									getDuration={getDuration}
								/>
							</div>
						</div>
					)}

					{/* Focus Note */}
					<div className="flex gap-2">
						{closeModal && <div className="w-[100px] mt-3">Focus Note</div>}

						<TextareaAutosize
							className="flex-1 text-[13px] placeholder:text-[#7C7C7C] mt-2 mb-4 bg-transparent outline-none resize-none border border-color-gray-200 rounded p-2 hover:border-blue-500 min-h-[120px] max-h-[300px] overflow-auto gray-scrollbar"
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
						onClick={() => {
							handleError(async () => {
								await handleAddFocusRecord();
								closeModal();
							});
						}}
					>
						Ok
					</button>
				</div>
			</div>

			{focusRecord && (
				<div className="flex justify-end mt-3 border-t border-color-gray-200 px-5 py-2">
					<Icon
						name="delete"
						fill={1}
						customClass={
							'!text-[20px] text-color-gray-100 cursor-pointer p-1 rounded hover:bg-color-gray-600'
						}
						onClick={async () => {
							await permanentlyDeleteFocusRecord(focusRecord._id);
							closeModal();
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default AddOrEditFocusRecord;

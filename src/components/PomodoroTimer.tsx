import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addFocusRecord,
	setIsActive,
	setIsOvertime,
	setSeconds,
	setSelectedTask,
	setOverallStartTime,
	setCurrentFocusRecord,
	setFocusType,
	resetFocusRecords,
} from '../slices/timerSlice';
import alarmSound from '/clock-alarm-8761.mp3';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Icon from './Icon';
import { formatSeconds } from '../utils/helpers.utils';
import ModalAddFocusNote from './Modal/ModalAddFocusNote';
import { setModalState } from '../slices/modalSlice';
import PixelArtTimer from './PixelArtTimer';
import { useBulkAddFocusRecordsMutation } from '../services/resources/focusRecordsApi';
import DropdownSetTaskOrHabit from './Dropdown/DropdownsAddFocusRecord/DropdownSetTaskOrHabit';

const bgThemeColor = 'bg-[#4772F9]';
const textThemeColor = 'text-[#4772F9]';

interface PomodoroTimerProps {
	selectedButton: string;
	timerStyle: string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ timerStyle }) => {
	const [bulkAddFocusRecords] = useBulkAddFocusRecordsMutation();
	const dispatch = useDispatch();
	const {
		seconds,
		isActive,
		initialSeconds,
		isOvertime,
		selectedTask,
		duration,
		focusRecords,
		currentFocusRecord,
		focusType,
		focusNote,
	} = useSelector((state) => state.timer);
	// const initialSeconds = 2700; // Consider moving this to Redux if it needs to be dynamic or configurable
	const isPaused = !isActive && seconds !== initialSeconds;

	const [isDropdownProjectsVisible, setIsDropdownProjectsVisible] = useState(false);
	const [isDropdownSetTaskVisible, setIsDropdownSetTaskVisible] = useState(false);
	const dropdownSetTaskRef = useRef(null);

	const [isModalAddFocusNoteOpen, setIsModalAddFocusNoteOpen] = useState(false);

	const handleTimerAction = () => {
		const pressedStart = !isActive && seconds === initialSeconds;
		const pressedContinue = !isActive && seconds !== initialSeconds;
		const pressedPause = isActive;

		if (pressedStart) {
			// Save full date string here.
			dispatch(setOverallStartTime(new Date().toISOString()));
			dispatch(setFocusType('pomo'));
		}

		if (pressedStart || pressedContinue) {
			dispatch(
				setCurrentFocusRecord({
					startTime: new Date().toISOString(),
				})
			);
		}

		// If it's currently active, then that means that we're pausing the running timer in which case a focus record must be added to the array.
		if (pressedPause) {
			const isTask = selectedTask.title;

			dispatch(
				addFocusRecord({
					taskId: isTask && selectedTask ? selectedTask._id : null,
					habitId: !isTask && selectedTask ? selectedTask._id : null,
					startTime: currentFocusRecord.startTime,
					endTime: new Date().toISOString(),
					duration: currentFocusRecord.duration,
					pomos: 0,
					focusType: focusType,
					note: focusNote,
				})
			);
		}

		dispatch(setIsActive(!isActive)); // Toggle between starting and pausing the timer
	};

	const handleResetTimer = async () => {
		// By this point, all the local focus records have been added (since this can only be ended and executed if the timer is paused in the first place.)

		// TODO: Add the focus records to the backend. They must be grouped together though, probably with either a shared parent id or the parent focus record must be created with some children or something. I'll probably do it the second way.

		try {
			await bulkAddFocusRecords({ focusRecords, focusNote }).unwrap();

			// This function will stop and reset the timer, also exiting the overtime phase if it's active
			dispatch(setIsActive(false));
			dispatch(setIsOvertime(false));
			dispatch(setSeconds(initialSeconds)); // Reset to the initial time setting
			dispatch(resetFocusRecords());
		} catch (error) {
			dispatch(setModalState({ modalId: 'ModalErrorMessenger', isOpen: true, props: { error } }));
		}
	};

	const showNotification = () => {
		// Check if Notification permission has already been granted
		if (Notification.permission === 'granted') {
			// If it's okay let's create a notification
			new Notification('Pomodoro Timer', {
				body: "Time's up!",
				icon: '/path/to/icon.png', // Optional: add a custom icon path
			});
		} else if (Notification.permission !== 'denied') {
			// Otherwise, we need to ask the user for permission
			Notification.requestPermission().then((permission) => {
				// If the user accepts, let's create a notification
				if (permission === 'granted') {
					new Notification('Pomodoro Timer', {
						body: "Time's up!",
						icon: '/path/to/icon.png', // Optional: add a custom icon path
					});
				}
			});
		}
	};

	const playPomodoroCompleteSound = () => {
		const audio = new Audio(alarmSound);
		audio.onended = () => {
			// backgroundNoise[0].play();
		};
		backgroundNoise[0].pause();
		audio.play();
	};

	const getPercentage = () => {
		if (isOvertime) {
			return 13;
		}

		return (seconds / initialSeconds) * 100;
	};

	useEffect(() => {
		setIsDropdownSetTaskVisible(false);
	}, [selectedTask]);

	return (
		<div className="text-center w-[300px]">
			<div className="relative">
				<div
					ref={dropdownSetTaskRef}
					onClick={() => {
						setIsDropdownSetTaskVisible(!isDropdownSetTaskVisible);
					}}
					className={`text-white mb-4 cursor-pointer flex justify-center items-center group`}
				>
					<span className="text-color-gray-100 group-hover:text-white max-w-[260px] truncate">
						{selectedTask ? selectedTask.title || selectedTask.name : 'Focus'}
					</span>
					<Icon
						name="chevron_right"
						customClass={
							'text-color-gray-100 group-hover:text-white !text-[18px] cursor-p ml-[1px] mb-[-2.25px]'
						}
						fill={0}
					/>
				</div>

				<DropdownSetTaskOrHabit
					toggleRef={dropdownSetTaskRef}
					isVisible={isDropdownSetTaskVisible}
					setIsVisible={setIsDropdownSetTaskVisible}
					selectedTask={selectedTask}
					setSelectedTask={(newItem) => {
						const isTask = newItem.title;

						if (!selectedTask) {
							setCurrentFocusRecord({
								taskId: isTask ? newItem._id : null,
								habitId: !isTask ? newItem._id : null,
							});
						} else {
							if (isActive) {
								dispatch(
									addFocusRecord({
										taskId: isTask && selectedTask ? selectedTask._id : null,
										habitId: !isTask && selectedTask ? selectedTask._id : null,
										startTime: currentFocusRecord.startTime,
										endTime: new Date().toISOString(),
										duration: currentFocusRecord.duration,
										pomos: 0,
										focusType: focusType,
										note: focusNote,
									})
								);

								dispatch(setCurrentFocusRecord({ startTime: new Date().toISOString() }));
							}
						}

						dispatch(setSelectedTask(newItem));
					}}
					dropdownProjectsState={{
						isDropdownVisible: isDropdownProjectsVisible,
						setIsDropdownVisible: setIsDropdownProjectsVisible,
					}}
				/>
			</div>

			{timerStyle !== 'pixel' ? (
				<CircularProgressbarWithChildren
					value={getPercentage()}
					strokeWidth={1.5}
					styles={buildStyles({
						textColor: '#4772F9',
						pathColor: '#4772F9', // Red when overtime, otherwise original color
						trailColor: '#3d3c3c',
					})}
					counterClockwise={true}
					className={isOvertime ? 'animated-progress-path' : ''}
				>
					<div
						className="text-white text-[40px] flex justify-center gap-4 w-[100%] select-none cursor-pointer mb-[-10px]"
						onMouseOver={() => {}}
					>
						{!isOvertime && (
							<div className={`${textThemeColor}`} onClick={() => dispatch(setSeconds(seconds - 300))}>
								-
							</div>
						)}
						<div data-cy="timer-display" className="text-center text-[45px]">
							{isOvertime ? formatSeconds(duration) : formatSeconds(seconds)}
						</div>
						{!isOvertime && (
							<div className={`${textThemeColor}`} onClick={() => dispatch(setSeconds(seconds + 300))}>
								+
							</div>
						)}
					</div>
				</CircularProgressbarWithChildren>
			) : (
				<PixelArtTimer gap="1px" />
			)}

			<div className="flex flex-col gap-2 justify-center items-center pt-6">
				<button
					type="button"
					className={`${bgThemeColor} rounded-full py-3 px-10 text-white min-w-[200px]`}
					onClick={handleTimerAction}
				>
					{isActive ? 'Pause' : seconds !== initialSeconds ? 'Continue' : 'Start'}
				</button>

				<button
					type="button"
					className={`${!isPaused ? 'invisible ' : ''}${bgThemeColor} rounded-full py-3 px-10 text-white min-w-[200px]`}
					onClick={handleResetTimer}
				>
					End
				</button>

				<button className="text-color-gray-100 cursor-pointer" onClick={() => setIsModalAddFocusNoteOpen(true)}>
					Add Focus Note
				</button>
			</div>

			<ModalAddFocusNote isModalOpen={isModalAddFocusNoteOpen} setIsModalOpen={setIsModalAddFocusNoteOpen} />
		</div>
	);
};

export default PomodoroTimer;

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsActive, setIsOvertime, setSeconds } from '../slices/timerSlice';
import alarmSound from '/clock-alarm-8761.mp3';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import DropdownSetTask from './Dropdown/DropdownsAddFocusRecord/DropdownSetTask';
import Icon from './Icon';
import { formatSeconds } from '../utils/helpers.utils';
import ModalAddFocusNote from './Modal/ModalAddFocusNote';

const bgThemeColor = 'bg-[#4772F9]';
const textThemeColor = 'text-[#4772F9]';

interface PomodoroTimerProps {
	selectedButton: string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = () => {
	const dispatch = useDispatch();
	const { seconds, isActive, initialSeconds, isOvertime } = useSelector((state) => state.timer);
	// const initialSeconds = 2700; // Consider moving this to Redux if it needs to be dynamic or configurable
	const isPaused = !isActive && seconds !== initialSeconds;

	const [selectedTask, setSelectedTask] = useState<Object | null>(null);
	const [isDropdownSetTaskVisible, setIsDropdownSetTaskVisible] = useState(false);
	const dropdownSetTaskRef = useRef(null);

	const [isModalAddFocusNoteOpen, setIsModalAddFocusNoteOpen] = useState(false);

	const handleTimerAction = () => {
		dispatch(setIsActive(!isActive)); // Toggle between starting and pausing the timer
	};

	const handleResetTimer = () => {
		// This function will stop and reset the timer, also exiting the overtime phase if it's active
		dispatch(setIsActive(false));
		dispatch(setIsOvertime(false));
		dispatch(setSeconds(initialSeconds)); // Reset to the initial time setting
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
						{selectedTask ? selectedTask?.title : 'Focus'}
						{/* Focus */}
					</span>
					<Icon
						name="chevron_right"
						customClass={
							'text-color-gray-100 group-hover:text-white !text-[18px] cursor-p ml-[1px] mb-[-2.25px]'
						}
						fill={0}
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
			<CircularProgressbarWithChildren
				value={getPercentage()}
				strokeWidth={1.5}
				styles={buildStyles({
					textColor: '#4772F9',
					pathColor: '#4772F9',
					trailColor: '#3d3c3c',
				})}
				counterClockwise={true}
			>
				<div
					className="text-white text-[40px] flex justify-center gap-4 w-[100%] select-none cursor-pointer mb-[-10px]"
					onMouseOver={() => {}}
				>
					<div className={`${textThemeColor}`} onClick={() => dispatch(setSeconds(seconds - 300))}>
						-
					</div>
					<div data-cy="timer-display" className="text-center text-[45px]">
						{formatSeconds(seconds)}
					</div>
					<div className={`${textThemeColor}`} onClick={() => dispatch(setSeconds(seconds + 300))}>
						+
					</div>
				</div>

				{/* <div className={`text-color-gray-100` + (!isPaused ? ' invisible' : '')}>Paused</div> */}
			</CircularProgressbarWithChildren>

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

import { useState, useEffect } from "react";
import alarmSound from '/clock-alarm-8761.mp3';
import iosDarkNoise from '/IOS Dark Noise Background sound 1 Hour.mp3';
import { Link } from "react-router-dom";
import Icon from "./Icon.component";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import PixelArt from "./PixelArt";

const bgThemeColor = 'bg-[#4772F9]';
const textThemeColor = 'text-[#4772F9]';

interface PomodoroTimerProps {
    selectedButton: string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = () => {
    const [initialSeconds, _] = useState(5); // Assuming you want to start with a 5 seconds timer for testing
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);
    const [isOvertime, setIsOvertime] = useState(false);
    const backgroundNoise: any = useState(new Audio(iosDarkNoise));
    backgroundNoise.loop = true;
    const isPaused = !isActive && seconds !== initialSeconds;

    useEffect(() => {
        let intervalId: any = null;

        if (isActive) {
            if (backgroundNoise && backgroundNoise[0]?.paused) {
                backgroundNoise[0].play();
            }

            intervalId = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (prevSeconds === 0 && !isOvertime) {
                        playPomodoroCompleteSound();
                        showNotification();
                        setIsOvertime(true); // Switch to overtime
                        return initialSeconds + 1; // Start counting up from 0
                    }
                    return isOvertime ? prevSeconds + 1 : prevSeconds - 1;
                });
            }, 1000);
        } else if (!isActive && seconds !== initialSeconds) {
            backgroundNoise[0].pause();
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [isActive, seconds, isOvertime]);

    const handleTimerAction = () => {
        setIsActive(!isActive); // Toggle between starting and pausing the timer
    };

    const handleResetTimer = () => {
        // This function will stop and reset the timer, also exiting the overtime phase if it's active
        setIsActive(false);
        setIsOvertime(false);
        setSeconds(initialSeconds); // Reset to the initial time setting
    };

    const showNotification = () => {
        // Check if Notification permission has already been granted
        if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            new Notification("Pomodoro Timer", {
                body: "Time's up!",
                icon: "/path/to/icon.png" // Optional: add a custom icon path
            });
        } else if (Notification.permission !== "denied") {
            // Otherwise, we need to ask the user for permission
            Notification.requestPermission().then(permission => {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    new Notification("Pomodoro Timer", {
                        body: "Time's up!",
                        icon: "/path/to/icon.png" // Optional: add a custom icon path
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

    function formatSeconds(seconds: number) {
        // Calculate the number of minutes and the remaining seconds
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Pad with leading zeros if necessary
        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

        // Return the formatted string
        return `${paddedMinutes}:${paddedSeconds}`;
    }

    const getPercentage = () => {
        return (seconds / initialSeconds) * 100;
    };

    return (
        <div className="text-center">
            <div className={`text-white mb-4 cursor-pointer flex justify-center items-center group`}>
                <span className="text-color-gray-100 group-hover:text-white">Focus</span>
                <Icon name="chevron_right" customClass={"text-color-gray-100 group-hover:text-white !text-[18px] cursor-p ml-[1px] mb-[-2.25px]"} fill={0} />
            </div>
            <CircularProgressbarWithChildren value={getPercentage()}
                strokeWidth={1.5}
                styles={buildStyles({
                    textColor: "#4772F9",
                    pathColor: "#4772F9",
                    trailColor: "#3d3c3c"
                })}
                counterClockwise={true}
            >
                <div className="text-white text-[40px] flex justify-center gap-4 w-[100%] select-none cursor-pointer mb-[-10px]" onMouseOver={() => {

                }}>
                    <div className={`${textThemeColor}`} onClick={() => setSeconds(seconds - 300)}>-</div>
                    <div className="text-center text-[45px]">{formatSeconds(seconds)}</div>
                    <div className={`${textThemeColor}`} onClick={() => setSeconds(seconds + 300)}>+</div>
                </div>

                {/* <div className={`text-color-gray-100` + (!isPaused ? ' invisible' : '')}>Paused</div> */}
            </CircularProgressbarWithChildren>

            <div className="flex flex-col gap-2 justify-center items-center pt-6">
                <button type="button" className={`${bgThemeColor} rounded-full py-3 px-10 text-white min-w-[200px]`} onClick={handleTimerAction}>
                    {isActive ? 'Pause' : (seconds !== initialSeconds ? 'Continue' : 'Start')}
                </button>

                <button type="button" className={`${!isPaused ? 'invisible ' : ''}${bgThemeColor} rounded-full py-3 px-10 text-white min-w-[200px]`} onClick={handleResetTimer}>
                    End
                </button>
            </div>
        </div>
    );
};

interface TopBarProps {
    selectedButton: string,
    setSelectedButton: React.Dispatch<React.SetStateAction<string>>;
}

const TopBar: React.FC<TopBarProps> = ({ selectedButton, setSelectedButton }) => {
    const sharedButtonStyle = `py-1 px-4 rounded-3xl cursor-pointer`;
    const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
    const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666]`;

    return (
        <div className="flex justify-between items-center">
            <div></div>

            <div className="flex gap-1 mx-[100px]">
                <div className={selectedButton === 'pomo' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('pomo')}>Pomo</div>
                <div className={selectedButton === 'stopwatch' ? selectedButtonStyle : unselectedButtonStyle} onClick={() => setSelectedButton('stopwatch')}>Stopwatch</div>
            </div>

            <Icon name="more_horiz" customClass={"text-color-gray-100 !text-[18px] hover:text-white cursor-p"} fill={0} />
        </div>
    );
};

const FocusTimer = () => {
    const [selectedButton, setSelectedButton] = useState('stopwatch');

    return (
        <div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
            <div className="p-4 h-full border-l border-r border-color-gray-200 flex flex-col">
                <TopBar selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
                <div className="flex-1 flex justify-center items-center">
                    {selectedButton === 'pomo' ? (
                        <PomodoroTimer selectedButton={selectedButton} />
                    ) : (
                        <PixelArt gap="1px" />
                    )}
                </div>
            </div>
        </div>
    );
};



export default FocusTimer;
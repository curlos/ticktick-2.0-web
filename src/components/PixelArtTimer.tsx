import classNames from 'classnames';
import { SuperMarioPixelHTML } from '../utils/superMarioPixelArt.utils';
import { useDispatch, useSelector } from 'react-redux';
import { setIsActive, setIsOvertime, setSeconds } from '../slices/timerSlice';
import { formatSeconds } from '../utils/helpers.utils';
import DropdownSetTask from './Dropdown/DropdownsAddFocusRecord/DropdownSetTask';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { PixelDigit, PixelColon } from './PixelDigit';

const bgThemeColor = 'bg-[#4772F9]';
const textThemeColor = 'text-[#4772F9]';

interface PixelArtProps {
	gap?: string;
}

const PixelArtTimer: React.FC<PixelArtProps> = ({ gap }) => {
	const dispatch = useDispatch();
	const { seconds, isActive, initialSeconds, isOvertime } = useSelector((state) => state.timer);
	const isPaused = !isActive && seconds !== initialSeconds;

	const [selectedTask, setSelectedTask] = useState<Object | null>(null);
	const [isDropdownSetTaskVisible, setIsDropdownSetTaskVisible] = useState(false);
	const dropdownSetTaskRef = useRef(null);

	useEffect(() => {
		setIsDropdownSetTaskVisible(false);
	}, [selectedTask]);

	const handleTimerAction = () => {
		dispatch(setIsActive(!isActive)); // Toggle between starting and pausing the timer
	};

	const handleResetTimer = () => {
		// This function will stop and reset the timer, also exiting the overtime phase if it's active
		dispatch(setIsActive(false));
		dispatch(setIsOvertime(false));
		dispatch(setSeconds(initialSeconds)); // Reset to the initial time setting
	};

	const formattedSeconds = formatSeconds(seconds);

	return (
		<div>
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

			<div className="my-7">
				<PixelGrid gap={gap} />
			</div>

			<div
				className="text-white text-[40px] flex justify-center gap-4 w-[100%] select-none cursor-pointer mb-[-10px]"
				onMouseOver={() => {}}
			>
				<div className={`${textThemeColor}`} onClick={() => dispatch(setSeconds(seconds - 300))}>
					-
				</div>

				{formattedSeconds && <TimeDisplay time={formattedSeconds} />}

				<div className={`${textThemeColor}`} onClick={() => dispatch(setSeconds(seconds + 300))}>
					+
				</div>
			</div>

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
			</div>
		</div>
	);
};

const TimeDisplay = ({ time }) => {
	console.log(time);

	// Split the string into characters and map to components
	const timeElements = time.split('').map((char, index) => {
		if (char === ':') {
			return (
				<div className="mx-2">
					<PixelColon />
				</div>
			);
		}

		return <PixelDigit key={index} value={char} />;
	});

	return <div className="flex gap-2">{timeElements}</div>;
};

const PixelGrid = ({ gap }) => {
	const dispatch = useDispatch();
	const { seconds, isActive, initialSeconds, isOvertime } = useSelector((state) => state.timer);

	// TODO: Use "timer" seconds and initial seconds from redux to determine "timer" progress
	const timerProgress = (initialSeconds - seconds) / initialSeconds;
	const startedTimer = seconds !== initialSeconds;
	let foundFilledInColors = 0;
	let lastFilledInColorLessThanOrEqualTimerProgressIndex = null;

	const colors = extractColorsFromHTML(SuperMarioPixelHTML);
	const { cleanedUpColors, cleanedUpColorsMatrix } = adjustGrid(colors);
	const filledInColors = cleanedUpColors.filter((color) => color !== 'transparent');

	return (
		<div
			id="grid"
			className="grid"
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${cleanedUpColorsMatrix[0].length}, 1fr)`,
				gridTemplateRows: `repeat(${cleanedUpColorsMatrix.length}, 1fr)`,
				gap: gap ? gap : '0px',
			}}
		>
			{cleanedUpColors.map((color, index) => {
				const isFilledInColor = color !== 'transparent';
				let opacity = startedTimer ? 0.5 : 1;
				let showBlinkingOpacity = false;

				if (isFilledInColor) {
					const isFirstFilledinColor = foundFilledInColors === 0;
					foundFilledInColors += 1;

					const currentProgress = foundFilledInColors / filledInColors.length;

					// Show the filled in color with the full opacity if enough time has progressed to already fill it in.
					if (currentProgress <= timerProgress) {
						opacity = 1;
						lastFilledInColorLessThanOrEqualTimerProgressIndex = index;

						// If not enough time has progressed and this is EITHER the first filled in color in the pixel art OR the color AFTER the last filled in color, then show the blinking opacity animation on that color to show that it is in the process of being filled.
					} else if (
						index === lastFilledInColorLessThanOrEqualTimerProgressIndex + 1 ||
						isFirstFilledinColor
					) {
						// Only show the blinking opacity if the timer is currently running and thus making progress.
						showBlinkingOpacity = isActive ? true : false;
					}
				}

				return (
					<div
						key={index}
						className={classNames('grid-element', showBlinkingOpacity ? 'blinking-opacity' : '')}
						style={{ backgroundColor: color, width: '20px', height: '20px', opacity }}
					/>
				);
			})}
		</div>
	);
};

function extractColorsFromHTML(htmlString: string) {
	// This regex matches any div with or without a style attribute
	const divRegex = /<div class(?:Name)?="grid-element"(?: style="background-color: (.*?)")?><\/div>/g;
	const colors = [];
	let match;

	// Iterate over all matches and add the appropriate color or 'transparent' to the array
	while ((match = divRegex.exec(htmlString)) !== null) {
		const color = match[1] || 'transparent'; // If no style attribute, use 'transparent'
		colors.push(color.replace(';', ''));
	}

	return colors;
}

function adjustGrid(colors, gridSize = 20) {
	// Step 1: Convert flat array into 2D matrix
	let matrix = [];
	for (let i = 0; i < gridSize; i++) {
		matrix.push(colors.slice(i * gridSize, (i + 1) * gridSize));
	}

	// Step 2: Determine which rows and columns to keep
	let rowsToKeep = new Set();
	let colsToKeep = new Set();

	for (let i = 0; i < gridSize; i++) {
		let rowHasVisible = matrix[i].some((color) => color !== 'transparent');
		let colHasVisible = matrix.map((row) => row[i]).some((color) => color !== 'transparent');

		if (rowHasVisible) {
			rowsToKeep.add(i);
		}
		if (colHasVisible) {
			colsToKeep.add(i);
		}
	}

	// Step 3: Trim the rows and cols
	const trimmedRowsMatrix = [];

	for (let row = 0; row < gridSize; row++) {
		if (rowsToKeep.has(row)) {
			trimmedRowsMatrix.push(matrix[row]);
		}
	}

	const trimmedColsMatrix = [];

	for (let row = 0; row < trimmedRowsMatrix.length; row++) {
		const newRow = [];
		for (let col = 0; col < gridSize; col++) {
			if (colsToKeep.has(col)) {
				newRow.push(trimmedRowsMatrix[row][col]);
			}
		}

		if (newRow) {
			trimmedColsMatrix.push(newRow);
		}
	}

	// Step 4: Flatten the trimmed matrix back to a single array
	return { cleanedUpColors: trimmedColsMatrix.flat(), cleanedUpColorsMatrix: trimmedColsMatrix };
}

export default PixelArtTimer;

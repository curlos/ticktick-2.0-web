import { useRef, useState } from 'react';
import Dropdown from '../Dropdown';
import DropdownEstimation from './DropdownEstimation';
import { DropdownProps } from '../../../interfaces/interfaces';

interface DropdownStartFocusProps extends DropdownProps {}

const DropdownStartFocus: React.FC<DropdownStartFocusProps> = ({ toggleRef, isVisible, setIsVisible }) => {
	const dropdownEstimationRef = useRef(null);
	const [isDropdownEstimationVisible, setIsDropdownEstimationVisible] = useState(false);

	// TODO: Implement logic
	const handleStartPomo = () => {
		return;
	};

	// TODO: Implement logic
	const handleStartStopwatch = () => {
		return;
	};

	return (
		<div className="relative">
			<Dropdown
				toggleRef={toggleRef}
				isVisible={isVisible}
				setIsVisible={setIsVisible}
				customClasses={'shadow-2xl border border-color-gray-200 rounded mt-[-102px] ml-[-180px]'}
			>
				<div className="w-[170px] p-1 rounded text-[13px]" onClick={(e) => e.stopPropagation()}>
					<div className="p-2 hover:bg-color-gray-300 cursor-pointer" onClick={handleStartPomo}>
						<div>Start Pomo</div>
					</div>

					<div className="p-2 hover:bg-color-gray-300 cursor-pointer" onClick={handleStartStopwatch}>
						<div>Start Stopwatch</div>
					</div>

					<div
						ref={dropdownEstimationRef}
						className="p-2 hover:bg-color-gray-300 cursor-pointer"
						onClick={() => setIsDropdownEstimationVisible(true)}
					>
						<div>Estimation</div>
					</div>
				</div>
			</Dropdown>

			<DropdownEstimation
				toggleRef={dropdownEstimationRef}
				isVisible={isDropdownEstimationVisible}
				setIsVisible={setIsDropdownEstimationVisible}
			/>
		</div>
	);
};

export default DropdownStartFocus;

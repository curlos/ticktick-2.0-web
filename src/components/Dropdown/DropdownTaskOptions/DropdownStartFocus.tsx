import { useRef, useState } from 'react';
import Dropdown from '../Dropdown';
import DropdownEstimation from './DropdownEstimation';
import { DropdownProps } from '../../../interfaces/interfaces';
import classNames from 'classnames';

interface DropdownStartFocusProps extends DropdownProps {
	dropdownEstimationCustomClasses?: string;
}

const DropdownStartFocus: React.FC<DropdownStartFocusProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	dropdownEstimationCustomClasses,
}) => {
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
				customClasses={classNames(
					'shadow-2xl border border-color-gray-200 rounded mt-[-102px] ml-[-180px]',
					customClasses
				)}
			>
				<div className="w-[170px] p-1 rounded text-[13px]" onClick={(e) => e.stopPropagation()}>
					<div className="p-2 hover:bg-color-gray-300 cursor-pointer" onClick={handleStartPomo}>
						<div>Start Pomo</div>
					</div>

					<div className="p-2 hover:bg-color-gray-300 cursor-pointer" onClick={handleStartStopwatch}>
						<div>Start Stopwatch</div>
					</div>

					<div className="relative">
						<div
							ref={dropdownEstimationRef}
							className="p-2 hover:bg-color-gray-300 cursor-pointer"
							onClick={() => setIsDropdownEstimationVisible(true)}
						>
							<div>Estimation</div>
						</div>

						<DropdownEstimation
							toggleRef={dropdownEstimationRef}
							isVisible={isDropdownEstimationVisible}
							setIsVisible={setIsDropdownEstimationVisible}
							customClasses={dropdownEstimationCustomClasses}
						/>
					</div>
				</div>
			</Dropdown>
		</div>
	);
};

export default DropdownStartFocus;

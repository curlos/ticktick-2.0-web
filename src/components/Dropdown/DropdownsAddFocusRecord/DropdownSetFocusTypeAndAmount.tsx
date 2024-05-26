import { useState } from 'react';
import Dropdown from '../Dropdown';
import { DropdownProps } from '../../../interfaces/interfaces';
import CustomInput from '../../CustomInput';

interface DropdownSetFocusTypeAndAmountProps extends DropdownProps {
	selectedTask: Object | null;
	setSelectedTask: React.Dispatch<React.SetStateAction<Object | null>>;
}

const DropdownSetFocusTypeAndAmount: React.FC<DropdownSetFocusTypeAndAmountProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	selectedTask,
	setSelectedTask,
}) => {
	const [selectedButton, setSelectedButton] = useState('pomo');
	const sharedButtonStyle = `text-[12px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
	const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666] bg-color-gray-300`;

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'w-[250px] p-1 shadow-2xl border border-color-gray-200 rounded-lg p-2'}
		>
			<div className="flex justify-center gap-1">
				<div
					className={selectedButton === 'pomo' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setSelectedButton('pomo')}
				>
					Pomo
				</div>
				<div
					className={selectedButton === 'stopwatch' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setSelectedButton('stopwatch')}
				>
					Stopwatch
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4 my-4">
				{selectedButton === 'pomo' ? (
					<div className="flex items-end gap-2">
						<CustomInput value={0} customClasses="w-[60px]" />
						<div>pomos</div>
					</div>
				) : (
					<>
						<div className="flex items-end gap-2">
							<CustomInput value={0} customClasses="w-[60px]" />
							<div>hours</div>
						</div>
						<div className="flex items-end gap-2">
							<CustomInput value={0} customClasses="w-[60px]" />
							<div>mins</div>
						</div>
					</>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<button
					className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200"
					onClick={() => {
						setIsVisible(false);
					}}
				>
					Cancel
				</button>
				<button
					className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600"
					onClick={() => {
						setIsVisible(false);
					}}
				>
					Ok
				</button>
			</div>
		</Dropdown>
	);
};

export default DropdownSetFocusTypeAndAmount;

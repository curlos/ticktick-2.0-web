/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react';
import Icon from '../Icon';
import 'react-circular-progressbar/dist/styles.css';
import PixelArtTimer from '../PixelArtTimer';
import Dropdown from '../Dropdown/Dropdown';
import ModalFocusSettings from '../Modal/ModalFocusSettings';
import { DropdownProps } from '../../interfaces/interfaces';
import PomodoroTimer from '../PomodoroTimer';

interface DropdownPrioritiesProps extends DropdownProps {
	setIsModalFocusSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownOptions: React.FC<DropdownPrioritiesProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	setIsModalFocusSettingsOpen,
}) => {
	// const [selectedView, setSelectedView] = useState('date');

	interface AdditionalOptionProps {
		text: string;
		iconName: string;
		onClick: () => void;
	}

	const AdditionalOption: React.FC<AdditionalOptionProps> = ({ text, iconName, onClick }) => {
		return (
			<div className="p-2 flex items-center gap-2 hover:bg-color-gray-300 cursor-pointer" onClick={onClick}>
				<Icon name={iconName} customClass={'!text-[18px] text-color-gray-100 hover:text-white'} fill={0} />
				<div className="text-[13px]">{text}</div>
			</div>
		);
	};

	return (
		<div className={`${isVisible ? '' : 'hidden'}`}>
			<Dropdown
				toggleRef={toggleRef}
				isVisible={isVisible}
				setIsVisible={setIsVisible}
				customClasses={'ml-[-125px] shadow-2xl !rounded border border-color-gray-200'}
			>
				<div className="w-[164px] p-1">
					<AdditionalOption text="Statistics" iconName="schedule" onClick={() => null} />
					<AdditionalOption
						text="Focus Settings"
						iconName="tune"
						onClick={() => {
							setIsVisible(false);
							setIsModalFocusSettingsOpen(true);
						}}
					/>
				</div>
			</Dropdown>
		</div>
	);
};

interface TopBarProps {
	selectedButton: string;
	setSelectedButton: React.Dispatch<React.SetStateAction<string>>;
	setIsModalFocusSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopBar: React.FC<TopBarProps> = ({ selectedButton, setSelectedButton, setIsModalFocusSettingsOpen }) => {
	const sharedButtonStyle = `py-1 px-4 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = `${sharedButtonStyle} bg-[#222735] text-[#4671F7] font-semibold`;
	const unselectedButtonStyle = `${sharedButtonStyle} text-[#666666]`;
	const [isDropdownFocusOptionsVisible, setIsDropdownFocusOptionsVisible] = useState(false);

	const dropdownOptionsRef = useRef(null);

	return (
		<div className="flex justify-between items-center">
			<div></div>

			<div className="flex gap-1 mx-[100px]">
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

			<div className="relative">
				<Icon
					toggleRef={dropdownOptionsRef}
					name="more_horiz"
					customClass={'text-color-gray-100 !text-[24px] rounded hover:bg-color-gray-300 cursor-pointer'}
					fill={0}
					onClick={() => setIsDropdownFocusOptionsVisible(!isDropdownFocusOptionsVisible)}
				/>
				<DropdownOptions
					toggleRef={dropdownOptionsRef}
					isVisible={isDropdownFocusOptionsVisible}
					setIsVisible={setIsDropdownFocusOptionsVisible}
					setIsModalFocusSettingsOpen={setIsModalFocusSettingsOpen}
				/>
			</div>
		</div>
	);
};

const FocusTimer = () => {
	const [selectedButton, setSelectedButton] = useState('pomo');
	const [isModalFocusSettingsOpen, setIsModalFocusSettingsOpen] = useState(false);

	return (
		<div className="w-full h-full overflow-auto no-scrollbar max-h-screen bg-color-gray-700">
			<div className="p-4 h-full border-l border-r border-color-gray-200 flex flex-col">
				<TopBar
					selectedButton={selectedButton}
					setSelectedButton={setSelectedButton}
					setIsModalFocusSettingsOpen={setIsModalFocusSettingsOpen}
				/>
				<div className="flex-1 flex justify-center items-center">
					{selectedButton === 'pomo' ? (
						<PomodoroTimer selectedButton={selectedButton} />
					) : (
						<PixelArtTimer gap="1px" />
					)}
				</div>
			</div>

			<ModalFocusSettings isModalOpen={isModalFocusSettingsOpen} setIsModalOpen={setIsModalFocusSettingsOpen} />
		</div>
	);
};

export default FocusTimer;

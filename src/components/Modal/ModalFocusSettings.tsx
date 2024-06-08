import { useEffect, useRef, useState } from 'react';
import CustomInput from '../CustomInput';
import Icon from '../Icon';
import Modal from './Modal';

interface ModalFocusSettingsProps {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalFocusSettings: React.FC<ModalFocusSettingsProps> = ({ isModalOpen, setIsModalOpen }) => {
	const syncAcrossDevicesRef = useRef(null);

	// TODO: Controlling the "sliding checkbox" through React State seems to pose some problems because it re-mounts the component which kind of "cancels" the sliding CSS animation which is why I have to handle it differently. Need to properly investigate this as I definitely don't want to remove the animation but also still need to handle the state changes correctly.
	const [focusSettings, setFocusSettings] = useState({
		syncAcrossDevices: false,
		pomoDuration: 45,
		shortBreakDuration: 10,
		longBreakDuration: 30,
		pomosPerLongBreak: 2,
		nextPomo: true,
		break: true,
		autoPomoCycle: 2,
		pomoSound: true,
	});

	useEffect(() => {
		// TODO: Need to come back to this when I start setting up the focus settings API on the backend.
		const fetchFocusSettingsFromApi = () => {
			return;
		};

		fetchFocusSettingsFromApi();
	}, []);

	const [syncAcrossDevices, setSyncAcrossDevices] = useState(true);

	// Timer Options
	const [pomoDuration, setPomoDuration] = useState(45);
	const [shortBreakDuration, setShortBreakDuration] = useState(10);
	const [longBreakDuration, setLongBreakDuration] = useState(30);
	const [pomosPerLongBreak, setPomosPerLongBreak] = useState(2);

	// Auto-Start
	const [nextPomo, setNextPomo] = useState(true);
	const [pomoBreak, setPomoBreak] = useState(true);
	const [autoPomoCycle, setAutoPomoCycle] = useState(2);

	// Pomo Sound
	const [pomoSound, setPomoSound] = useState(true);

	interface TimerOptionProps {
		text: string;
		value: number;
		setValue: React.Dispatch<React.SetStateAction<number>>;
		valueType: string;
	}

	const TimerOption: React.FC<TimerOptionProps> = ({ text, value, setValue, valueType }) => (
		<div className="flex justify-between items-center p-3">
			<div>{text}</div>
			<div className="flex items-end gap-2 w-[120px]">
				<CustomInput value={value} setValue={setValue} customClasses={'max-w-[70px] !text-left !text-[12px]'} />
				<div className="text-[12px] text-color-gray-100 mb-[2px]">{valueType}</div>
			</div>
		</div>
	);

	interface CheckboxOptionProps {
		text: string;
		backendPropName: string;
		checked: boolean;
		setChecked: React.Dispatch<React.SetStateAction<boolean>>;
		iconElem?: React.ReactNode;
		inputRef: React.LegacyRef<HTMLInputElement> | undefined;
	}

	const CheckboxOption: React.FC<CheckboxOptionProps> = ({ text, backendPropName, iconElem, inputRef }) => {
		const handleChange = (event) => {
			// console.log(event.target.checked);
			// console.log(backendPropName);
		};

		return (
			<div className="flex items-center justify-between">
				{/* TODO: Make this a prop instead! */}
				<div className="flex items-center gap-[2px]">
					<div>{text}</div>
					{iconElem ? iconElem : null}
				</div>

				<label className="inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						className="sr-only peer"
						ref={inputRef}
						onChange={handleChange}
						defaultChecked={focusSettings[backendPropName]}
					/>
					<div className="relative w-11 h-6 peer-focus:outline-none rounded-full peer dark:bg-color-gray-200 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				</label>
			</div>
		);
	};

	return (
		<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-650 p-5">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-bold text-[16px]">Focus Settings</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={() => setIsModalOpen(false)}
					/>
				</div>

				{/* TODO: Removing this for now but could be an interesting feature to implement in the future. Not required though. */}
				{/* <div className="p-3 bg-color-gray-600 rounded-lg">
					<CheckboxOption
						text="Sync Across Devices"
						backendPropName="syncAcrossDevices"
						iconElem={
							<Icon
								name="star"
								customClass={'!text-[18px] text-yellow-500 hover:text-white cursor-pointer'}
							/>
						}
						inputRef={syncAcrossDevicesRef}
					/>

					<div className="mt-2 text-color-gray-100 text-[12px]">
						If enabled, the status of the Focus will be synced across all devices.
					</div>
				</div> */}

				{/* Timer Option */}

				<div className="mt-4">
					<h4 className="font-bold mb-3 ml-2">Timer Option</h4>

					<div className="bg-color-gray-600 rounded-lg">
						<TimerOption
							text={'Pomo Duration'}
							value={pomoDuration}
							setValue={setPomoDuration}
							valueType={'Minutes'}
						/>
						<TimerOption
							text={'Short Break Duration'}
							value={shortBreakDuration}
							setValue={setShortBreakDuration}
							valueType={'Minutes'}
						/>
						<TimerOption
							text={'Long Break Duration'}
							value={longBreakDuration}
							setValue={setLongBreakDuration}
							valueType={'Minutes'}
						/>
						<TimerOption
							text={'Pomos per long break'}
							value={pomosPerLongBreak}
							setValue={setPomosPerLongBreak}
							valueType={'Pomos'}
						/>
					</div>
				</div>

				{/* Auto-Start */}
				<div className="mt-4">
					<h4 className="font-bold mb-3 ml-2">Auto-Start</h4>

					<div className="bg-color-gray-600 rounded-lg">
						<div className="p-3">
							<CheckboxOption text="Next Pomo" backendPropName="nextPomo" />
						</div>
						<div className="p-3">
							<CheckboxOption text="Break" backendPropName="break" />
						</div>
						<TimerOption
							text={'Auto-Pomo Cycle'}
							value={autoPomoCycle}
							setValue={setAutoPomoCycle}
							valueType={'Times'}
						/>
					</div>
				</div>

				{/* Pomo Sound */}
				<div className="mt-4">
					<h4 className="font-bold mb-3 ml-2">Pomo Sound</h4>

					<div className="bg-color-gray-600 rounded-lg">
						<div className="p-3">
							<CheckboxOption text="Pomo Sound" backendPropName="pomoSound" />
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalFocusSettings;

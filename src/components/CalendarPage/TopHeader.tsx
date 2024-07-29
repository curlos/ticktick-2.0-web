import { useDispatch } from 'react-redux';
import Icon from '../Icon';
import { setModalState } from '../../slices/modalSlice';
import DropdownIntervalSelect from './DropdownIntervalSelect';
import { useRef, useState } from 'react';

const TopHeader = () => {
	const dispatch = useDispatch();

	const dropdownIntervalSelectRef = useRef(null);
	const [isDropdownIntervalSelectVisible, setIsDropdownIntervalSelectVisible] = useState(false);
	const [selectedInterval, setSelectedInterval] = useState('Day');

	return (
		<div className="p-3 pt-5 flex justify-between items-center">
			<div className="flex items-center gap-2">
				<Icon name="left_panel_open" fill={0} customClass="text-color-gray-100 cursor-pointer" />
				<div className="text-[18px] font-bold">July 2024</div>
			</div>

			<div className="flex items-center gap-3">
				<Icon
					name="add"
					customClass="text-color-gray-100 !text-[18px] p-1 border border-color-gray-150 rounded cursor-pointer hover:text-blue-500"
					onClick={() => dispatch(setModalState({ modalId: 'ModalAddTaskForm', isOpen: true }))}
				/>

				<div className="relative">
					<div
						ref={dropdownIntervalSelectRef}
						onClick={() => setIsDropdownIntervalSelectVisible(!isDropdownIntervalSelectVisible)}
						className="border border-color-gray-150 py-1 pl-3 pr-2 rounded hover:text-blue-500 flex items-center gap-[2px] cursor-pointer"
					>
						<span>{selectedInterval}</span>
						<Icon name="keyboard_arrow_down" customClass="text-color-gray-100 !text-[18px]" />
					</div>

					<DropdownIntervalSelect
						toggleRef={dropdownIntervalSelectRef}
						isVisible={isDropdownIntervalSelectVisible}
						setIsVisible={setIsDropdownIntervalSelectVisible}
						selected={selectedInterval}
						setSelected={setSelectedInterval}
					/>
				</div>

				<div>
					<div className="border border-color-gray-150 py-1 px-2 rounded flex items-center cursor-pointer justify-between gap-3">
						<Icon
							name="keyboard_arrow_up"
							customClass="text-color-gray-100 !text-[18px] hover:text-blue-500"
						/>
						<span className="hover:text-blue-500">Today</span>
						<Icon
							name="keyboard_arrow_down"
							customClass="text-color-gray-100 !text-[18px] hover:text-blue-500"
						/>
					</div>
				</div>

				<Icon
					name="more_horiz"
					customClass="text-color-gray-100 !text-[20px] cursor-pointer hover:text-blue-500 p-1 rounded hover:bg-color-gray-300"
				/>
			</div>
		</div>
	);
};

export default TopHeader;

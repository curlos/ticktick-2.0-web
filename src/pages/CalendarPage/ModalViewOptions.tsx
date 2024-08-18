import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal/Modal';
import { setModalState } from '../../slices/modalSlice';
import { useRef, useState } from 'react';
import DropdownGeneralSelect from '../StatsPage/DropdownGeneralSelect';
import CustomCheckbox from '../../components/CustomCheckbox';

const ModalViewOptions: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalViewOptions']);
	const dispatch = useDispatch();

	const dropdownRef = useRef(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [selectedColorsType, setSelectedColorsType] = useState('Projects');
	const selectedColorsTypeOptions = ['Projects', 'Priority', 'Tags'];
	const [selectedTasksToShow, setSelectedTasksToShow] = useState({
		showCompleted: {
			name: 'Show Completed',
			isChecked: false,
		},
		showCheckItem: {
			name: 'Show Check Item',
			isChecked: false,
		},
		showAllRepeatCycle: {
			name: 'Show All Repeat Cycle',
			isChecked: false,
		},
		showHabit: {
			name: 'Show Habit',
			isChecked: false,
		},
		showFocusRecords: {
			name: 'Show Focus Records',
			isChecked: false,
		},
		showWeekends: {
			name: 'Show Weekends',
			isChecked: false,
		},
	});

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalViewOptions', isOpen: false }));

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-650">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">View Options</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					{/* Colors */}
					<div className="font-bold">Colors</div>
					<p className="m-0 text-color-gray-100">
						Colors of the task block in the calendar view can be displayed according to lists, tags, and
						priorities.
					</p>

					<div className="relative mt-2">
						<div
							className="flex justify-between items-center gap-[2px] border border-color-gray-200 px-2 py-1 rounded-md cursor-pointer"
							onClick={() => setIsDropdownVisible(!isDropdownVisible)}
						>
							<div>{selectedColorsType}</div>
							<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
						</div>

						<DropdownGeneralSelect
							toggleRef={dropdownRef}
							isVisible={isDropdownVisible}
							setIsVisible={setIsDropdownVisible}
							selected={selectedColorsType}
							setSelected={setSelectedColorsType}
							selectedOptions={selectedColorsTypeOptions}
							customClasses={'!w-full'}
						/>
					</div>

					{/* Tasks */}
					<div className="font-bold mt-6 mb-2">Tasks</div>
					<div className="space-y-1">
						{Object.keys(selectedTasksToShow).map((taskToShowKey) => {
							const taskToShowValue = selectedTasksToShow[taskToShowKey];
							const { name, isChecked } = taskToShowValue;

							return (
								<CustomCheckbox
									isChecked={isChecked}
									setIsChecked={(newCheckedValue) => {
										setSelectedTasksToShow({
											...selectedTasksToShow,
											[taskToShowKey]: {
												...selectedTasksToShow[taskToShowKey],
												isChecked: newCheckedValue,
											},
										});
									}}
									label={name}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalViewOptions;

import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import Icon from '../Icon';
import { useState } from 'react';

const ModalEditHabitSettings: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalEditHabitSettings']);
	const dispatch = useDispatch();

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalEditHabitSettings', isOpen: false }));

	const [isChecked, setIsChecked] = useState(true);

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center">
			<div className="bg-color-gray-600 rounded-lg">
				<div className="flex items-center justify-between p-5">
					<h3 className="font-bold text-[16px]">Habit Settings</h3>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={closeModal}
					/>
				</div>

				<hr className="border-color-gray-200" />

				<div className="p-5">
					<CustomCheckbox
						isChecked={isChecked}
						setIsChecked={setIsChecked}
						label={`Show in "Today" & "Next 7 Days"`}
					/>
				</div>

				<hr className="border-color-gray-200" />

				<div className="flex justify-end">
					<div className="p-3 border-t border-color-gray-200 flex gap-2">
						<button
							className="flex-1 border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							className="flex-1 bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
							onClick={() => {
								// TODO: Send backend call to edit habit settings.
								closeModal();
							}}
						>
							Ok
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

const CustomCheckbox = ({ isChecked, setIsChecked, label }) => {
	// Function to handle change when the div or checkbox is clicked
	const handleChange = () => {
		// Toggle the current checked state
		setIsChecked(!isChecked);
	};

	return (
		<div className="flex items-center gap-2 cursor-pointer rounded" onClick={handleChange}>
			<input
				type="checkbox"
				name="Achieve it all"
				className="accent-blue-500"
				checked={isChecked}
				onChange={handleChange} // Using the same handleChange function for consistency
				onClick={(e) => e.stopPropagation()} // Prevent the event from bubbling up to the div's onClick
			/>
			<span className="font-medium">{label}</span>
		</div>
	);
};

export default ModalEditHabitSettings;

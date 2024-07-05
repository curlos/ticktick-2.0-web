import classNames from 'classnames';
import Modal from '../Modal';
import Icon from '../../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../../slices/modalSlice';
import CustomInput from '../../CustomInput';
import { useState } from 'react';
import useHandleError from '../../../hooks/useHandleError';
import FrequencySection from './FrequencySection';
import GoalSection from './GoalSection';

const ModalAddHabit: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddHabit']);
	const dispatch = useDispatch();
	const handleError = useHandleError();

	const [name, setName] = useState('');

	if (!modal) {
		return null;
	}

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddHabit', isOpen: false }));
	};

	const {
		isOpen,
		props: { item },
	} = modal;

	return (
		<Modal isOpen={isOpen} onClose={closeModal} positionClasses="!items-start mt-[150px]" customClasses="my-[2px]">
			<div className="rounded-xl shadow-lg bg-color-gray-600">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">Create Habit</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<CustomInput
							value={name}
							placeholder="Name"
							setValue={setName}
							customClasses="!text-left  p-[6px] px-3"
						/>

						<FrequencySection />
						<GoalSection />
					</div>

					{/* Close and Save buttons */}
					<div className="mt-7 flex justify-end gap-2">
						<button
							className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={closeModal}
						>
							Close
						</button>
						<button
							className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
							onClick={() => console.log('')}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAddHabit;

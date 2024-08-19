import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import Icon from '../Icon';
import { useEffect, useState } from 'react';
import useHandleError from '../../hooks/useHandleError';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import CustomCheckbox from '../CustomCheckbox';

const ModalEditHabitSettings: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalEditHabitSettings']);
	const dispatch = useDispatch();
	const handleError = useHandleError();

	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	useEffect(() => {
		if (userSettings) {
			const { habit } = userSettings;
			setShowInTimedSmartLists(habit.showInTimedSmartLists);
		} else {
			setShowInTimedSmartLists(true);
		}
	}, [userSettings]);

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalEditHabitSettings', isOpen: false }));

	const [showInTimedSmartLists, setShowInTimedSmartLists] = useState(true);

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
						isChecked={showInTimedSmartLists}
						setIsChecked={setShowInTimedSmartLists}
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
								handleError(async () => {
									const payload = {
										habit: {
											...userSettings.habit,
											showInTimedSmartLists,
										},
									};

									await editUserSettings(payload).unwrap();
									closeModal();
								});
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

export default ModalEditHabitSettings;

import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import Icon from '../Icon';
import { useRef, useState } from 'react';
import classNames from 'classnames';
import ModalChangePassword from './ModalChangePassword';
import Dropdown from '../Dropdown/Dropdown';
import ModalChangeEmail from './ModalChangeEmail';
import { useGetLoggedInUserQuery } from '../../services/api';

const ModalAccountSettings: React.FC = () => {
	const { data: loggedInUser, error, isLoading } = useGetLoggedInUserQuery();
	const modal = useSelector((state) => state.modals.modals['ModalAccountSettings']);
	const dispatch = useDispatch();

	const [selectedOption, setSelectedOption] = useState('Account');

	const dropdownChangeEmailRef = useRef(null);

	// useState - Dropdowns
	const [isDropdownChangeEmailVisible, setIsDropdownChangeEmailVisible] = useState(false);

	// useState - Modals
	const [isModalChangeEmailOpen, setIsModalChangeEmailOpen] = useState(false);
	const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false);

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;

	const closeModal = () => dispatch(setModalState({ modalId: 'ModalAccountSettings', isOpen: false }));

	const SettingsOption = ({ iconName, optionName }) => (
		<div
			className={classNames(
				'flex items-center gap-1 rounded-lg p-2 cursor-pointer',
				selectedOption === optionName ? 'bg-color-gray-300' : ''
			)}
			onClick={() => setSelectedOption(optionName)}
		>
			<Icon
				name={iconName}
				customClass={'!text-[22px] cursor-pointer text-color-gray-100 hover:text-white'}
				onClick={closeModal}
			/>
			<div>{optionName}</div>
		</div>
	);

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center" customClasses="!w-[722px]">
			<div className="rounded-lg shadow-lg flex w-full border border-color-gray-200">
				<div className="flex-[3] bg-color-gray-700 p-3 rounded-l-lg">
					<h3 className="font-medium text-[16px] mb-2">Settings</h3>
					<SettingsOption iconName="account_circle" optionName="Account" />
				</div>

				<div className="flex-[8] bg-color-gray-650 rounded-r-lg max-h-[580px] h-[580px] p-3">
					<div className="flex justify-end">
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div className="flex justify-center items-center">
						<div className="text-center">
							<div className="rounded-full bg-black p-[6px] mb-3 cursor-pointer">
								<img src="/prestige-9-bo2.png" alt="user-icon" className="w-[65px] h-[65px]" />
							</div>

							<div className="font-bold">
								{loggedInUser?.nickname ? loggedInUser?.nickname : loggedInUser?.email}
							</div>
						</div>
					</div>

					<div className="bg-color-gray-300 rounded-lg p-2 px-3 space-y-3 mt-6">
						<div className="flex justify-between items-center">
							<div>Email</div>
							<div className="relative">
								<div
									ref={dropdownChangeEmailRef}
									onClick={() => setIsDropdownChangeEmailVisible(!isDropdownChangeEmailVisible)}
									className="cursor-pointer hover:bg-color-gray-200 p-1 rounded"
								>
									{loggedInUser?.email}
								</div>

								<DropdownChangeEmail
									toggleRef={dropdownChangeEmailRef}
									isVisible={isDropdownChangeEmailVisible}
									setIsVisible={setIsDropdownChangeEmailVisible}
									setIsModalChangeEmailOpen={setIsModalChangeEmailOpen}
								/>
							</div>
						</div>

						<div className="flex justify-between items-center">
							<div>Password</div>
							<div
								className="cursor-pointer text-blue-500"
								onClick={() => setIsModalChangePasswordOpen(true)}
							>
								Change Password
							</div>
						</div>
					</div>
				</div>
			</div>

			<ModalChangeEmail isModalOpen={isModalChangeEmailOpen} setIsModalOpen={setIsModalChangeEmailOpen} />

			<ModalChangePassword
				isModalOpen={isModalChangePasswordOpen}
				setIsModalOpen={setIsModalChangePasswordOpen}
			/>
		</Modal>
	);
};

const DropdownChangeEmail = ({ toggleRef, isVisible, setIsVisible, setIsModalChangeEmailOpen }) => {
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded')}
		>
			<div className="w-[150px] p-1">
				<div
					className="p-1 hover:bg-color-gray-300 cursor-pointer rounded"
					onClick={() => {
						setIsVisible(false);
						setIsModalChangeEmailOpen(true);
					}}
				>
					Change Email
				</div>
			</div>
		</Dropdown>
	);
};

export default ModalAccountSettings;

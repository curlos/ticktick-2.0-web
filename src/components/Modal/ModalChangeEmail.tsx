import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import Icon from '../Icon';
import { useState } from 'react';
import classNames from 'classnames';

const ModalChangeEmail: React.FC = ({ isModalOpen, setIsModalOpen }) => {
	const [newEmail, setNewEmail] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [verificationCode, setVerificationCode] = useState('');

	console.log(currentPassword);

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={() => setIsModalOpen(false)}
			position="top-center"
			customClasses="!w-[400px]"
		>
			<div className="rounded-lg shadow-lg w-full bg-color-gray-650 p-5">
				<div className="flex justify-between items-center w-full">
					<h2 className="font-bold text-[16px]">Change Email</h2>
					<Icon
						name="close"
						customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
						onClick={() => setIsModalOpen(false)}
					/>
				</div>

				<div className="mt-5 space-y-2">
					<CustomInput placeholder="New Email" value={newEmail} setValue={setNewEmail} />
					<CustomInput
						placeholder="Verification Code"
						value={verificationCode}
						setValue={setVerificationCode}
						isVerificationCodeInput={true}
						newEmail={newEmail}
					/>
					<CustomInput placeholder="Current Password" value={currentPassword} setValue={setCurrentPassword} />
				</div>

				<div className="flex justify-end items-center mt-8">
					<div className="grid grid-cols-2 w-[50%] space-x-3">
						<button
							className="border border-color-gray-200 p-[2px] rounded hover:bg-color-gray-200"
							onClick={() => setIsModalOpen(false)}
						>
							Cancel
						</button>
						<button
							disabled={!currentPassword}
							className="border border-transparent bg-blue-500 p-[2px] rounded hover:bg-blue-500 disabled:opacity-50"
						>
							Ok
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

const CustomInput = ({ placeholder, value, setValue, isVerificationCodeInput, newEmail }) => (
	<div className="flex">
		<input
			placeholder={placeholder}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			className={classNames(
				'text-[14px] p-[6px] bg-transparent placeholder:text-color-gray-100 border border-color-gray-200 mb-0 w-full resize-none outline-none focus:border-blue-500',
				isVerificationCodeInput ? 'rounded-l' : 'rounded'
			)}
		/>
		{isVerificationCodeInput ? (
			<button
				disabled={!newEmail}
				className="border border-transparent bg-blue-500 p-[2px] rounded-r hover:bg-blue-500 disabled:bg-transparent disabled:border disabled:border-color-gray-200 disabled:text-color-gray-100 w-[130px] cursor-pointer"
			>
				Send Code
			</button>
		) : null}
	</div>
);

export default ModalChangeEmail;

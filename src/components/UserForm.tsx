import { useForm } from 'react-hook-form';
import Icon from './Icon';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setModalState } from '../slices/modalSlice';
import { useLoginUserMutation, useRegisterUserMutation } from '../services/resources/usersApi';

const UserForm = ({ mode }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	// Selecting the correct mutation based on the mode
	const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
	const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();

	const isLoading = mode === 'login' ? isLoginLoading : isRegisterLoading;

	const onSubmit = async (data) => {
		try {
			if (mode === 'login') {
				await loginUser(data).unwrap();
			} else {
				await registerUser(data).unwrap();
			}

			navigate('/projects/all/tasks');
		} catch (error) {
			dispatch(setModalState({ modalId: 'ModalErrorMessenger', isOpen: true, props: { error } }));
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 w-[400px] bg-color-gray-300 p-10 rounded"
		>
			{mode === 'register' && (
				<div>
					<div className="flex items-center gap-2 border-b border-color-gray-100 py-2">
						<Icon name="person" customClass={'!text-[20px] '} />
						<input
							id="nickname"
							type="text"
							placeholder="Nickname (optional)"
							{...register('nickname')}
							className="w-full text-[14px] p-1 bg-transparent placeholder:text-color-gray-100 mb-0 w-full resize-none outline-none rounded"
						/>
					</div>
					{errors.nickname && <p className="text-red-500">{errors.nickname.message}</p>}
				</div>
			)}
			<div>
				<div className="flex items-center gap-2 border-b border-color-gray-100 py-2">
					<Icon name="email" customClass={'!text-[20px] '} />
					<input
						id="email"
						type="email"
						placeholder="Email"
						{...register('email', { required: 'Email is required' })}
						className="w-full text-[14px] p-1 bg-transparent placeholder:text-color-gray-100 mb-0 w-full resize-none outline-none rounded"
					/>
				</div>
				{errors.email && <p className="text-red-500">{errors.email.message}</p>}
			</div>
			<div>
				<div className="flex items-center gap-2 border-b border-color-gray-100 py-2">
					<Icon name="lock" customClass={'!text-[20px] '} />
					<input
						id="password"
						type="password"
						placeholder="Password"
						{...register('password', { required: 'Password is required' })}
						className="w-full text-[14px] p-1 bg-transparent placeholder:text-color-gray-100 mb-0 w-full resize-none outline-none rounded"
					/>
				</div>
				{errors.password && <p className="text-red-500">{errors.password.message}</p>}
			</div>
			<button type="submit" disabled={isLoading} className="bg-blue-500 w-full rounded p-2 mt-4">
				{mode === 'login' ? 'Login' : 'Sign Up'}
			</button>

			<div className="text-center">
				{mode === 'register' ? (
					<div>
						Have an account already?{' '}
						<Link to="/login" className="text-blue-500 cursor-pointer hover:underline">
							Sign in
						</Link>
					</div>
				) : (
					<Link to="/signup" className="text-blue-500 cursor-pointer hover:underline">
						Sign Up for Free
					</Link>
				)}
			</div>
		</form>
	);
};

export default UserForm;

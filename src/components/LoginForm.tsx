// src/components/LoginForm.js
import React, { useState } from 'react';
import { useLoginUserMutation } from '../services/api';

const LoginForm = () => {
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const [loginUser, { isLoading }] = useLoginUserMutation();

	const handleLogin = async (e) => {
		e.preventDefault();
		await loginUser(credentials);
	};

	return (
		<form onSubmit={handleLogin}>
			<input
				type="email"
				placeholder="Email"
				value={credentials.email}
				onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
			/>
			<input
				type="password"
				placeholder="Password"
				value={credentials.password}
				onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
			/>
			<button type="submit" disabled={isLoading}>
				Login
			</button>
		</form>
	);
};

export default LoginForm;

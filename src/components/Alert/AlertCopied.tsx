import React, { useEffect, useState } from 'react';
import Alert from './Alert';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertState } from '../../slices/alertSlice';

const AlertCopied = () => {
	const alert = useSelector((state) => state.alerts.alerts['AlertCopied']);
	const dispatch = useDispatch();

	const { isOpen } = alert;

	useEffect(() => {
		if (isOpen) {
			// Set a timer to hide the alert after 1 second
			const timer = setTimeout(() => {
				dispatch(setAlertState({ alertId: 'AlertCopied', isOpen: false }));
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!alert) {
		return null;
	}

	return (
		<Alert isOpen={isOpen} position="bottom-center" customClasses="flex justify-center items-center">
			Copied!
		</Alert>
	);
};

export default AlertCopied;

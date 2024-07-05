import React, { useEffect, useState } from 'react';
import Alert from './Alert';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertState } from '../../slices/alertSlice';

const AlertGeneralMessage = () => {
	const alert = useSelector((state) => state.alerts.alerts['AlertGeneralMessage']);
	const dispatch = useDispatch();

	console.log(alert);

	const { isOpen } = alert;

	useEffect(() => {
		if (isOpen) {
			// Set a timer to hide the alert after 1 second
			const timer = setTimeout(() => {
				dispatch(setAlertState({ alertId: 'AlertGeneralMessage', isOpen: false }));
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!alert) {
		return null;
	}

	const {
		props: { message },
	} = alert;

	return (
		<Alert isOpen={isOpen} position="bottom-center" customClasses="flex justify-center items-center">
			{message}
		</Alert>
	);
};

export default AlertGeneralMessage;

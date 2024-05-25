import React, { useEffect, useState } from 'react';
import Alert from './Alert';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertState } from '../../slices/alertSlice';
import Icon from '../Icon';
import { useFlagTaskMutation } from '../../services/api';

const AlertFlagged = () => {
	const alert = useSelector((state) => state.alerts.alerts['AlertFlagged']);
	const [flagTask] = useFlagTaskMutation();
	const dispatch = useDispatch();

	// TODO: Pass in a task to the props and use that to undo the task as well as get the task's name.
	const { isOpen, props } = alert;

	useEffect(() => {
		if (isOpen) {
			// Set a timer to hide the alert after 1 second
			const timer = setTimeout(() => {
				dispatch(setAlertState({ alertId: 'AlertFlagged', isOpen: false }));
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!alert || !props || !props.task) {
		return null;
	}

	const duration = {
		open: 0.2,
		close: 3,
	};

	const { task, parentId, flaggedPropertyName } = props;

	const getMessage = () => {
		let message = '';
		switch (flaggedPropertyName) {
			case 'isDeleted':
				message += 'Deleted';
				break;
			case 'willNotDo':
				message += "Won't do";
				break;
			default:
				message += '';
				break;
		}

		message += ` "${task.title}"`;

		return message;
	};

	return (
		<Alert
			isOpen={isOpen}
			position="bottom-center"
			customClasses="flex justify-center items-center"
			duration={duration}
		>
			<div className="flex items-center gap-3">
				<div>{getMessage()}</div>
				<Icon
					name="undo"
					fill={0}
					customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer text-yellow-500'}
					onClick={() => {
						flagTask({
							taskId: task._id,
							parentId,
							property: flaggedPropertyName,
							value: null,
						});
						dispatch(setAlertState({ alertId: 'AlertFlagged', isOpen: false }));
					}}
				/>
			</div>
		</Alert>
	);
};

export default AlertFlagged;

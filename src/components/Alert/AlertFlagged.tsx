import React, { useEffect, useState } from 'react';
import Alert from './Alert';
import { useDispatch, useSelector } from 'react-redux';
import { setAlertState } from '../../slices/alertSlice';
import Icon from '../Icon';
import { useFlagTaskMutation } from '../../services/resources/tasksApi';
import { useFlagHabitMutation } from '../../services/resources/habitsApi';
import useHandleError from '../../hooks/useHandleError';

const AlertFlagged = () => {
	const handleError = useHandleError();

	const alert = useSelector((state) => state.alerts.alerts['AlertFlagged']);

	const [flagTask] = useFlagTaskMutation();
	const [flagHabit] = useFlagHabitMutation();

	const dispatch = useDispatch();

	const { isOpen, props } = alert;

	useEffect(() => {
		if (isOpen) {
			// Set a timer to hide the alert after 1 second
			const timer = setTimeout(() => {
				dispatch(setAlertState({ alertId: 'AlertFlagged', isOpen: false }));
			}, 2500);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!alert || !props || (!props.task && !props.habit)) {
		return null;
	}

	const duration = {
		open: 0.2,
		close: 3,
	};

	const { task, parentId, habit, flaggedPropertyName } = props;

	const getMessage = () => {
		let message = '';

		if (task) {
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
		} else if (habit) {
			switch (flaggedPropertyName) {
				case 'isArchived':
					message += 'Archived';
					break;
				default:
					message += '';
					break;
			}

			message += ` "${habit.name}"`;
		}

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
						if (task) {
							handleError(async () => {
								await flagTask({
									taskId: task._id,
									parentId,
									property: flaggedPropertyName,
									value: null,
								}).unwrap();
							});
						} else if (habit) {
							handleError(async () => {
								await flagHabit({
									habitId: habit._id,
									property: flaggedPropertyName,
									value: null,
								}).unwrap();
							});
						}
						dispatch(setAlertState({ alertId: 'AlertFlagged', isOpen: false }));
					}}
				/>
			</div>
		</Alert>
	);
};

export default AlertFlagged;

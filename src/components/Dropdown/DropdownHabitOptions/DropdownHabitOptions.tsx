import { useRef, useState } from 'react';
import { setModalState } from '../../../slices/modalSlice';
import Icon from '../../Icon';
import Dropdown from '../Dropdown';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { DropdownProps, TaskObj } from '../../../interfaces/interfaces';
import { setAlertState } from '../../../slices/alertSlice';
import {
	useFlagHabitMutation,
	useGetHabitsQuery,
	usePermanentlyDeleteHabitMutation,
} from '../../../services/resources/habitsApi';
import DropdownStartFocus from '../DropdownTaskOptions/DropdownStartFocus';
import useHandleError from '../../../hooks/useHandleError';

interface DropdownHabitOptionsProps extends DropdownProps {
	habit: Object;
}

// TODO: CHANGE EVERYTHING HERE FROM TASK TO HABIT RELATED

const DropdownHabitOptions: React.FC<DropdownHabitOptionsProps> = ({ toggleRef, isVisible, setIsVisible, habit }) => {
	const handleError = useHandleError();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { projectId } = useParams();

	// Habits
	const { data: fetchedHabits, isLoading: isLoadingGetHabits, error: errorGetHabits } = useGetHabitsQuery();
	const { habits, habitsById } = fetchedHabits || {};

	const [flagHabit] = useFlagHabitMutation();
	const [permanentlyDeleteHabit] = usePermanentlyDeleteHabitMutation();

	const [isDropdownStartFocusVisible, setIsDropdownStartFocusVisible] = useState(false);

	const dropdownStartFocusRef = useRef(null);

	const handleArchive = () => {
		handleError(async () => {
			const isDeletedTime = new Date().toISOString();
			await flagHabit({
				habitId: habit._id,
				property: 'isArchived',
				value: !habit.isArchived ? isDeletedTime : null,
			}).unwrap();
			setIsVisible(false);

			// Only show the alert if the task is about to be archived and we want to give the user the option to undo the archival.
			if (!habit.isArchived) {
				dispatch(
					setAlertState({
						alertId: 'AlertFlagged',
						isOpen: true,
						props: {
							habit: habit,
							flaggedPropertyName: 'isArchived',
						},
					})
				);

				navigate(`/habits/archived/${habit._id}`);
			} else {
				navigate(`/habits/${habit._id}`);
			}
		});
	};

	const handlePermanentlyDelete = () => {
		handleError(async () => {
			await permanentlyDeleteHabit({ habitId: habit._id }).unwrap();
			setIsVisible(false);
			navigate('/habits');
		});
	};

	const { isArchived } = habit;

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'shadow-2xl border border-color-gray-200 rounded ml-[-210px]'}
		>
			<div className="w-[232px] p-1 rounded text-[13px]" onClick={(e) => e.stopPropagation()}>
				<div
					className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer"
					onClick={() => {
						dispatch(setModalState({ modalId: 'ModalAddHabit', isOpen: true, props: { habit } }));
					}}
				>
					<Icon
						name="edit"
						customClass={
							'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
						}
						fill={0}
					/>
					<div>Edit</div>
				</div>
				<div
					ref={dropdownStartFocusRef}
					className="p-1 flex justify-between items-center hover:bg-color-gray-300 cursor-pointer"
					onClick={() => setIsDropdownStartFocusVisible(!isDropdownStartFocusVisible)}
				>
					<div className="flex items-center gap-[2px]">
						<Icon
							name="timer"
							customClass={
								'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
							}
							fill={0}
						/>
						<div>Start Focus</div>
					</div>

					<Icon
						name="chevron_right"
						customClass={
							'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
						}
						fill={0}
					/>
				</div>
				{/* Side Dropdown */}
				<DropdownStartFocus
					toggleRef={dropdownStartFocusRef}
					isVisible={isDropdownStartFocusVisible}
					setIsVisible={setIsDropdownStartFocusVisible}
				/>
				<div
					className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer"
					onClick={handleArchive}
				>
					<Icon
						name="delete"
						customClass={
							'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
						}
						fill={0}
					/>
					<div>{isArchived ? 'Pick up habit' : 'Archive'}</div>
				</div>

				<div
					className="p-1 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer"
					onClick={handlePermanentlyDelete}
				>
					<Icon
						name="delete"
						customClass={
							'text-color-gray-100 !text-[18px] p-1 rounded hover:bg-color-gray-300 cursor-pointer'
						}
						fill={0}
					/>
					<div>Delete</div>
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownHabitOptions;

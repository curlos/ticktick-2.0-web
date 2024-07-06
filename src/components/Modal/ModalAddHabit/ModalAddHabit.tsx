import classNames from 'classnames';
import Modal from '../Modal';
import Icon from '../../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../../slices/modalSlice';
import CustomInput from '../../CustomInput';
import { useState } from 'react';
import useHandleError from '../../../hooks/useHandleError';
import FrequencySection from './FrequencySection';
import GoalSection from './GoalSection';
import StartDateSection from './StartDateSection';
import GoalDaysSection from './GoalDaysSection';
import HabitSection from './HabitSection';
import ReminderSection from './ReminderSection';
import { useAddHabitMutation } from '../../../services/resources/habitsApi';

const DEFAULT_DAYS_OF_WEEK = [
	{ fullName: 'Monday', shortName: 'Mon', selected: true },
	{ fullName: 'Tuesday', shortName: 'Tue', selected: true },
	{ fullName: 'Wednesday', shortName: 'Wed', selected: true },
	{ fullName: 'Thursday', shortName: 'Thu', selected: true },
	{ fullName: 'Friday', shortName: 'Fri', selected: true },
	{ fullName: 'Saturday', shortName: 'Sat', selected: true },
	{ fullName: 'Sunday', shortName: 'Sun', selected: true },
];

const ModalAddHabit: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddHabit']);
	const dispatch = useDispatch();
	const handleError = useHandleError();

	const [addHabit] = useAddHabitMutation();

	const [name, setName] = useState('');

	// States - Frequency Section
	const [selectedInterval, setSelectedInterval] = useState('Daily');
	const [daysOfWeek, setDaysOfWeek] = useState(DEFAULT_DAYS_OF_WEEK);
	const [daysPerWeek, setDaysPerWeek] = useState(2);
	const [everyXDays, setEveryXDays] = useState(2);

	console.log(selectedInterval);
	console.log(daysOfWeek);
	console.log(daysPerWeek);
	console.log(everyXDays);

	if (!modal) {
		return null;
	}

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddHabit', isOpen: false }));
	};

	const {
		isOpen,
		props: { item },
	} = modal;

	return (
		<Modal isOpen={isOpen} onClose={closeModal} positionClasses="!items-start mt-[150px]" customClasses="my-[2px]">
			<div className="rounded-xl shadow-lg bg-color-gray-600">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">Create Habit</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<CustomInput
							value={name}
							placeholder="Name"
							setValue={setName}
							customClasses="!text-left  p-[6px] px-3"
						/>

						<FrequencySection
							selectedInterval={selectedInterval}
							setSelectedInterval={setSelectedInterval}
							daysOfWeek={daysOfWeek}
							setDaysOfWeek={setDaysOfWeek}
							daysPerWeek={daysPerWeek}
							setDaysPerWeek={setDaysPerWeek}
							everyXDays={everyXDays}
							setEveryXDays={setEveryXDays}
						/>

						<GoalSection />
						<StartDateSection />
						<GoalDaysSection />
						<HabitSection />
						<ReminderSection />
					</div>

					{/* Close and Save buttons */}
					<div className="mt-7 flex justify-end gap-2">
						<button
							className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={closeModal}
						>
							Close
						</button>
						<button
							className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
							onClick={() => {
								// TODO: CREATE HABIT!

								const payload = {
									name,
									frequency: {
										daily: {
											selected: selectedInterval.toLowerCase() === 'daily',
											daysOfWeek,
										},
										weekly: {
											selected: selectedInterval.toLowerCase() === 'weekly',
											daysPerWeek: Number,
										},
										interval: {
											selected: selectedInterval.toLowerCase() === 'interval',
											everyXDays: everyXDays,
										},
									},
								};

								console.log(payload);
								debugger;

								// handleError(async () => {
								// 	await addHabit(payload).unwrap();
								// });
							}}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAddHabit;

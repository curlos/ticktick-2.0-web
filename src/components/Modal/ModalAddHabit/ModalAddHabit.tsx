import classNames from 'classnames';
import Modal from '../Modal';
import Icon from '../../Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../../slices/modalSlice';
import CustomInput from '../../CustomInput';
import { useEffect, useRef, useState } from 'react';
import useHandleError from '../../../hooks/useHandleError';
import FrequencySection from './FrequencySection';
import GoalSection from './GoalSection';
import StartDateSection from './StartDateSection';
import GoalDaysSection from './GoalDaysSection';
import HabitSection from './HabitSection';
import ReminderSection from './ReminderSection';
import { useAddHabitMutation, useEditHabitMutation } from '../../../services/resources/habitsApi';
import { useGetHabitSectionsQuery } from '../../../services/resources/habitSectionsApi';
import DropdownHabitIcons from '../../Dropdown/DropdownHabitIcons';
import { HADES_KEEPSAKE_ICON_URLS } from '../../../utils/hadesIcons/keepsake';

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

	// Habits
	const [addHabit] = useAddHabitMutation();
	const [editHabit] = useEditHabitMutation();

	// Habit Sections
	const {
		data: fetchedHabitSections,
		isLoading: isLoadingGetHabitSections,
		error: errorGetHabitSections,
	} = useGetHabitSectionsQuery();
	const { habitSections, habitSectionsById } = fetchedHabitSections || {};

	// States - Name and Icon
	const [name, setName] = useState('');
	const [selectedIcon, setSelectedIcon] = useState(HADES_KEEPSAKE_ICON_URLS[13]);
	const dropdownHabitIconsRef = useRef(null);
	const [isDropdownHabitIconsVisible, setIsDropdownHabitIconsVisible] = useState(false);

	// States - Frequency Section
	const [selectedInterval, setSelectedInterval] = useState('Daily');
	const [daysOfWeek, setDaysOfWeek] = useState(DEFAULT_DAYS_OF_WEEK);
	const [daysPerWeek, setDaysPerWeek] = useState(2);
	const [everyXDays, setEveryXDays] = useState(2);

	// States - Goal Section
	const [goalType, setGoalType] = useState('achieveItAll');
	const [dailyValue, setDailyValue] = useState(1);
	const [dailyUnit, setDailyUnit] = useState('Count');
	const [whenChecking, setWhenChecking] = useState('Auto');

	// States - Start Date
	const [startDate, setStartDate] = useState(new Date());

	// States - Goal Days
	const [goalDays, setGoalDays] = useState(null);

	// States - Section
	const [section, setSection] = useState({});

	// States - Reminder
	const [reminderList, setReminderList] = useState([]);

	useEffect(() => {
		if (!habitSections) {
			return;
		}

		// TODO: Might have to reincoporate some of the old logic here so that when a new section is added, it uses that new section first and doesn't always just reset it to "Morning" upon adding a new section.
		// const sectionIsEmpty = !section || Object.keys(section).length === 0;
		const editingExistingHabit = modal?.props?.habit;

		if (editingExistingHabit) {
			const habit = editingExistingHabit;

			console.log(habit);
			debugger;

			const { name, frequency, goal, startDate, goalDays, habitSectionId, reminders, icon } = habit;

			setName(name);
			setSelectedIcon(icon ? icon : HADES_KEEPSAKE_ICON_URLS[13]);

			// States - Frequency Section
			setSelectedInterval(
				frequency.daily.selected
					? 'Daily'
					: frequency.weekly.selected
						? 'Weekly'
						: frequency.interval.selected
							? 'Interval'
							: 'Daily'
			);
			setDaysOfWeek(frequency.daily.daysOfWeek);
			setDaysPerWeek(frequency.weekly.daysPerWeek);
			setEveryXDays(frequency.interval.everyXDays);

			// States - Goal Section
			setGoalType(goal.achieveItAll.selected ? 'achieveItAll' : 'reachCertainAmount');
			setDailyValue(goal.reachCertainAmount.dailyValue);
			setDailyUnit(goal.reachCertainAmount.dailyUnit);
			setWhenChecking(goal.reachCertainAmount.whenChecking);

			// States - Start Date
			setStartDate(startDate ? new Date(startDate) : new Date());

			// States - Goal Days
			setGoalDays(goalDays);

			// States - Section
			setSection(habitSectionId ? habitSectionsById[habitSectionId] : habitSections[0]);

			// States - Reminder
			setReminderList(reminders.map((reminder) => new Date(reminder)));
		} else {
			resetAllStates();
		}
	}, [habitSections, modal?.props?.habit]);

	const resetAllStates = () => {
		setName('');
		setSelectedIcon(HADES_KEEPSAKE_ICON_URLS[13]);

		// States - Frequency Section
		setSelectedInterval('Daily');
		setDaysOfWeek(DEFAULT_DAYS_OF_WEEK);
		setDaysPerWeek(2);
		setEveryXDays(2);

		// States - Goal Section
		setGoalType('achieveItAll');
		setDailyValue(1);
		setDailyUnit('Count');
		setWhenChecking('Auto');

		// States - Start Date
		setStartDate(new Date());

		// States - Goal Days
		setGoalDays(null);

		// States - Section
		setSection(habitSections ? habitSections[0] : {});

		// States - Reminder
		setReminderList([]);
	};

	if (!modal) {
		return null;
	}

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddHabit', isOpen: false }));
	};

	const {
		isOpen,
		props: { habit },
	} = modal;

	const editingExistingHabit = habit;

	console.log(everyXDays);

	return (
		<Modal isOpen={isOpen} onClose={closeModal} positionClasses="!items-start mt-[150px]" customClasses="my-[2px]">
			<div className="rounded-xl shadow-lg bg-color-gray-600">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">{editingExistingHabit ? 'Edit' : 'Create'} Habit</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex items-center">
							<div className="w-[96px] relative">
								<div
									className="flex items-end cursor-pointer group"
									onClick={() => setIsDropdownHabitIconsVisible(!isDropdownHabitIconsVisible)}
								>
									<img src={selectedIcon} className="h-[60px]" />
									<Icon
										name="edit"
										customClass={
											'!text-[20px] text-color-gray-100 group-hover:text-white cursor-pointer'
										}
									/>
								</div>

								<DropdownHabitIcons
									toggleRef={dropdownHabitIconsRef}
									isVisible={isDropdownHabitIconsVisible}
									setIsVisible={setIsDropdownHabitIconsVisible}
									selectedIcon={selectedIcon}
									setSelectedIcon={setSelectedIcon}
								/>
							</div>

							<div className="flex-1">
								<CustomInput
									value={name}
									placeholder="Name"
									setValue={setName}
									customClasses="!text-left  p-[6px] px-3"
								/>
							</div>
						</div>

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

						<GoalSection
							goalType={goalType}
							setGoalType={setGoalType}
							dailyValue={dailyValue}
							setDailyValue={setDailyValue}
							dailyUnit={dailyUnit}
							setDailyUnit={setDailyUnit}
							whenChecking={whenChecking}
							setWhenChecking={setWhenChecking}
						/>
						<StartDateSection startDate={startDate} setStartDate={setStartDate} />
						<GoalDaysSection goalDays={goalDays} setGoalDays={setGoalDays} />
						<HabitSection section={section} setSection={setSection} />
						<ReminderSection reminderList={reminderList} setReminderList={setReminderList} />
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
							disabled={!name}
							className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px] disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => {
								const payload = {
									name,
									frequency: {
										daily: {
											selected: selectedInterval.toLowerCase() === 'daily',
											daysOfWeek,
										},
										weekly: {
											selected: selectedInterval.toLowerCase() === 'weekly',
											daysPerWeek: Number(daysPerWeek),
										},
										interval: {
											selected: selectedInterval.toLowerCase() === 'interval',
											everyXDays: Number(everyXDays),
										},
									},
									goal: {
										achieveItAll: {
											selected: goalType === 'achieveItAll',
										},
										reachCertainAmount: {
											selected: goalType === 'reachCertainAmount',
											dailyValue: Number(dailyValue),
											dailyUnit,
											whenChecking,
										},
									},
									startDate: startDate.toISOString(),
									goalDays: goalDays,
									habitSectionId: section._id,
									reminders: reminderList,
									icon: selectedIcon,
								};

								handleError(async () => {
									dispatch(setModalState({ modalId: 'ModalAddHabit', isOpen: false }));

									// console.log(payload);
									// debugger;

									if (editingExistingHabit) {
										const { _id } = modal.props.habit;
										await editHabit({ habitId: _id, payload }).unwrap();
									} else {
										// Create new habit
										await addHabit(payload).unwrap();
									}

									// Reset all the data to the defaults and close the modal
									resetAllStates();
								});
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

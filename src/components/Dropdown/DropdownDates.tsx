import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { DropdownProps } from '../../interfaces/interfaces';
import Icon from '../Icon';
import Dropdown from './Dropdown';
import DropdownCalendar from './DropdownCalendar/DropdownCalendar';

interface DropdownDatesProps extends DropdownProps {
	selectedDate: string;
	setSelectedDate: string;
}

const DropdownDates: React.FC<DropdownDatesProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	dateOptions,
	setDateOptions,
}) => {
	const [localDateOptions, setLocalDateOptions] = useState(dateOptions);

	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [isDropdownFromDateVisible, setIsDropdownFromDateVisible] = useState(false);
	const [isDropdownToDateVisible, setIsDropdownToDateVisible] = useState(false);

	const dropdownFromDateRef = useRef();
	const dropdownToDateRef = useRef();

	useEffect(() => {
		if (dateOptions) {
			setLocalDateOptions(dateOptions);

			const { duration } = dateOptions;

			// TODO: Time doesn't seem to be saving, only the date. Fix that.
			setFromDate(new Date(duration.fromDate));
			setToDate(new Date(duration.toDate));
		}
	}, [dateOptions]);

	const Duration = () => {
		return (
			<div className="flex-1 space-y-2 w-full">
				<DurationOption
					dropdownDateRef={dropdownFromDateRef}
					isDropdownDateVisible={isDropdownFromDateVisible}
					setIsDropdownDateVisible={setIsDropdownFromDateVisible}
					date={fromDate}
					setDate={setFromDate}
					dropdownCustomClasses=" !ml-[100px] mt-[-100px]"
				/>

				<DurationOption
					dropdownDateRef={dropdownToDateRef}
					isDropdownDateVisible={isDropdownToDateVisible}
					setIsDropdownDateVisible={setIsDropdownToDateVisible}
					date={toDate}
					setDate={setToDate}
					dropdownCustomClasses=" !ml-[100px] mt-[-60px]"
				/>
			</div>
		);
	};

	const DurationOption = ({
		dropdownDateRef,
		isDropdownDateVisible,
		setIsDropdownDateVisible,
		date,
		setDate,
		dropdownCustomClasses,
	}) => (
		<div className="flex-1 w-full" onClick={(e) => e.stopPropagation()}>
			<div
				ref={dropdownDateRef}
				className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
				onClick={(e) => {
					e.stopPropagation();
					setIsDropdownDateVisible(!isDropdownDateVisible);
				}}
			>
				<div className="max-w-[300px] truncate text-[12px]">
					{date
						? date.toLocaleString('en-US', {
								year: 'numeric', // Full year
								month: 'long', // Full month name
								day: 'numeric', // Day of the month
								hour: 'numeric', // Hour (in 12-hour AM/PM format)
								minute: '2-digit', // Minute with leading zeros
								hour12: true, // Use AM/PM
							})
						: 'No Date'}
				</div>
				<Icon
					name="expand_more"
					fill={0}
					customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
				/>
			</div>

			<DropdownCalendar
				toggleRef={dropdownDateRef}
				isVisible={isDropdownDateVisible}
				setIsVisible={setIsDropdownDateVisible}
				currDueDate={date}
				setCurrDueDate={setDate}
				customClasses={dropdownCustomClasses}
			/>
		</div>
	);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'mt-[5px] shadow-2xl border border-color-gray-200 rounded-lg w-full'}
		>
			<div className="rounded" onClick={(e) => e.stopPropagation()}>
				<div
					className={classNames(
						'p-1 gray-scrollbar max-h-[200px]',
						!isDropdownFromDateVisible && !isDropdownToDateVisible ? 'overflow-auto' : 'overflow-hidden'
					)}
				>
					{localDateOptions &&
						Object.entries(localDateOptions).map(([key, value]) => {
							const isDateSelected = value.selected;

							return (
								<div
									key={value.name}
									className="flex items-center justify-between gap-2 hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
									onClick={() => {
										setLocalDateOptions({
											...localDateOptions,
											[key]: { ...value, selected: !localDateOptions[key].selected },
										});
									}}
								>
									<div className="flex-1 flex items-center gap-2">
										<Icon
											name={value.iconName}
											fill={0}
											customClass={classNames(
												'!text-[18px] hover:text-white cursor-pointer',
												isDateSelected ? 'text-blue-500' : ''
											)}
										/>
										<div className={isDateSelected ? 'text-blue-500' : ''}>{value.name}</div>
										{key === 'duration' && <Duration />}
									</div>
									{isDateSelected && (
										<Icon
											name="check"
											fill={0}
											customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
										/>
									)}
								</div>
							);
						})}
				</div>

				<div className="p-3 border-t border-color-gray-200 flex gap-2">
					<button
						className="flex-1 border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
						onClick={() => setIsVisible(false)}
					>
						Cancel
					</button>
					<button
						className="flex-1 bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
						onClick={() => {
							setDateOptions({
								...localDateOptions,
								duration: { ...localDateOptions['duration'], fromDate: fromDate, toDate: toDate },
							});
							setIsVisible(false);
						}}
					>
						Ok
					</button>
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownDates;

import classNames from 'classnames';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import DropdownTimeCalendar from '../../../components/Dropdown/DropdownsAddFocusRecord/DropdownTimeCalendar';
import Icon from '../../../components/Icon';
import Modal from '../../../components/Modal/Modal';
import { formatCheckedInDayDate } from '../../../utils/date.utils';

const ModalPickDateRange: React.FC = ({
	isModalOpen,
	setIsModalOpen,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}) => {
	const dispatch = useDispatch();

	const [localStartDate, setLocalStartDate] = useState(startDate);
	const [localEndDate, setLocalEndDate] = useState(endDate);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const DateInput = ({ labelName, date, setDate }) => {
		const dropdownTimeCalenderRef = useRef(null);
		const [isDropdownTimeCalendarVisible, setIsDropdownTimeCalendarVisible] = useState(false);

		return (
			<div className="flex items-center gap-2">
				<div className="w-[40px]">{labelName}</div>
				<div className="w-full relative">
					<div
						ref={dropdownTimeCalenderRef}
						onClick={() => setIsDropdownTimeCalendarVisible(!isDropdownTimeCalendarVisible)}
						className="border border-color-gray-300 hover:border-blue-500 cursor-pointer px-3 py-1 rounded w-full bg-color-gray-200"
					>
						{formatCheckedInDayDate(date)}
					</div>

					<DropdownTimeCalendar
						toggleRef={dropdownTimeCalenderRef}
						isVisible={isDropdownTimeCalendarVisible}
						setIsVisible={setIsDropdownTimeCalendarVisible}
						date={date}
						setDate={setDate}
						showTime={false}
					/>
				</div>
			</div>
		);
	};

	return (
		<Modal isOpen={isModalOpen} onClose={closeModal} position="top-center" customClasses="!w-[350px]">
			<div className="rounded-xl shadow-lg bg-color-gray-650">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">Custom</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					<div className="mb-5 space-y-2">
						<DateInput labelName="Start" date={localStartDate} setDate={setLocalStartDate} />
						<DateInput labelName="End" date={localEndDate} setDate={setLocalEndDate} />
					</div>

					<div className="flex justify-end gap-2">
						<button
							className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
							onClick={async () => {
								// TODO: Send the local start and end dates to the parent
								setStartDate(localStartDate);
								setEndDate(localEndDate);
								closeModal();
							}}
						>
							Confirm
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalPickDateRange;

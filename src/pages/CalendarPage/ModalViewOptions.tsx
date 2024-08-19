import classNames from 'classnames';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal/Modal';
import { useRef, useState } from 'react';
import DropdownGeneralSelect from '../StatsPage/DropdownGeneralSelect';
import CustomCheckbox from '../../components/CustomCheckbox';
import { useCalendarContext } from '../../contexts/useCalendarContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import useHandleError from '../../hooks/useHandleError';

const ModalViewOptions: React.FC = ({ isOpen, setIsOpen }) => {
	const { colorsType, setColorsType, shownTasksFilters, setShownTasksFilters } = useCalendarContext();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const [editUserSettings] = useEditUserSettingsMutation();
	const handleError = useHandleError();

	const dropdownRef = useRef(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const colorsTypeOptions = ['Projects', 'Priority', 'Tags'];

	const closeModal = () => setIsOpen(false);

	return (
		<Modal isOpen={isOpen} onClose={closeModal} position="top-center">
			<div className="rounded-xl shadow-lg bg-color-gray-650">
				<div className={classNames('p-5')}>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-[16px]">View Options</h3>
						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>

					{/* Colors */}
					<div className="font-bold">Colors</div>
					<p className="m-0 text-color-gray-100">
						Colors of the task block in the calendar view can be displayed according to lists, tags, and
						priorities.
					</p>

					<div className="relative mt-2">
						<div
							className="flex justify-between items-center gap-[2px] border border-color-gray-200 px-2 py-1 rounded-md cursor-pointer"
							onClick={() => setIsDropdownVisible(!isDropdownVisible)}
						>
							<div>{colorsType}</div>
							<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
						</div>

						<DropdownGeneralSelect
							toggleRef={dropdownRef}
							isVisible={isDropdownVisible}
							setIsVisible={setIsDropdownVisible}
							selected={colorsType}
							setSelected={(newColorsType) => {
								handleError(async () => {
									setColorsType(newColorsType);

									const payload = {
										calendarViewOptions: {
											...userSettings.calendarViewOptions,
											colorsType: newColorsType,
										},
									};

									await editUserSettings(payload).unwrap();
								});
							}}
							selectedOptions={colorsTypeOptions}
							customClasses={'!w-full'}
						/>
					</div>

					{/* Tasks */}
					<div className="font-bold mt-6 mb-2">Tasks</div>
					<div className="space-y-1">
						{Object.keys(shownTasksFilters).map((taskToShowKey) => {
							const taskToShowValue = shownTasksFilters[taskToShowKey];
							const { name, isChecked } = taskToShowValue;

							return (
								<CustomCheckbox
									key={name}
									isChecked={isChecked}
									setIsChecked={(newCheckedValue) => {
										handleError(async () => {
											setShownTasksFilters({
												...shownTasksFilters,
												[taskToShowKey]: {
													...shownTasksFilters[taskToShowKey],
													isChecked: newCheckedValue,
												},
											});

											const payload = {
												calendarViewOptions: {
													...userSettings.calendarViewOptions,
													shownTasksFilters: {
														...userSettings.calendarViewOptions.shownTasksFilters,
														[taskToShowKey]: newCheckedValue,
													},
												},
											};

											await editUserSettings(payload).unwrap();
										});
									}}
									label={name}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalViewOptions;

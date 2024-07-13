import { useDispatch } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import Icon from '../Icon';
import Dropdown from '../Dropdown/Dropdown';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import classNames from 'classnames';

const HeaderSection = ({ viewType, setViewType }) => {
	const location = useLocation();
	const dispatch = useDispatch();

	const dropdownHabitTypesRef = useRef(null);
	const [isDropdownHabitTypesVisible, setIsDropdownHabitTypesVisible] = useState(false);

	const iconClass =
		'text-color-gray-100 !text-[21px] hover:text-white cursor-pointer rounded hover:bg-color-gray-300 p-1';

	const inArchivedRoute = location.pathname.includes('/habits/archived');

	useEffect(() => {
		dispatch(setModalState({ modalId: 'ModalEditHabitSettings', isOpen: true }));
	}, []);

	return (
		<div className="flex justify-between items-center mb-4">
			<div className="relative">
				<div
					className="flex items-center gap-1 hover:bg-color-gray-300 p-1 rounded cursor-pointer"
					onClick={() => setIsDropdownHabitTypesVisible(!isDropdownHabitTypesVisible)}
				>
					<span className="text-[18px] font-medium">{inArchivedRoute ? 'Archived Habits' : 'Habits'}</span>
					<Icon name="expand_more" fill={1} customClass={'text-color-gray-100 !text-[18px] cursor-pointer'} />
				</div>

				<DropdownHabitTypes
					toggleRef={dropdownHabitTypesRef}
					isVisible={isDropdownHabitTypesVisible}
					setIsVisible={setIsDropdownHabitTypesVisible}
				/>
			</div>

			<div className="flex items-center gap-2">
				<Icon
					name={viewType === 'grid' ? 'list' : 'grid_view'}
					fill={0}
					customClass={iconClass}
					onClick={() => {
						if (viewType === 'grid') {
							setViewType('list');
						} else {
							setViewType('grid');
						}
					}}
				/>

				{!inArchivedRoute && (
					<Icon
						name="add"
						fill={1}
						customClass={iconClass}
						onClick={() => dispatch(setModalState({ modalId: 'ModalAddHabit', isOpen: true }))}
					/>
				)}

				<Icon
					name="more_horiz"
					fill={1}
					customClass={iconClass}
					onClick={() => dispatch(setModalState({ modalId: 'ModalEditHabitSettings', isOpen: true }))}
				/>
			</div>
		</div>
	);
};

const DropdownHabitTypes = ({ toggleRef, isVisible, setIsVisible }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const SelectOption = ({ name, isSelected, onClick }) => {
		return (
			<div
				className="px-3 py-2 flex items-center gap-[2px] hover:bg-color-gray-300 cursor-pointer flex items-center justify-between"
				onClick={onClick}
			>
				<div className={isSelected ? 'text-blue-500' : ''}>{name}</div>
				{isSelected && (
					<Icon
						name="check"
						fill={0}
						customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
					/>
				)}
			</div>
		);
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'shadow-2xl border border-color-gray-200 rounded'}
		>
			<div className="w-[200px] p-1 rounded text-[13px]" onClick={(e) => e.stopPropagation()}>
				<SelectOption
					name="Active"
					isSelected={!location.pathname.includes('/habits/archived')}
					onClick={() => {
						navigate('/habits');
						setIsVisible(false);
					}}
				/>
				<SelectOption
					name="Archived"
					isSelected={location.pathname.includes('/habits/archived')}
					onClick={() => {
						navigate('/habits/archived');
						setIsVisible(false);
					}}
				/>
			</div>
		</Dropdown>
	);
};

export default HeaderSection;

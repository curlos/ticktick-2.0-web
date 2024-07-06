import { useDispatch } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import Icon from '../Icon';
import { useEffect } from 'react';

const HeaderSection = () => {
	const dispatch = useDispatch();

	// TODO: Remove this after finishing the "Add Habit" modal.
	useEffect(() => {
		dispatch(setModalState({ modalId: 'ModalAddHabit', isOpen: true }));
	}, []);

	const iconClass =
		'text-color-gray-100 !text-[21px] hover:text-white cursor-pointer rounded hover:bg-color-gray-300 p-1';

	return (
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-1 hover:bg-color-gray-300 p-1 rounded cursor-pointer">
				<span className="text-[18px] font-medium">Habit</span>
				<Icon name="expand_more" fill={1} customClass={'text-color-gray-100 !text-[18px] cursor-pointer'} />
			</div>

			<div className="flex items-center gap-2">
				<Icon name="grid_view" fill={0} customClass={iconClass} />

				<Icon
					name="add"
					fill={1}
					customClass={iconClass}
					onClick={() => dispatch(setModalState({ modalId: 'ModalAddHabit', isOpen: true }))}
				/>

				<Icon name="more_horiz" fill={1} customClass={iconClass} />
			</div>
		</div>
	);
};

export default HeaderSection;

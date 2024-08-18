import classNames from 'classnames';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Icon from '../../../components/Icon';
import { setModalState } from '../../../slices/modalSlice';
import { useDispatch } from 'react-redux';

const DropdownTopHeaderMoreOptions = ({ toggleRef, isVisible, setIsVisible, customClasses }) => {
	const dispatch = useDispatch();

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
		>
			<div className="w-[175px] p-1">
				<SelectOption
					name="View Options"
					iconName="visibility"
					onClick={() => {
						console.log('hi');
						dispatch(setModalState({ modalId: 'ModalViewOptions', isOpen: true }));
					}}
					setIsVisible={setIsVisible}
				/>
				<SelectOption
					name="Arrange Tasks"
					iconName="layers"
					onClick={() => {
						console.log('hi');
					}}
					setIsVisible={setIsVisible}
				/>
			</div>
		</Dropdown>
	);
};

const SelectOption = ({
	name,
	iconName,
	onClick,
	setIsVisible,
}: {
	name: string;
	iconName: string;
	onClick: () => void;
}) => {
	return (
		<div
			className="flex items-center gap-2 hover:bg-color-gray-300 p-2 rounded-md cursor-pointer"
			onClick={(e) => {
				e.stopPropagation();
				setIsVisible(false);
				onClick();
			}}
		>
			<Icon name={iconName} fill={0} customClass={'text-white !text-[18px] hover:text-white cursor-pointer'} />

			<div className="text-white">{name}</div>
		</div>
	);
};

export default DropdownTopHeaderMoreOptions;

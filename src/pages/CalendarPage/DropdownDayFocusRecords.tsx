import classNames from 'classnames';
import Dropdown from '../../components/Dropdown/Dropdown';

const DropdownDayFocusRecords = ({ toggleRef, isVisible, setIsVisible, customClasses }) => {
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
		>
			<div className="w-[175px]">2024-08-07</div>
		</Dropdown>
	);
};

export default DropdownDayFocusRecords;

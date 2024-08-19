import Dropdown from './Dropdown';
import classNames from 'classnames';
import AddOrEditFocusRecord from '../Modal/ModalAddFocusRecord/AddOrEditFocusRecord';

const DrodpownAddFocusRecord = ({ toggleRef, isVisible, setIsVisible, customClasses, customStyling, focusRecord }) => {
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
			customStyling={customStyling ? customStyling : null}
		>
			<div
				className="w-[400px]"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<AddOrEditFocusRecord
					focusRecord={focusRecord}
					fromDropdown={true}
					closeDropdown={() => setIsVisible(false)}
				/>
			</div>
		</Dropdown>
	);
};

export default DrodpownAddFocusRecord;

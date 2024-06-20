import Dropdown from './Dropdown';
import { DropdownProps, TaskObj } from '../../interfaces/interfaces';
import classNames from 'classnames';

interface IDropdownTaskDetails extends DropdownProps {
	task?: TaskObj;
}

const DropdownTaskDetails: React.FC<IDropdownTaskDetails> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	task,
	customStyling,
}) => {
	console.log(customStyling);

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
			customStyling={customStyling ? customStyling : null}
		>
			<div className="w-[400px]">
				<div>Hello World</div>
			</div>
		</Dropdown>
	);
};

export default DropdownTaskDetails;

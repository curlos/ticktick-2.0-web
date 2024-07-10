import classNames from 'classnames';
import { DropdownProps } from '../../interfaces/interfaces';
import Dropdown from '../Dropdown/Dropdown';
import Icon from '../Icon';

interface IDropdownHabitDayActions extends DropdownProps {}

const DropdownHabitDayActions: React.FC<IDropdownHabitDayActions> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	customStyling,
	task,
}) => {
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames(
				'shadow-2xl border border-color-gray-200 rounded-lg bg-color-gray-650',
				customClasses
			)}
			customStyling={customStyling ? customStyling : null}
		>
			<div className="w-[200px] rounded p-1">
				<ActionItem
					name="Unachieved"
					iconName="cancel"
					onClick={() => {
						// TODO: Edit the habit so that it's unachieved
					}}
				/>
				<ActionItem
					name="Habit Log"
					iconName="edit"
					onClick={() => {
						// TODO: Open the "Habit Log" modal where the habit's log for that day can be added or edited.
					}}
				/>
			</div>
		</Dropdown>
	);
};

const ActionItem = ({ name, iconName, onClick }) => {
	return (
		<div
			onClick={onClick}
			className="p-2 hover:bg-color-gray-300 cursor-pointer flex items-center gap-2 text-color-gray-50"
		>
			<Icon name={iconName} customClass={'!text-[18px] cursor-pointer'} />
			<div>{name}</div>
		</div>
	);
};

export default DropdownHabitDayActions;

import Dropdown from './Dropdown';
import { DropdownProps, TaskObj } from '../../interfaces/interfaces';
import classNames from 'classnames';
import TaskDetails from '../TaskDetails/TaskDetails';

interface IDropdownTaskDetails extends DropdownProps {
	task?: TaskObj;
}

const DropdownTaskDetails: React.FC<IDropdownTaskDetails> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	customStyling,
	task,
	isForAddingNewTask,
	newTask,
	setNewTask,
}) => {
	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
			customStyling={customStyling ? customStyling : null}
		>
			<div className="w-[400px]">
				<TaskDetails
					taskToUse={task}
					isForAddingNewTask={isForAddingNewTask}
					newTask={newTask}
					setNewTask={setNewTask}
				/>
			</div>
		</Dropdown>
	);
};

export default DropdownTaskDetails;

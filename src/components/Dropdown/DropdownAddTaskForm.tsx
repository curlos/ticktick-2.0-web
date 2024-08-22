import AddTaskForm from '../AddTaskForm';
import Dropdown from './Dropdown';
import classNames from 'classnames';

const DropdownAddTaskForm = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	customStyling,
	parentId,
	defaultPriority,
}) => {
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
				<AddTaskForm
					parentId={parentId}
					defaultPriority={defaultPriority}
					setIsDropdownAddTaskFormVisible={setIsVisible}
				/>
			</div>
		</Dropdown>
	);
};

export default DropdownAddTaskForm;

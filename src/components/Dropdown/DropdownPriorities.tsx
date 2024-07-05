import Dropdown from './Dropdown';
import Icon from '../Icon';
import { IPriorityItem, PRIORITIES } from '../../utils/priorities.utils';
import { DropdownProps, TaskObj } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { useEditTaskMutation } from '../../services/resources/tasksApi';

interface DropdownPrioritiesProps extends DropdownProps {
	priority: number;
	setPriority: React.Dispatch<React.SetStateAction<number>>;
	customClasses: string;
	task?: TaskObj;
}

const DropdownPriorities: React.FC<DropdownPrioritiesProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	priority: selectedPriority,
	setPriority,
	customClasses,
	task,
}) => {
	const [editTask] = useEditTaskMutation();

	interface PriorityProps {
		priority: IPriorityItem;
	}

	const Priority: React.FC<PriorityProps> = ({ priority }) => {
		const { name, backendValue, textFlagColor } = priority;

		return (
			<div
				className="flex items-center justify-between hover:bg-color-gray-300 p-2 rounded-lg cursor-pointer"
				onClick={() => {
					setPriority(backendValue);
					setIsVisible(false);

					if (task) {
						editTask({ taskId: task._id, payload: { priority: backendValue } });
					}
				}}
			>
				<div className="flex items-center gap-1">
					<Icon name="flag" customClass={`${textFlagColor} !text-[22px] hover:text-white cursor-p`} />
					{name}
				</div>
				{selectedPriority === backendValue && (
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
			customClasses={classNames('shadow-2xl border border-color-gray-200 rounded-lg', customClasses)}
		>
			<div className="w-[200px]">
				<div>
					<Priority key={'high'} priority={PRIORITIES['high']} />
					<Priority key={'medium'} priority={PRIORITIES['medium']} />
					<Priority key={'low'} priority={PRIORITIES['low']} />
					<Priority key={'none'} priority={PRIORITIES['none']} />
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownPriorities;

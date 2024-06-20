import { useParams } from 'react-router';
import { TaskObj } from '../interfaces/interfaces';
import Task from './Task';

interface TaskListProps {
	tasks: Array<TaskObj>;
	selectedFocusRecordTask?: TaskObj;
	setSelectedFocusRecordTask?: React.Dispatch<React.SetStateAction<TaskObj>>;
	handleTaskClick?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
	tasks,
	selectedFocusRecordTask,
	setSelectedFocusRecordTask,
	handleTaskClick,
}) => {
	const { projectId } = useParams();

	return (
		<div>
			{tasks?.map((task) => (
				<Task
					key={task._id}
					taskId={task._id}
					selectedFocusRecordTask={selectedFocusRecordTask}
					setSelectedFocusRecordTask={setSelectedFocusRecordTask}
					handleTaskClick={handleTaskClick}
				/>
			))}
		</div>
	);
};

export default TaskList;

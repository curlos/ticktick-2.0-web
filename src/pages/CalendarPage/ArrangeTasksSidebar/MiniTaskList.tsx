import useGetTaskBgColor from '../../../hooks/useGetTaskBgColor';
import { TaskObj } from '../interfaces/interfaces';

interface MiniTaskListProps {
	tasks: Array<TaskObj>;
	fromCalendarPage: boolean;
}

const MiniTaskList: React.FC<MiniTaskListProps> = ({ tasks, fromCalendarPage }) => {
	const getTaskBgColor = useGetTaskBgColor();

	return (
		<div className="space-y-1">
			{tasks.map((task) => {
				return (
					<div
						className="p-[2px] truncate text-[12px] rounded"
						style={{
							backgroundColor: getTaskBgColor(task),
						}}
					>
						{task.title}
					</div>
				);
			})}
		</div>
	);
};

export default MiniTaskList;

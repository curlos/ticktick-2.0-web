import ActionSidebar from '../components/ActionSidebar';
import TaskDetails from '../components/TaskDetails/TaskDetails';
import TaskListSidebar from '../components/TaskListSidebar';
import TaskListPage from './TaskListPage';

const HomePage = () => {
	return (
		<div className="flex max-w-screen">
			<div className="">
				<ActionSidebar />
			</div>
			<div className="flex-[3]">
				<TaskListSidebar />
			</div>
			<div className="flex-[10] bg-blue-500">
				<TaskListPage />
			</div>
			<div className="flex-[6] bg-red-500">
				{/* <ResizableBox width={500} height={'100%'} resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}>
            <div className="h-full">
              <TaskDetails />
            </div>
          </ResizableBox> */}
				<TaskDetails />
			</div>
		</div>
	);
};

export default HomePage;

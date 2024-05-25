import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import Icon from '../Icon';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';
import { useGetTasksQuery } from '../../services/api';
import { debounce } from '../../utils/helpers.utils';
import Task from '../Task';

const ModalSearchTasks: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalSearchTasks']);
	const dispatch = useDispatch();

	if (!modal) {
		return null;
	}

	const { isOpen, props } = modal;
	const { parentId } = props;

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => dispatch(setModalState({ modalId: 'ModalSearchTasks', isOpen: false }))}
			position="top-center"
			customClasses="!w-[700px]"
		>
			<div className="rounded-lg shadow-lg bg-color-gray-600 p-4 pt-2">
				<SearchTasks />
			</div>
		</Modal>
	);
};

const SearchTasks = () => {
	const dispatch = useDispatch();
	const { data: fetchedTasks, isLoading: isLoadingTasks, error: errorTasks } = useGetTasksQuery();
	const { tasks, tasksById } = fetchedTasks || {};

	const [filteredTasks, setFilteredTasks] = useState(tasks);
	const [searchText, setSearchText] = useState('');
	const fuse = new Fuse(tasks, {
		includeScore: true,
		keys: ['title', 'description'],
	});

	useEffect(() => {
		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [searchText, tasks]);

	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, [filteredTasks]); // Triggered when 'filteredProjects' changes

	const handleDebouncedSearch = debounce(() => {
		let searchedTasks;

		if (searchText.trim() === '') {
			// If searchText is empty, consider all projects as the searched result.
			searchedTasks = tasks.map((task) => ({ item: task }));
		} else {
			// When searchText is not empty, perform the search using Fuse.js
			searchedTasks = fuse.search(searchText);
		}

		setFilteredTasks(searchedTasks.map((result) => result.item));
	}, 1000);

	console.log(filteredTasks);

	const onCloseSearchTasks = () => dispatch(setModalState({ modalId: 'ModalSearchTasks', isOpen: false }));

	return (
		<div>
			<div className="flex items-center gap-2">
				<Icon name="search" customClass={'text-color-gray-100 !text-[24px] cursor-pointer'} grad={200} />

				<input
					placeholder="Search"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					className="text-[18px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
				/>
			</div>

			<div className="border-t border-color-gray-150 py-2 mt-1 font-bold">Tasks</div>

			<div ref={scrollRef} className="h-[400px] overflow-auto gray-scrollbar flex flex-col gap-1">
				{filteredTasks.map((task) => (
					<Task
						key={task._id}
						taskId={task._id}
						showSubtasks={false}
						onCloseSearchTasks={onCloseSearchTasks}
					/>
				))}
			</div>
		</div>
	);
};

export default ModalSearchTasks;

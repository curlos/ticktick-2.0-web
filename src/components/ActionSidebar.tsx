import Icon from './Icon';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModalState } from '../slices/modalSlice';

const ActionSidebar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const iconCustomClass = 'text-white !text-[24px] cursor-pointer';

	return (
		<div className="bg-black h-full flex flex-col justify-between gap-10 h-screen pt-2 pb-3">
			<div>
				<div className="rounded-full bg-black p-2 mb-3">
					<img src="/prestige-9-bo2.png" alt="user-icon" className="w-[35px] h-[35px]" />
				</div>
				<div className="flex flex-col items-center gap-3">
					<Icon
						name="check_box"
						customClass={iconCustomClass}
						onClick={() => navigate('/projects/all/tasks')}
					/>
					{/* <Icon name="calendar_month" customClass={iconCustomClass} /> */}
					{/* <Icon name="grid_view" customClass={iconCustomClass} /> */}
					<Icon name="timer" customClass={iconCustomClass} onClick={() => navigate('/focus')} />
					{/* <Icon name="location_on" customClass={iconCustomClass} /> */}
					<Icon
						name="search"
						customClass={iconCustomClass}
						grad={200}
						onClick={() => {
							dispatch(setModalState({ modalId: 'ModalSearchTasks', isOpen: true }));
						}}
					/>
					<Icon
						name="add_task"
						customClass={iconCustomClass}
						onClick={() => {
							dispatch(setModalState({ modalId: 'ModalAddTaskForm', isOpen: true }));
						}}
					/>
				</div>
			</div>

			{/* <div className="flex flex-col items-center gap-3">
                <Icon name="sync" customClass={iconCustomClass} grad={200} />
                <Icon name="notifications" customClass={iconCustomClass} />
                <Icon name="help" customClass={iconCustomClass} />
            </div> */}
		</div>
	);
};

export default ActionSidebar;

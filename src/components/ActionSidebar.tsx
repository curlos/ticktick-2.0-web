import Icon from './Icon';
import { useNavigate } from 'react-router';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModalState } from '../slices/modalSlice';
import DropdownAccountDetails from './Dropdown/DropdownAccountDetails';

const ActionSidebar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const iconCustomClass = 'text-white !text-[24px] cursor-pointer';

	const dropdownAccountDetailsToggleRef = useRef(null);

	const [isDropdownAccountDetailsVisible, setIsDropdownAccountDetailsVisible] = useState(false);

	return (
		<div className="bg-black h-full flex flex-col justify-between gap-10 h-screen pt-2 pb-3">
			<div>
				<div className="relative">
					<div
						ref={dropdownAccountDetailsToggleRef}
						onClick={() => setIsDropdownAccountDetailsVisible(!isDropdownAccountDetailsVisible)}
						className="rounded-full bg-black p-2 mb-3 cursor-pointer"
					>
						<img src="/prestige-9-bo2.png" alt="user-icon" className="w-[35px] h-[35px]" />
					</div>

					<DropdownAccountDetails
						toggleRef={dropdownAccountDetailsToggleRef}
						isVisible={isDropdownAccountDetailsVisible}
						setIsVisible={setIsDropdownAccountDetailsVisible}
						customClasses="ml-[10px] mt-[-5px]"
					/>
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

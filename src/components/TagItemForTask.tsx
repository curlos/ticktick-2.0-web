import { useRef, useState } from 'react';
import { hexToRGBA } from '../utils/helpers.utils';
import classNames from 'classnames';
import Icon from './Icon';
import { useNavigate } from 'react-router';
import Dropdown from './Dropdown/Dropdown';
import { useEditTaskMutation } from '../services/resources/tasksApi';

const TagItemForTask = ({ tag, task, selectedTagList, setSelectedTagList, allowDelete = true }) => {
	const navigate = useNavigate();
	// RTK Query - Tasks
	const [editTask] = useEditTaskMutation();

	const dropdownRef = useRef(null);
	const [isHovering, setIsHovering] = useState(false);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);

	const { name, color, _id } = tag;
	const backgroundColor = color ? hexToRGBA(color, '65%') : 'gray';

	const deleteTagFromTask = async (e) => {
		e.stopPropagation();
		const listWithoutCurrentTag = selectedTagList.filter((currTag) => currTag._id !== tag._id);
		setSelectedTagList(listWithoutCurrentTag);

		if (task) {
			const selectedItemListIds = listWithoutCurrentTag.map((item) => item._id);
			await editTask({ taskId: task._id, payload: { tagIds: selectedItemListIds } });
		}
	};

	return (
		<div
			key={_id}
			className="relative flex"
			onMouseEnter={() => {
				setIsHovering(true);
				setIsDropdownVisible(true);
			}}
			onMouseLeave={() => {
				setIsHovering(false);
				setIsDropdownVisible(false);
			}}
			onClick={() => navigate(`/tags/${tag._id}/tasks`)}
		>
			<div style={{ backgroundColor }} className="px-2 py-1 text-[12px] text-white rounded-xl cursor-pointer">
				<div
					className="overflow-hidden text-nowrap text-ellipsis max-w-[130px]"
					onClick={() => console.log('Bum')}
				>
					{name}
				</div>
			</div>

			<Dropdown
				toggleRef={dropdownRef}
				isVisible={isDropdownVisible}
				setIsVisible={setIsDropdownVisible}
				customClasses={'!bg-black'}
			>
				<div className="p-2 text-[12px] text-nowrap">{name}</div>
			</Dropdown>

			{allowDelete && (
				<div
					onClick={deleteTagFromTask}
					className={classNames('mt-[-7px] ml-[-10px]', isHovering ? 'visible' : 'invisible')}
				>
					<Icon
						name="close"
						fill={0}
						customClass={
							'text-color-gray-50 bg-gray-600 rounded-full !text-[14px] bg-white hover:text-white cursor-pointer'
						}
					/>
				</div>
			)}
		</div>
	);
};

export default TagItemForTask;

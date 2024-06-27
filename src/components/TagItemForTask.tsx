import { useState } from 'react';
import { hexToRGBA } from '../utils/helpers.utils';
import classNames from 'classnames';
import Icon from './Icon';
import { useNavigate } from 'react-router';
import { useEditTaskMutation } from '../services/api';

const TagItemForTask = ({ tag, task, selectedTagList }) => {
	const navigate = useNavigate();
	// RTK Query - Tasks
	const [editTask] = useEditTaskMutation();

	const [isHovering, setIsHovering] = useState(false);

	const { name, color, _id } = tag;
	const backgroundColor = color ? hexToRGBA(color, '65%') : 'gray';

	return (
		<div
			key={_id}
			className="flex"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onClick={() => navigate(`/tags/${tag._id}/tasks`)}
		>
			<div style={{ backgroundColor }} className="px-2 py-1 text-[12px] rounded-xl cursor-pointer">
				<div>{name}</div>
			</div>

			<div className={classNames('mt-[-7px] ml-[-10px]', isHovering ? 'visible' : 'invisible')}>
				<Icon
					name="close"
					fill={0}
					customClass={
						'text-color-gray-50 bg-gray-600 rounded-full !text-[14px] bg-white hover:text-white cursor-pointer'
					}
					onClick={async (e) => {
						e.stopPropagation();
						const listWithoutCurrentTag = selectedTagList.filter((currTag) => currTag._id !== tag._id);
						const selectedItemListIds = listWithoutCurrentTag.map((item) => item._id);
						await editTask({ taskId: task._id, payload: { tagIds: selectedItemListIds } });
					}}
				/>
			</div>
		</div>
	);
};

export default TagItemForTask;

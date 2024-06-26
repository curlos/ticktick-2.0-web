import { useRef, useState } from 'react';
import { hexToRGBA } from '../../utils/helpers.utils';
import DropdownItemsWithSearch from '../Dropdown/DropdownItemsWithSearch';
import Icon from '../Icon';
import { useEditTaskMutation, useGetTagsQuery } from '../../services/api';
import classNames from 'classnames';

const TagList = ({ taskTags, task, selectedTagList, setSelectedTagList }) => {
	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsWithNoParent } = fetchedTags || {};
	const [editTask] = useEditTaskMutation();

	const [isDropdownItemsWithSearchTagVisible, setIsDropdownItemsWithSearchTagVisible] = useState(false);
	const dropdownItemsWithSearchTagRef = useRef(null);

	const TagItem = ({ tag }) => {
		const [isHovering, setIsHovering] = useState(false);

		const { name, color, _id } = tag;
		const backgroundColor = color ? hexToRGBA(color, '65%') : 'gray';

		return (
			<div
				key={_id}
				className="flex"
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
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

	return (
		<div className="flex gap-1">
			{/* TODO: SHow tags if there are any */}

			{taskTags.map((tag) => (
				<TagItem tag={tag} />
			))}

			<div className="relative">
				{/* TODO: When this is clicked, show the typing input instead to search for tags. Also, show a dropdown of the resulting tags from this filter. Of course, if there's nothing. Well, at least that's how TickTick 1.0 does it BUT I think an easier and better way to do it is to reuse the previous Dropdown where tags are set. I think that makes more sense. */}
				<div
					ref={dropdownItemsWithSearchTagRef}
					className="rounded-xl border border-blue-500 flex items-center justify-center px-2 py-1 cursor-pointer hover:bg-color-gray-600"
					onClick={() => setIsDropdownItemsWithSearchTagVisible(!isDropdownItemsWithSearchTagVisible)}
				>
					<Icon name="add" customClass={'text-blue-500 !text-[15px]'} />
				</div>

				<DropdownItemsWithSearch
					toggleRef={dropdownItemsWithSearchTagRef}
					isVisible={isDropdownItemsWithSearchTagVisible}
					setIsVisible={setIsDropdownItemsWithSearchTagVisible}
					selectedItemList={selectedTagList}
					setSelectedItemList={setSelectedTagList}
					items={tagsWithNoParent}
					task={task}
					multiSelect={true}
					type="tags"
				/>
			</div>
		</div>
	);
};

export default TagList;

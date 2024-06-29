import { useRef, useState } from 'react';
import DropdownItemsWithSearch from '../Dropdown/DropdownItemsWithSearch/DropdownItemsWithSearch';
import Icon from '../Icon';
import { useGetTagsQuery } from '../../services/api';
import TagItemForTask from '../TagItemForTask';

const TagList = ({ taskTags, task, selectedTagList, setSelectedTagList }) => {
	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsWithNoParent } = fetchedTags || {};

	const [isDropdownItemsWithSearchTagVisible, setIsDropdownItemsWithSearchTagVisible] = useState(false);
	const dropdownItemsWithSearchTagRef = useRef(null);

	return (
		<div className="flex flex-wrap gap-1">
			{taskTags.map((tag) => (
				<TagItemForTask
					key={tag._id}
					tag={tag}
					task={task}
					selectedTagList={selectedTagList}
					setSelectedTagList={setSelectedTagList}
				/>
			))}

			{taskTags.length > 0 && (
				<div className="relative">
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
			)}
		</div>
	);
};

export default TagList;

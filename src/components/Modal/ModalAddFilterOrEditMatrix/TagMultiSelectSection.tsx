import { useState, useRef } from 'react';
import { useGetTagsQuery } from '../../../services/api';
import DropdownItemsWithSearch from '../../Dropdown/DropdownItemsWithSearch/DropdownItemsWithSearch';
import Icon from '../../Icon';

const TagMultiSelectSection = ({ selectedTagList, setSelectedTagList }) => {
	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsWithNoParent } = fetchedTags || {};

	const [isDropdownItemsWithSearchTagVisible, setIsDropdownItemsWithSearchTagVisible] = useState(false);
	const dropdownItemsWithSearchTagRef = useRef(null);

	const selectedTagNames =
		selectedTagList &&
		selectedTagList
			.reduce((accumulator, current) => {
				accumulator.push(current.name);
				return accumulator;
			}, [])
			.join(', ');

	console.log(selectedTagList);

	if (!tagsWithNoParent) {
		return null;
	}

	return (
		<div>
			<div className="flex items-center">
				<div className="text-color-gray-100 w-[96px]">Tags</div>
				<div className="flex-1 relative">
					<div
						ref={dropdownItemsWithSearchTagRef}
						className="border border-color-gray-200 rounded p-1 px-2 flex justify-between items-center hover:border-blue-500 rounded-md cursor-pointer"
						onClick={() => {
							setIsDropdownItemsWithSearchTagVisible(!isDropdownItemsWithSearchTagVisible);
						}}
					>
						<div style={{ wordBreak: 'break-word' }}>{selectedTagNames}</div>
						<Icon
							name="expand_more"
							fill={0}
							customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						/>
					</div>

					<DropdownItemsWithSearch
						toggleRef={dropdownItemsWithSearchTagRef}
						isVisible={isDropdownItemsWithSearchTagVisible}
						setIsVisible={setIsDropdownItemsWithSearchTagVisible}
						selectedItemList={selectedTagList}
						setSelectedItemList={setSelectedTagList}
						items={tagsWithNoParent}
						multiSelect={true}
						type="tags"
						customClasses="w-full ml-[0px]"
					/>
				</div>
			</div>
		</div>
	);
};

export default TagMultiSelectSection;

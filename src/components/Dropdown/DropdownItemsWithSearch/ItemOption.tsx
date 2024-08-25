import classNames from 'classnames';
import { IProject } from '../../../interfaces/interfaces';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import Icon from '../../Icon';
import { useEditTaskMutation } from '../../../services/resources/tasksApi';
import { useGetTagsQuery } from '../../../services/resources/tagsApi';

interface ItemOptionProps {
	item: IProject;
}

const ItemOption: React.FC<ItemOptionProps> = ({
	item,
	iconFill = 1,
	type,
	multiSelect,
	selectedItem,
	setSelectedItem,
	selectedItemList,
	setSelectedItemList,
	setIsVisible,
	task,
	defaultItems,
	filteredItems,
	inboxProject,
	nonSmartListProjects,
	allProject,
	onCloseContextMenu,
	isForAddingNewTask,
}) => {
	const { name, _id, isFolder } = item;
	const isAllItem =
		type === 'project' ? item.urlName && item.urlName === 'all' : item.name && item.name.toLowerCase() === 'all';
	const isNoneTag = name === 'No Tags';

	const smartList = type === 'project' && SMART_LISTS[item.urlName];

	// RTK Query - Tasks
	const [editTask] = useEditTaskMutation();

	// RTK Query - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags, error: errorGetTags } = useGetTagsQuery();
	const { tagsById } = fetchedTags || {};

	const iconName =
		type === 'project'
			? isFolder
				? 'folder'
				: smartList
					? smartList.iconName
					: item.isInbox
						? 'inbox'
						: 'menu'
			: 'sell';

	const checkIfItemSelected = () => {
		if (multiSelect) {
			return selectedItemList.find((itemInList) => {
				// TODO: Was working on this to add the "No Tags" item to the array. Come back to this later for the "Arrange Tasks Sidebar".
				// if (isAllItem) {
				// 	debugger;
				// }

				if (type === 'tags' && isNoneTag) {
					return itemInList.name === item.name;
				} else {
					return itemInList._id === item._id;
				}
			});
		} else {
			if (type === 'project' && smartList) {
				return selectedItem.urlName === item.urlName;
			} else {
				return selectedItem._id === _id;
			}
		}
	};

	const isItemSelected = checkIfItemSelected();

	const handleClick = (e) => {
		e.stopPropagation();

		if (multiSelect) {
			let newSelectedItemList = [...selectedItemList];

			// If the tag is already selected, then remove it.
			if (isItemSelected && !isAllItem) {
				newSelectedItemList = newSelectedItemList.filter((selectedItem) => {
					if (type === 'tags' && isNoneTag) {
						return selectedItem.name !== item.name;
					}

					return selectedItem._id !== item._id;
				});
			} else {
				// If the project being selected is the "All" project, then every other selected project should be removed.
				if (isAllItem) {
					newSelectedItemList = [item];
				} else {
					// If a normal project is selected, remove "all" as a specific project has been chosen.
					newSelectedItemList = newSelectedItemList.filter(
						(itemInList) =>
							itemInList &&
							(type === 'project'
								? itemInList?.urlName?.toLowerCase() !== 'all'
								: itemInList.name.toLowerCase() !== 'all')
					);
					newSelectedItemList.push(item);
				}
			}

			const allItem = filteredItems.find((item) =>
				type === 'project' ? item?.urlName?.toLowerCase() === 'all' : item.name.toLowerCase() === 'all'
			);

			if (newSelectedItemList.length === 0) {
				newSelectedItemList = [allItem];
			} else {
				const allMultiSelectItems = type === 'project' ? [inboxProject, ...nonSmartListProjects] : defaultItems;

				if (allMultiSelectItems.length === newSelectedItemList.length) {
					newSelectedItemList = [allItem];
				}
			}
			console.log(newSelectedItemList);

			setSelectedItemList(newSelectedItemList);
		} else {
			setSelectedItem(item);
			setIsVisible(false);

			if (type === 'project' && task && !isForAddingNewTask) {
				editTask({ taskId: task._id, payload: { projectId: item._id } });
			}
		}

		if (onCloseContextMenu && !multiSelect) {
			onCloseContextMenu();
		}
	};

	const ItemOptionWithProps = ({ item, iconFill = 1 }) => {
		return (
			<ItemOption
				item={item}
				iconFill={iconFill} // Sets a default of 1 if iconFill isn't otherwise specified
				type={type}
				multiSelect={multiSelect}
				selectedItem={selectedItem}
				setSelectedItem={setSelectedItem}
				selectedItemList={selectedItemList}
				setSelectedItemList={setSelectedItemList}
				setIsVisible={setIsVisible}
				task={task}
				defaultItems={defaultItems}
				filteredItems={filteredItems}
				inboxProject={inboxProject}
				nonSmartListProjects={nonSmartListProjects}
				allProject={allProject}
				onCloseContextMenu={onCloseContextMenu}
			/>
		);
	};

	return (
		<div>
			{/* Current Item Option */}
			<div
				className="flex items-center justify-between cursor-pointer hover:bg-color-gray-300 px-2 py-[6px] rounded-lg"
				onClick={handleClick}
			>
				<div className={classNames('flex items-center gap-1', isItemSelected ? 'text-blue-500' : '')}>
					<Icon
						name={iconName}
						customClass={classNames(
							`!text-[22px] hover:text-white cursor-p`,
							isItemSelected ? 'text-blue-500' : 'text-color-gray-100'
						)}
						fill={iconFill}
					/>
					<span className="overflow-hidden text-nowrap text-ellipsis max-w-[120px]">{name}</span>
				</div>
				{isItemSelected && (
					<Icon
						name="check"
						fill={0}
						customClass={'text-blue-500 !text-[18px] hover:text-white cursor-pointer'}
					/>
				)}
			</div>

			{/* Tags - If the current tag has any children, then show them underneath with an indent. */}
			{type === 'tags' &&
				item?.children?.length > 0 &&
				item.children.map((childTagId) => {
					const childTag = tagsById[childTagId];

					return (
						<div key={childTagId} className="ml-6">
							<ItemOptionWithProps item={childTag} iconFill={0} />
						</div>
					);
				})}
		</div>
	);
};

export default ItemOption;

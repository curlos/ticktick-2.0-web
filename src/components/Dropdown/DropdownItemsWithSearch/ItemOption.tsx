import classNames from 'classnames';
import { IProject } from '../../../interfaces/interfaces';
import { SMART_LISTS } from '../../../utils/smartLists.utils';
import Icon from '../../Icon';
import { useEditTaskMutation, useGetTagsQuery } from '../../../services/api';

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
	filteredItems,
	inboxProject,
	nonSmartListProjects,
	allProject,
	onCloseContextMenu,
}) => {
	const { name, _id, isFolder } = item;
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
			return selectedItemList.find((itemInList) => itemInList._id === item._id);
		} else {
			if (type === 'project' && smartList) {
				return selectedItem.urlName === item.urlName;
			} else {
				return selectedItem._id === _id;
			}
		}
	};

	const isItemSelected = checkIfItemSelected();

	const handleClickProject = () => {
		if (multiSelect) {
			const isAllProject = item.urlName && item.urlName === 'all';
			let newSelectedProjectsList = [...selectedItemList];

			// If the project is already selected, then remove it.
			if (isItemSelected && !isAllProject) {
				newSelectedProjectsList = newSelectedProjectsList.filter(
					(projectInList) => projectInList._id !== item._id
				);
			} else {
				// If the project being selected is the "All" project, then every other selected project should be removed.
				if (isAllProject) {
					newSelectedProjectsList = [item];
				} else {
					// If a normal project is selected, remove "all" as a specific project has been chosen.
					newSelectedProjectsList = newSelectedProjectsList.filter(
						(projectInList) => projectInList && projectInList.urlName !== 'all'
					);
					newSelectedProjectsList.push(item);
				}
			}

			if (newSelectedProjectsList.length === 0) {
				const allProject = filteredItems.find((project) => project.urlName === 'all');
				newSelectedProjectsList = [allProject];
			} else {
				const allMultiSelectProjects = [inboxProject, ...nonSmartListProjects];

				if (allMultiSelectProjects.length === newSelectedProjectsList.length) {
					newSelectedProjectsList = [allProject];
				}
			}

			setSelectedItemList(newSelectedProjectsList);
		} else {
			setSelectedItem(item);
			setIsVisible(false);
		}

		if (task) {
			editTask({ taskId: task._id, payload: { projectId: item._id } });
		}

		if (onCloseContextMenu) {
			onCloseContextMenu();
		}
	};

	const handleClickTag = (e) => {
		e.stopPropagation();

		if (multiSelect) {
			let newSelectedItemList = [...selectedItemList];

			// If the item is already selected, then remove it.
			if (isItemSelected) {
				newSelectedItemList = newSelectedItemList.filter((itemInList) => itemInList._id !== item._id);
			} else {
				newSelectedItemList.push(item);
			}

			setSelectedItemList(newSelectedItemList);
		} else {
			setSelectedItem(item);
			setIsVisible(false);
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
			<div
				className="flex items-center justify-between cursor-pointer hover:bg-color-gray-300 px-2 py-[6px] rounded-lg"
				onClick={type === 'project' ? handleClickProject : handleClickTag}
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
